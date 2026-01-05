/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { UPDATE_VISIT } from '../../graphql/mutations';
import { formatDateToISO } from '../../utils';

export const description: INodeProperties[] = [
  {
    displayName: 'Visit ID',
    name: 'visitId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['visit'], operation: ['update'] } },
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['visit'], operation: ['update'] } },
    options: [
      { displayName: 'Title', name: 'title', type: 'string', default: '' },
      { displayName: 'Start At', name: 'startAt', type: 'dateTime', default: '' },
      { displayName: 'End At', name: 'endAt', type: 'dateTime', default: '' },
      { displayName: 'All Day', name: 'allDay', type: 'boolean', default: false },
      { displayName: 'Instructions', name: 'instructions', type: 'string', typeOptions: { rows: 4 }, default: '' },
      { displayName: 'Assigned User IDs', name: 'assignedUserIds', type: 'string', default: '', description: 'Comma-separated list of user IDs' },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const visitId = this.getNodeParameter('visitId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const input: IDataObject = { visitId };
  if (updateFields.title) input.title = updateFields.title;
  if (updateFields.startAt) input.startAt = formatDateToISO(updateFields.startAt as string);
  if (updateFields.endAt) input.endAt = formatDateToISO(updateFields.endAt as string);
  if (updateFields.allDay !== undefined) input.allDay = updateFields.allDay;
  if (updateFields.instructions) input.instructions = updateFields.instructions;
  if (updateFields.assignedUserIds) {
    const userIds = (updateFields.assignedUserIds as string).split(',').map(id => id.trim()).filter(Boolean);
    if (userIds.length > 0) input.assignedUserIds = userIds;
  }

  const response = await jobberGraphQLRequest.call(this, UPDATE_VISIT, { input });
  const visitUpdate = response.visitUpdate as IDataObject | undefined;
  handleUserErrors(visitUpdate);
  const visit = visitUpdate?.visit as IDataObject | undefined;
  return visit ?? {};
}
