/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors, buildLineItemsInput } from '../../transport';
import { CREATE_QUOTE } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Client ID',
    name: 'clientId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the client for this quote',
    displayOptions: {
      show: {
        resource: ['quote'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Line Items',
    name: 'lineItems',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    default: {},
    displayOptions: {
      show: {
        resource: ['quote'],
        operation: ['create'],
      },
    },
    options: [
      {
        name: 'items',
        displayName: 'Item',
        values: [
          {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            default: '',
            required: true,
          },
          {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Quantity',
            name: 'quantity',
            type: 'number',
            default: 1,
          },
          {
            displayName: 'Unit Price',
            name: 'unitPrice',
            type: 'number',
            default: 0,
          },
          {
            displayName: 'Taxable',
            name: 'taxable',
            type: 'boolean',
            default: true,
          },
        ],
      },
    ],
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['quote'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Property ID',
        name: 'propertyId',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'Message to the client',
      },
      {
        displayName: 'Valid Until',
        name: 'validUntil',
        type: 'dateTime',
        default: '',
        description: 'Quote expiration date',
      },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const clientId = this.getNodeParameter('clientId', index) as string;
  const lineItemsData = this.getNodeParameter('lineItems', index, {}) as { items?: IDataObject[] };
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const input: IDataObject = {
    clientId,
  };

  if (lineItemsData.items && lineItemsData.items.length > 0) {
    input.lineItems = buildLineItemsInput(
      lineItemsData.items as Array<{
        name: string;
        description?: string;
        quantity: number;
        unitPrice: number;
        taxable?: boolean;
      }>,
    );
  }

  if (additionalFields.propertyId) input.propertyId = additionalFields.propertyId;
  if (additionalFields.message) input.message = additionalFields.message;
  if (additionalFields.validUntil) input.validUntil = additionalFields.validUntil;

  const response = await jobberGraphQLRequest.call(this, CREATE_QUOTE, { input });
  const result = response.quoteCreate as IDataObject;

  handleUserErrors(result);

  return result.quote as IDataObject;
}
