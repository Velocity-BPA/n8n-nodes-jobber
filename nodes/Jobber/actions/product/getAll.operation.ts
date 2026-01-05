/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequestAllItems, jobberGraphQLRequest } from '../../transport';
import { GET_ALL_PRODUCTS } from '../../graphql/queries';
import { PRODUCT_CATEGORIES } from '../../constants';

export const description: INodeProperties[] = [
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: { show: { resource: ['product'], operation: ['getAll'] } },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 25,
    typeOptions: { minValue: 1, maxValue: 100 },
    displayOptions: { show: { resource: ['product'], operation: ['getAll'], returnAll: [false] } },
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: { show: { resource: ['product'], operation: ['getAll'] } },
    options: [
      {
        displayName: 'Category',
        name: 'category',
        type: 'options',
        options: PRODUCT_CATEGORIES.map(c => ({ name: c.name, value: c.value })),
        default: '',
      },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
  const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
  const variables: IDataObject = {};

  if (filters.category) variables.filter = { category: filters.category };

  if (returnAll) return jobberGraphQLRequestAllItems.call(this, GET_ALL_PRODUCTS, variables, 'productsAndServices');

  const limit = this.getNodeParameter('limit', index, 25) as number;
  variables.first = limit;
  const response = await jobberGraphQLRequest.call(this, GET_ALL_PRODUCTS, variables);
  const products = response.productsAndServices as IDataObject;
  const edges = products.edges as Array<{ node: IDataObject }>;
  return edges.map(e => e.node);
}
