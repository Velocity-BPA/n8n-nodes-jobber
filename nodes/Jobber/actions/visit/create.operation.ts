/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { CREATE_VISIT } from '../../graphql/mutations';
import { formatDateToISO } from '../../utils';

export const description: INodeProperties[] = [
  {
    displayName: 'Job ID',
    name: 'jobId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['visit'], operation: ['create'] } },
    description: 'The job to schedule the visit for',
  },
  {
    displayName: 'Title',
    name: 'title',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['visit'], operation: ['create'] } },
  },
  {
    displayName: 'Start At',
    name: 'startAt',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['visit'], operation: ['create'] } },
  },
  {
    displayName: 'End At',
    name: 'endAt',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['visit'], operation: ['create'] } },
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['visit'], operation: ['create'] } },
    options: [
      { displayName: 'All Day', name: 'allDay', type: 'boolean', default: false },
      { displayName: 'Instructions', name: 'instructions', type: 'string', typeOptions: { rows: 4 }, default: '' },
      { displayName: 'Assigned User IDs', name: 'assignedUserIds', type: 'string', default: '', description: 'Comma-separated list of user IDs' },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const jobId = this.getNodeParameter('jobId', index) as string;
  const title = this.getNodeParameter('title', index) as string;
  const startAt = this.getNodeParameter('startAt', index) as string;
  const endAt = this.getNodeParameter('endAt', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const input: IDataObject = {
    jobId,
    title,
    startAt: formatDateToISO(startAt),
    endAt: formatDateToISO(endAt),
  };

  if (additionalFields.allDay !== undefined) input.allDay = additionalFields.allDay;
  if (additionalFields.instructions) input.instructions = additionalFields.instructions;
  if (additionalFields.assignedUserIds) {
    const userIds = (additionalFields.assignedUserIds as string).split(',').map(id => id.trim()).filter(Boolean);
    if (userIds.length > 0) input.assignedUserIds = userIds;
  }

  const response = await jobberGraphQLRequest.call(this, CREATE_VISIT, { input });
  const visitCreate = response.visitCreate as IDataObject | undefined;
  handleUserErrors(visitCreate);
  const visit = visitCreate?.visit as IDataObject | undefined;
  return visit ?? {};
}
