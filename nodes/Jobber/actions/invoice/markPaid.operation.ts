/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { MARK_INVOICE_PAID } from '../../graphql/mutations';
import { PAYMENT_METHODS } from '../../constants';
import { formatDateToISO } from '../../utils';

export const description: INodeProperties[] = [
  {
    displayName: 'Invoice ID',
    name: 'invoiceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['invoice'], operation: ['markPaid'] } },
  },
  {
    displayName: 'Payment Method',
    name: 'paymentMethod',
    type: 'options',
    options: PAYMENT_METHODS.map(m => ({ name: m.name, value: m.value })),
    default: 'CASH',
    displayOptions: { show: { resource: ['invoice'], operation: ['markPaid'] } },
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['invoice'], operation: ['markPaid'] } },
    options: [
      { displayName: 'Received At', name: 'receivedAt', type: 'dateTime', default: '' },
      { displayName: 'Note', name: 'note', type: 'string', default: '' },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const invoiceId = this.getNodeParameter('invoiceId', index) as string;
  const paymentMethod = this.getNodeParameter('paymentMethod', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const input: IDataObject = { invoiceId, paymentMethod };
  if (options.receivedAt) input.receivedAt = formatDateToISO(options.receivedAt as string);
  if (options.note) input.note = options.note;

  const response = await jobberGraphQLRequest.call(this, MARK_INVOICE_PAID, { input });
  const invoiceMarkPaid = response.invoiceMarkPaid as IDataObject | undefined;
  handleUserErrors(invoiceMarkPaid);
  const invoice = invoiceMarkPaid?.invoice as IDataObject | undefined;
  return invoice ?? {};
}
