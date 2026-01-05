/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { DELETE_TIME_ENTRY } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Time Entry ID',
    name: 'timeEntryId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['timeEntry'], operation: ['delete'] } },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const timeEntryId = this.getNodeParameter('timeEntryId', index) as string;
  const response = await jobberGraphQLRequest.call(this, DELETE_TIME_ENTRY, {
    input: { timeEntryId },
  });
  handleUserErrors(response.timeEntryDelete);
  return { success: true, timeEntryId };
}
