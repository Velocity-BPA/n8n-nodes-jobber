/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest } from '../../transport';
import { GET_PRODUCT } from '../../graphql/queries';

export const description: INodeProperties[] = [
  {
    displayName: 'Product/Service ID',
    name: 'productId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['product'], operation: ['get'] } },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const productId = this.getNodeParameter('productId', index) as string;
  const response = await jobberGraphQLRequest.call(this, GET_PRODUCT, { id: productId });
  return response.productOrService as IDataObject;
}
