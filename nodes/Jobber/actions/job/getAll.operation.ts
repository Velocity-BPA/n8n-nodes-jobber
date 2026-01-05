/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequestAllItems, jobberGraphQLRequest } from '../../transport';
import { GET_ALL_JOBS } from '../../graphql/queries';
import { JOB_STATUSES } from '../../constants';

export const description: INodeProperties[] = [
  { displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false, displayOptions: { show: { resource: ['job'], operation: ['getAll'] } } },
  { displayName: 'Limit', name: 'limit', type: 'number', default: 25, typeOptions: { minValue: 1, maxValue: 100 }, displayOptions: { show: { resource: ['job'], operation: ['getAll'], returnAll: [false] } } },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: { show: { resource: ['job'], operation: ['getAll'] } },
    options: [
      { displayName: 'Status', name: 'status', type: 'options', options: JOB_STATUSES.map(s => ({ name: s.name, value: s.value })), default: '' },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
  const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
  const variables: IDataObject = {};
  if (filters.status) variables.filter = { jobStatus: filters.status };

  if (returnAll) return jobberGraphQLRequestAllItems.call(this, GET_ALL_JOBS, variables, 'jobs');

  const limit = this.getNodeParameter('limit', index, 25) as number;
  variables.first = limit;
  const response = await jobberGraphQLRequest.call(this, GET_ALL_JOBS, variables);
  const jobs = response.jobs as IDataObject;
  const edges = jobs.edges as Array<{ node: IDataObject }>;
  return edges.map(e => e.node);
}
