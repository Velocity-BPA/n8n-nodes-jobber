/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequestAllItems, jobberGraphQLRequest } from '../../transport';
import { GET_ALL_PROPERTIES } from '../../graphql/queries';

export const description: INodeProperties[] = [
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    description: 'Whether to return all results or only up to a given limit',
    displayOptions: {
      show: {
        resource: ['property'],
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
        resource: ['property'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
  const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;

  if (returnAll) {
    return jobberGraphQLRequestAllItems.call(this, GET_ALL_PROPERTIES, {}, 'properties');
  }

  const limit = this.getNodeParameter('limit', index, 25) as number;
  const response = await jobberGraphQLRequest.call(this, GET_ALL_PROPERTIES, { first: limit });
  const properties = response.properties as IDataObject;
  const edges = properties.edges as Array<{ node: IDataObject }>;

  return edges.map((edge) => edge.node);
}
