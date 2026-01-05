/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors, buildLineItemsInput } from '../../transport';
import { CREATE_INVOICE } from '../../graphql/mutations';
import { formatDateToISO, parseJsonArrayInput } from '../../utils';

export const description: INodeProperties[] = [
  {
    displayName: 'Client ID',
    name: 'clientId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['invoice'], operation: ['create'] } },
  },
  {
    displayName: 'Line Items (JSON)',
    name: 'lineItems',
    type: 'json',
    required: true,
    default: '[]',
    displayOptions: { show: { resource: ['invoice'], operation: ['create'] } },
    description: 'JSON array of line items: [{"name": "Service", "quantity": 1, "unitPrice": 100}]',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['invoice'], operation: ['create'] } },
    options: [
      { displayName: 'Subject', name: 'subject', type: 'string', default: '' },
      { displayName: 'Message', name: 'message', type: 'string', typeOptions: { rows: 4 }, default: '' },
      { displayName: 'Due Date', name: 'dueDate', type: 'dateTime', default: '' },
      { displayName: 'Job ID', name: 'jobId', type: 'string', default: '', description: 'Associate invoice with a job' },
      { displayName: 'Property ID', name: 'propertyId', type: 'string', default: '' },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const clientId = this.getNodeParameter('clientId', index) as string;
  const lineItemsRaw = this.getNodeParameter('lineItems', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const lineItemsData = parseJsonArrayInput(lineItemsRaw);
  const lineItems = buildLineItemsInput(lineItemsData as Array<{
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    taxable?: boolean;
  }>);

  const input: IDataObject = {
    clientId,
    lineItems,
  };

  if (additionalFields.subject) input.subject = additionalFields.subject;
  if (additionalFields.message) input.message = additionalFields.message;
  if (additionalFields.dueDate) input.dueDate = formatDateToISO(additionalFields.dueDate as string);
  if (additionalFields.jobId) input.jobId = additionalFields.jobId;
  if (additionalFields.propertyId) input.propertyId = additionalFields.propertyId;

  const response = await jobberGraphQLRequest.call(this, CREATE_INVOICE, { input });
  const result = response.invoiceCreate as IDataObject;
  handleUserErrors(result);
  return (result?.invoice ?? result) as IDataObject;
}
