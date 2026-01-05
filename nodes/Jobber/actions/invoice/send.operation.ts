/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { SEND_INVOICE } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Invoice ID',
    name: 'invoiceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['invoice'], operation: ['send'] } },
  },
  {
    displayName: 'Delivery Method',
    name: 'deliveryMethod',
    type: 'options',
    options: [
      { name: 'Email', value: 'EMAIL' },
      { name: 'SMS', value: 'SMS' },
    ],
    default: 'EMAIL',
    displayOptions: { show: { resource: ['invoice'], operation: ['send'] } },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const invoiceId = this.getNodeParameter('invoiceId', index) as string;
  const deliveryMethod = this.getNodeParameter('deliveryMethod', index, 'EMAIL') as string;

  const response = await jobberGraphQLRequest.call(this, SEND_INVOICE, {
    input: { invoiceId, deliveryMethod },
  });
  const invoiceSend = response.invoiceSend as IDataObject | undefined;
  handleUserErrors(invoiceSend);
  const invoice = invoiceSend?.invoice as IDataObject | undefined;
  return invoice ?? {};
}
