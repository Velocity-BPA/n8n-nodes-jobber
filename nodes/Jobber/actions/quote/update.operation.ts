/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors, buildLineItemsInput } from '../../transport';
import { UPDATE_QUOTE } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Quote ID',
    name: 'quoteId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['quote'], operation: ['update'] } },
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['quote'], operation: ['update'] } },
    options: [
      { displayName: 'Message', name: 'message', type: 'string', typeOptions: { rows: 4 }, default: '' },
      { displayName: 'Valid Until', name: 'validUntil', type: 'dateTime', default: '' },
      {
        displayName: 'Line Items',
        name: 'lineItems',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        default: {},
        options: [
          {
            name: 'items',
            displayName: 'Item',
            values: [
              { displayName: 'Name', name: 'name', type: 'string', default: '', required: true },
              { displayName: 'Description', name: 'description', type: 'string', default: '' },
              { displayName: 'Quantity', name: 'quantity', type: 'number', default: 1 },
              { displayName: 'Unit Price', name: 'unitPrice', type: 'number', default: 0 },
              { displayName: 'Taxable', name: 'taxable', type: 'boolean', default: true },
            ],
          },
        ],
      },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const quoteId = this.getNodeParameter('quoteId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const input: IDataObject = {};
  if (updateFields.message) input.message = updateFields.message;
  if (updateFields.validUntil) input.validUntil = updateFields.validUntil;
  if (updateFields.lineItems) {
    const lineItemsData = updateFields.lineItems as { items?: IDataObject[] };
    if (lineItemsData.items && lineItemsData.items.length > 0) {
      input.lineItems = buildLineItemsInput(lineItemsData.items as Array<{ name: string; description?: string; quantity: number; unitPrice: number; taxable?: boolean }>);
    }
  }

  const response = await jobberGraphQLRequest.call(this, UPDATE_QUOTE, { id: quoteId, input });
  const result = response.quoteUpdate as IDataObject;
  handleUserErrors(result);
  return result.quote as IDataObject;
}
