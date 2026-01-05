/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import {
  jobberGraphQLRequest,
  handleUserErrors,
  buildEmailsInput,
  buildPhonesInput,
  buildAddressInput,
} from '../../transport';
import { UPDATE_CLIENT } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Client ID',
    name: 'clientId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the client to update',
    displayOptions: {
      show: {
        resource: ['client'],
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
        resource: ['client'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Company Name',
        name: 'companyName',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Is Company',
        name: 'isCompany',
        type: 'boolean',
        default: false,
      },
      {
        displayName: 'Is Lead',
        name: 'isLead',
        type: 'boolean',
        default: false,
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        description: 'Comma-separated list of tags',
      },
      {
        displayName: 'Emails',
        name: 'emails',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        options: [
          {
            name: 'emailValues',
            displayName: 'Email',
            values: [
              {
                displayName: 'Email Address',
                name: 'address',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Description',
                name: 'description',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Primary',
                name: 'primary',
                type: 'boolean',
                default: false,
              },
            ],
          },
        ],
      },
      {
        displayName: 'Phones',
        name: 'phones',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        options: [
          {
            name: 'phoneValues',
            displayName: 'Phone',
            values: [
              {
                displayName: 'Phone Number',
                name: 'number',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Description',
                name: 'description',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Primary',
                name: 'primary',
                type: 'boolean',
                default: false,
              },
              {
                displayName: 'SMS Allowed',
                name: 'smsAllowed',
                type: 'boolean',
                default: false,
              },
            ],
          },
        ],
      },
      {
        displayName: 'Billing Address',
        name: 'billingAddress',
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
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const clientId = this.getNodeParameter('clientId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const input: IDataObject = {};

  if (updateFields.firstName) input.firstName = updateFields.firstName;
  if (updateFields.lastName) input.lastName = updateFields.lastName;
  if (updateFields.companyName) input.companyName = updateFields.companyName;
  if (updateFields.isCompany !== undefined) input.isCompany = updateFields.isCompany;
  if (updateFields.isLead !== undefined) input.isLead = updateFields.isLead;

  if (updateFields.tags) {
    const tagsString = updateFields.tags as string;
    input.tags = tagsString.split(',').map((t) => t.trim());
  }

  if (updateFields.emails) {
    const emailsData = updateFields.emails as { emailValues?: IDataObject[] };
    if (emailsData.emailValues && emailsData.emailValues.length > 0) {
      input.emails = buildEmailsInput(
        emailsData.emailValues as Array<{
          address: string;
          description?: string;
          primary?: boolean;
        }>,
      );
    }
  }

  if (updateFields.phones) {
    const phonesData = updateFields.phones as { phoneValues?: IDataObject[] };
    if (phonesData.phoneValues && phonesData.phoneValues.length > 0) {
      input.phones = buildPhonesInput(
        phonesData.phoneValues as Array<{
          number: string;
          description?: string;
          primary?: boolean;
          smsAllowed?: boolean;
        }>,
      );
    }
  }

  if (updateFields.billingAddress) {
    const addressData = updateFields.billingAddress as { addressValues?: IDataObject };
    if (addressData.addressValues) {
      input.billingAddress = buildAddressInput(addressData.addressValues);
    }
  }

  const response = await jobberGraphQLRequest.call(this, UPDATE_CLIENT, { id: clientId, input });
  const result = response.clientUpdate as IDataObject;

  handleUserErrors(result);

  return result.client as IDataObject;
}
