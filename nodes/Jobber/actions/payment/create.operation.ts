/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { CREATE_PAYMENT } from '../../graphql/mutations';
import { PAYMENT_METHODS } from '../../constants';
import { formatDateToISO } from '../../utils';

export const description: INodeProperties[] = [
  {
    displayName: 'Invoice ID',
    name: 'invoiceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['payment'], operation: ['create'] } },
    description: 'The invoice to apply this payment to',
  },
  {
    displayName: 'Amount',
    name: 'amount',
    type: 'number',
    required: true,
    default: 0,
    typeOptions: { numberPrecision: 2 },
    displayOptions: { show: { resource: ['payment'], operation: ['create'] } },
    description: 'Payment amount',
  },
  {
    displayName: 'Payment Method',
    name: 'paymentMethod',
    type: 'options',
    options: PAYMENT_METHODS.map(m => ({ name: m.name, value: m.value })),
    default: 'CASH',
    displayOptions: { show: { resource: ['payment'], operation: ['create'] } },
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['payment'], operation: ['create'] } },
    options: [
      { displayName: 'Received At', name: 'receivedAt', type: 'dateTime', default: '' },
      { displayName: 'Note', name: 'note', type: 'string', default: '' },
      { displayName: 'Check Number', name: 'checkNumber', type: 'string', default: '' },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const invoiceId = this.getNodeParameter('invoiceId', index) as string;
  const amount = this.getNodeParameter('amount', index) as number;
  const paymentMethod = this.getNodeParameter('paymentMethod', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const input: IDataObject = {
    invoiceId,
    amount,
    paymentMethod,
  };

  if (additionalFields.receivedAt) input.receivedAt = formatDateToISO(additionalFields.receivedAt as string);
  if (additionalFields.note) input.note = additionalFields.note;
  if (additionalFields.checkNumber) input.checkNumber = additionalFields.checkNumber;

  const response = await jobberGraphQLRequest.call(this, CREATE_PAYMENT, { input });
  const paymentCreate = response.paymentCreate as IDataObject | undefined;
  handleUserErrors(paymentCreate);
  const payment = paymentCreate?.payment as IDataObject | undefined;
  return payment ?? {};
}
