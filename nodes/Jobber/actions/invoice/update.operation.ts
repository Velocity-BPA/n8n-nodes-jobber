/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors, buildLineItemsInput } from '../../transport';
import { UPDATE_INVOICE } from '../../graphql/mutations';
import { formatDateToISO, parseJsonArrayInput } from '../../utils';

export const description: INodeProperties[] = [
  {
    displayName: 'Invoice ID',
    name: 'invoiceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['invoice'], operation: ['update'] } },
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['invoice'], operation: ['update'] } },
    options: [
      { displayName: 'Subject', name: 'subject', type: 'string', default: '' },
      { displayName: 'Message', name: 'message', type: 'string', typeOptions: { rows: 4 }, default: '' },
      { displayName: 'Due Date', name: 'dueDate', type: 'dateTime', default: '' },
      { displayName: 'Line Items (JSON)', name: 'lineItems', type: 'json', default: '[]' },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const invoiceId = this.getNodeParameter('invoiceId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const input: IDataObject = { invoiceId };
  if (updateFields.subject) input.subject = updateFields.subject;
  if (updateFields.message) input.message = updateFields.message;
  if (updateFields.dueDate) input.dueDate = formatDateToISO(updateFields.dueDate as string);
  if (updateFields.lineItems) {
    const lineItems = parseJsonArrayInput(updateFields.lineItems as string);
    input.lineItems = buildLineItemsInput(lineItems as Array<{
      name: string;
      description?: string;
      quantity: number;
      unitPrice: number;
      taxable?: boolean;
    }>);
  }

  const response = await jobberGraphQLRequest.call(this, UPDATE_INVOICE, { input });
  const invoiceUpdate = response.invoiceUpdate as IDataObject | undefined;
  handleUserErrors(invoiceUpdate);
  const invoice = invoiceUpdate?.invoice as IDataObject | undefined;
  return invoice ?? {};
}
