/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest } from '../../transport';
import { GET_INVOICE } from '../../graphql/queries';

export const description: INodeProperties[] = [
  {
    displayName: 'Invoice ID',
    name: 'invoiceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['invoice'], operation: ['get'] } },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const invoiceId = this.getNodeParameter('invoiceId', index) as string;
  const response = await jobberGraphQLRequest.call(this, GET_INVOICE, { id: invoiceId });
  return response.invoice as IDataObject;
}
