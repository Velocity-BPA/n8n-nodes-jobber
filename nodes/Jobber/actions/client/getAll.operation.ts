/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequestAllItems, jobberGraphQLRequest } from '../../transport';
import { GET_ALL_CLIENTS } from '../../graphql/queries';

export const description: INodeProperties[] = [
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    description: 'Whether to return all results or only up to a given limit',
    displayOptions: {
      show: {
        resource: ['client'],
        operation: ['getAll'],
      },
    },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 25,
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    displayOptions: {
      show: {
        resource: ['client'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['client'],
        operation: ['getAll'],
      },
    },
    options: [
      {
        displayName: 'Search Term',
        name: 'searchTerm',
        type: 'string',
        default: '',
        description: 'Search clients by name, email, or phone',
      },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
  const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

  const variables: IDataObject = {};

  if (filters.searchTerm) {
    variables.searchTerm = filters.searchTerm;
  }

  if (returnAll) {
    return jobberGraphQLRequestAllItems.call(this, GET_ALL_CLIENTS, variables, 'clients');
  }

  const limit = this.getNodeParameter('limit', index, 25) as number;
  variables.first = limit;

  const response = await jobberGraphQLRequest.call(this, GET_ALL_CLIENTS, variables);
  const clients = response.clients as IDataObject;
  const edges = clients.edges as Array<{ node: IDataObject }>;

  return edges.map((edge) => edge.node);
}
