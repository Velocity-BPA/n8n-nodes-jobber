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
import { CREATE_CLIENT } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'First Name',
    name: 'firstName',
    type: 'string',
    default: '',
    description: 'First name of the client',
    displayOptions: {
      show: {
        resource: ['client'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Last Name',
    name: 'lastName',
    type: 'string',
    default: '',
    description: 'Last name of the client',
    displayOptions: {
      show: {
        resource: ['client'],
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['client'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Company Name',
        name: 'companyName',
        type: 'string',
        default: '',
        description: 'Company name for business clients',
      },
      {
        displayName: 'Is Company',
        name: 'isCompany',
        type: 'boolean',
        default: false,
        description: 'Whether this is a business client',
      },
      {
        displayName: 'Is Lead',
        name: 'isLead',
        type: 'boolean',
        default: false,
        description: 'Whether this client is a lead',
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
                placeholder: 'name@example.com',
              },
              {
                displayName: 'Description',
                name: 'description',
                type: 'string',
                default: '',
                placeholder: 'Work, Personal, etc.',
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
                placeholder: 'Mobile, Home, Work, etc.',
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
  const firstName = this.getNodeParameter('firstName', index, '') as string;
  const lastName = this.getNodeParameter('lastName', index, '') as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const input: IDataObject = {};

  if (firstName) input.firstName = firstName;
  if (lastName) input.lastName = lastName;
  if (additionalFields.companyName) input.companyName = additionalFields.companyName;
  if (additionalFields.isCompany !== undefined) input.isCompany = additionalFields.isCompany;
  if (additionalFields.isLead !== undefined) input.isLead = additionalFields.isLead;

  if (additionalFields.tags) {
    const tagsString = additionalFields.tags as string;
    input.tags = tagsString.split(',').map((t) => t.trim());
  }

  if (additionalFields.emails) {
    const emailsData = additionalFields.emails as { emailValues?: IDataObject[] };
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

  if (additionalFields.phones) {
    const phonesData = additionalFields.phones as { phoneValues?: IDataObject[] };
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

  if (additionalFields.billingAddress) {
    const addressData = additionalFields.billingAddress as { addressValues?: IDataObject };
    if (addressData.addressValues) {
      input.billingAddress = buildAddressInput(addressData.addressValues);
    }
  }

  const response = await jobberGraphQLRequest.call(this, CREATE_CLIENT, { input });
  const result = response.clientCreate as IDataObject;

  handleUserErrors(result);

  return result.client as IDataObject;
}
