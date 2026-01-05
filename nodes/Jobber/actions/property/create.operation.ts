/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors, buildAddressInput } from '../../transport';
import { CREATE_PROPERTY } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Client ID',
    name: 'clientId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the client this property belongs to',
    displayOptions: {
      show: {
        resource: ['property'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Address',
    name: 'address',
    type: 'fixedCollection',
    default: {},
    displayOptions: {
      show: {
        resource: ['property'],
        operation: ['create'],
      },
    },
    options: [
      {
        name: 'addressValues',
        displayName: 'Address',
        values: [
          {
            displayName: 'Street 1',
            name: 'street1',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Street 2',
            name: 'street2',
            type: 'string',
            default: '',
          },
          {
            displayName: 'City',
            name: 'city',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Province/State',
            name: 'province',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Postal Code',
            name: 'postalCode',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Country',
            name: 'country',
            type: 'string',
            default: '',
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
        resource: ['property'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Tax Rate',
        name: 'taxRate',
        type: 'number',
        default: 0,
        description: 'Tax rate percentage for this property',
      },
      {
        displayName: 'Notes',
        name: 'notes',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        description: 'Notes about this property',
      },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const clientId = this.getNodeParameter('clientId', index) as string;
  const address = this.getNodeParameter('address', index, {}) as { addressValues?: IDataObject };
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const input: IDataObject = {
    clientId,
  };

  if (address.addressValues) {
    input.address = buildAddressInput(address.addressValues);
  }

  if (additionalFields.taxRate !== undefined) input.taxRate = additionalFields.taxRate;
  if (additionalFields.notes) input.notes = additionalFields.notes;

  const response = await jobberGraphQLRequest.call(this, CREATE_PROPERTY, { input });
  const result = response.propertyCreate as IDataObject;

  handleUserErrors(result);

  return result.property as IDataObject;
}
