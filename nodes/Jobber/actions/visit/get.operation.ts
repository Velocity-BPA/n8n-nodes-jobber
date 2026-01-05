/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest } from '../../transport';
import { GET_VISIT } from '../../graphql/queries';

export const description: INodeProperties[] = [
  {
    displayName: 'Visit ID',
    name: 'visitId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['visit'], operation: ['get'] } },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const visitId = this.getNodeParameter('visitId', index) as string;
  const response = await jobberGraphQLRequest.call(this, GET_VISIT, { id: visitId });
  return response.visit as IDataObject;
}
