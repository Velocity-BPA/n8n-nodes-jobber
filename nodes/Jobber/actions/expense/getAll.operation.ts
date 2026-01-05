/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequestAllItems, jobberGraphQLRequest } from '../../transport';
import { GET_ALL_EXPENSES } from '../../graphql/queries';

export const description: INodeProperties[] = [
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: { show: { resource: ['expense'], operation: ['getAll'] } },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 25,
    typeOptions: { minValue: 1, maxValue: 100 },
    displayOptions: { show: { resource: ['expense'], operation: ['getAll'], returnAll: [false] } },
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: { show: { resource: ['expense'], operation: ['getAll'] } },
    options: [
      { displayName: 'Job ID', name: 'jobId', type: 'string', default: '' },
      { displayName: 'User ID', name: 'userId', type: 'string', default: '' },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
  const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
  const variables: IDataObject = {};

  const filter: IDataObject = {};
  if (filters.jobId) filter.jobId = filters.jobId;
  if (filters.userId) filter.userId = filters.userId;
  if (Object.keys(filter).length > 0) variables.filter = filter;

  if (returnAll) return jobberGraphQLRequestAllItems.call(this, GET_ALL_EXPENSES, variables, 'expenses');

  const limit = this.getNodeParameter('limit', index, 25) as number;
  variables.first = limit;
  const response = await jobberGraphQLRequest.call(this, GET_ALL_EXPENSES, variables);
  const expenses = response.expenses as IDataObject;
  const edges = expenses.edges as Array<{ node: IDataObject }>;
  return edges.map(e => e.node);
}
