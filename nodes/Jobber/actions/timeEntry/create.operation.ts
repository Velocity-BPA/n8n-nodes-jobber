/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { CREATE_TIME_ENTRY } from '../../graphql/mutations';
import { formatDateToISO } from '../../utils';

export const description: INodeProperties[] = [
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['timeEntry'], operation: ['create'] } },
    description: 'The team member this time entry is for',
  },
  {
    displayName: 'Start At',
    name: 'startAt',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['timeEntry'], operation: ['create'] } },
  },
  {
    displayName: 'End At',
    name: 'endAt',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['timeEntry'], operation: ['create'] } },
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['timeEntry'], operation: ['create'] } },
    options: [
      { displayName: 'Visit ID', name: 'visitId', type: 'string', default: '', description: 'Associate with a visit' },
      { displayName: 'Note', name: 'note', type: 'string', typeOptions: { rows: 4 }, default: '' },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const userId = this.getNodeParameter('userId', index) as string;
  const startAt = this.getNodeParameter('startAt', index) as string;
  const endAt = this.getNodeParameter('endAt', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const input: IDataObject = {
    userId,
    startAt: formatDateToISO(startAt),
    endAt: formatDateToISO(endAt),
  };

  if (additionalFields.visitId) input.visitId = additionalFields.visitId;
  if (additionalFields.note) input.note = additionalFields.note;

  const response = await jobberGraphQLRequest.call(this, CREATE_TIME_ENTRY, { input });
  const timeEntryCreate = response.timeEntryCreate as IDataObject | undefined;
  handleUserErrors(timeEntryCreate);
  const timeEntry = timeEntryCreate?.timeEntry as IDataObject | undefined;
  return timeEntry ?? {};
}
