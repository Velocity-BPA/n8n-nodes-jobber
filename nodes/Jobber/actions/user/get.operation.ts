/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest } from '../../transport';
import { GET_USER } from '../../graphql/queries';

export const description: INodeProperties[] = [
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['user'], operation: ['get'] } },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const userId = this.getNodeParameter('userId', index) as string;
  const response = await jobberGraphQLRequest.call(this, GET_USER, { id: userId });
  return response.user as IDataObject;
}
