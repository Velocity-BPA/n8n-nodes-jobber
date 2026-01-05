/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors, buildAddressInput } from '../../transport';
import { UPDATE_PROPERTY } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Property ID',
    name: 'propertyId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the property to update',
    displayOptions: {
      show: {
        resource: ['property'],
        operation: ['update'],
      },
    },
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['property'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Address',
        name: 'address',
        type: 'fixedCollection',
        default: {},
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
        displayName: 'Tax Rate',
        name: 'taxRate',
        type: 'number',
        default: 0,
      },
      {
        displayName: 'Notes',
        name: 'notes',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
      },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const propertyId = this.getNodeParameter('propertyId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const input: IDataObject = {};

  if (updateFields.address) {
    const addressData = updateFields.address as { addressValues?: IDataObject };
    if (addressData.addressValues) {
      input.address = buildAddressInput(addressData.addressValues);
    }
  }

  if (updateFields.taxRate !== undefined) input.taxRate = updateFields.taxRate;
  if (updateFields.notes) input.notes = updateFields.notes;

  const response = await jobberGraphQLRequest.call(this, UPDATE_PROPERTY, {
    id: propertyId,
    input,
  });
  const result = response.propertyUpdate as IDataObject;

  handleUserErrors(result);

  return result.property as IDataObject;
}
