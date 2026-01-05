/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequestAllItems, jobberGraphQLRequest } from '../../transport';
import { GET_ALL_USERS } from '../../graphql/queries';

export const description: INodeProperties[] = [
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: { show: { resource: ['user'], operation: ['getAll'] } },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 25,
    typeOptions: { minValue: 1, maxValue: 100 },
    displayOptions: { show: { resource: ['user'], operation: ['getAll'], returnAll: [false] } },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
  const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
  const variables: IDataObject = {};

  if (returnAll) return jobberGraphQLRequestAllItems.call(this, GET_ALL_USERS, variables, 'users');

  const limit = this.getNodeParameter('limit', index, 25) as number;
  variables.first = limit;
  const response = await jobberGraphQLRequest.call(this, GET_ALL_USERS, variables);
  const users = response.users as IDataObject;
  const edges = users.edges as Array<{ node: IDataObject }>;
  return edges.map(e => e.node);
}
