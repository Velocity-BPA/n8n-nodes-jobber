/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest } from '../../transport';
import { GET_PAYMENT } from '../../graphql/queries';

export const description: INodeProperties[] = [
  {
    displayName: 'Payment ID',
    name: 'paymentId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['payment'], operation: ['get'] } },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const paymentId = this.getNodeParameter('paymentId', index) as string;
  const response = await jobberGraphQLRequest.call(this, GET_PAYMENT, { id: paymentId });
  return response.payment as IDataObject;
}
