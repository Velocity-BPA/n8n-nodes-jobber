/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { DELETE_PRODUCT } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Product/Service ID',
    name: 'productId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['product'], operation: ['delete'] } },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const productId = this.getNodeParameter('productId', index) as string;
  const response = await jobberGraphQLRequest.call(this, DELETE_PRODUCT, {
    input: { productOrServiceId: productId },
  });
  handleUserErrors(response.productOrServiceDelete);
  return { success: true, productId };
}
