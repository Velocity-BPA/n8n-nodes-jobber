/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { VOID_INVOICE } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Invoice ID',
    name: 'invoiceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['invoice'], operation: ['void'] } },
    description: 'The ID of the invoice to void',
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const invoiceId = this.getNodeParameter('invoiceId', index) as string;

  const response = await jobberGraphQLRequest.call(this, VOID_INVOICE, { id: invoiceId });

  const invoiceVoid = response.invoiceVoid as IDataObject | undefined;
  handleUserErrors(invoiceVoid);
  const invoice = invoiceVoid?.invoice as IDataObject | undefined;
  return invoice ?? {};
}
