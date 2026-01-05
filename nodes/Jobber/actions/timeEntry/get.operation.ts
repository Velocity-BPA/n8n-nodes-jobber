/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest } from '../../transport';
import { GET_TIME_ENTRY } from '../../graphql/queries';

export const description: INodeProperties[] = [
  {
    displayName: 'Time Entry ID',
    name: 'timeEntryId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['timeEntry'], operation: ['get'] } },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const timeEntryId = this.getNodeParameter('timeEntryId', index) as string;
  const response = await jobberGraphQLRequest.call(this, GET_TIME_ENTRY, { id: timeEntryId });
  return response.timeEntry as IDataObject;
}
