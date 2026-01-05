/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors, buildLineItemsInput } from '../../transport';
import { CREATE_JOB } from '../../graphql/mutations';
import { JOB_TYPES } from '../../constants';

export const description: INodeProperties[] = [
  {
    displayName: 'Client ID',
    name: 'clientId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['job'], operation: ['create'] } },
  },
  {
    displayName: 'Title',
    name: 'title',
    type: 'string',
    default: '',
    displayOptions: { show: { resource: ['job'], operation: ['create'] } },
  },
  {
    displayName: 'Line Items',
    name: 'lineItems',
    type: 'fixedCollection',
    typeOptions: { multipleValues: true },
    default: {},
    displayOptions: { show: { resource: ['job'], operation: ['create'] } },
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
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['job'], operation: ['create'] } },
    options: [
      { displayName: 'Property ID', name: 'propertyId', type: 'string', default: '' },
      { displayName: 'Job Type', name: 'jobType', type: 'options', options: JOB_TYPES.map(t => ({ name: t.name, value: t.value })), default: 'one_off' },
      { displayName: 'Instructions', name: 'instructions', type: 'string', typeOptions: { rows: 4 }, default: '' },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const clientId = this.getNodeParameter('clientId', index) as string;
  const title = this.getNodeParameter('title', index, '') as string;
  const lineItemsData = this.getNodeParameter('lineItems', index, {}) as { items?: IDataObject[] };
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const input: IDataObject = { clientId };
  if (title) input.title = title;
  if (lineItemsData.items && lineItemsData.items.length > 0) {
    input.lineItems = buildLineItemsInput(lineItemsData.items as Array<{ name: string; description?: string; quantity: number; unitPrice: number; taxable?: boolean }>);
  }
  if (additionalFields.propertyId) input.propertyId = additionalFields.propertyId;
  if (additionalFields.jobType) input.jobType = additionalFields.jobType;
  if (additionalFields.instructions) input.instructions = additionalFields.instructions;

  const response = await jobberGraphQLRequest.call(this, CREATE_JOB, { input });
  const result = response.jobCreate as IDataObject;
  handleUserErrors(result);
  return result.job as IDataObject;
}
