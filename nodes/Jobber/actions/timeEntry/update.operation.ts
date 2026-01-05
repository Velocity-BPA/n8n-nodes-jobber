/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { UPDATE_TIME_ENTRY } from '../../graphql/mutations';
import { formatDateToISO } from '../../utils';

export const description: INodeProperties[] = [
  {
    displayName: 'Time Entry ID',
    name: 'timeEntryId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['timeEntry'], operation: ['update'] } },
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['timeEntry'], operation: ['update'] } },
    options: [
      { displayName: 'Start At', name: 'startAt', type: 'dateTime', default: '' },
      { displayName: 'End At', name: 'endAt', type: 'dateTime', default: '' },
      { displayName: 'Note', name: 'note', type: 'string', typeOptions: { rows: 4 }, default: '' },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const timeEntryId = this.getNodeParameter('timeEntryId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const input: IDataObject = { timeEntryId };
  if (updateFields.startAt) input.startAt = formatDateToISO(updateFields.startAt as string);
  if (updateFields.endAt) input.endAt = formatDateToISO(updateFields.endAt as string);
  if (updateFields.note) input.note = updateFields.note;

  const response = await jobberGraphQLRequest.call(this, UPDATE_TIME_ENTRY, { input });
  const timeEntryUpdate = response.timeEntryUpdate as IDataObject | undefined;
  handleUserErrors(timeEntryUpdate);
  const timeEntry = timeEntryUpdate?.timeEntry as IDataObject | undefined;
  return timeEntry ?? {};
}
