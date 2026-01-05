/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { CREATE_PRODUCT } from '../../graphql/mutations';
import { PRODUCT_CATEGORIES } from '../../constants';

export const description: INodeProperties[] = [
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['product'], operation: ['create'] } },
  },
  {
    displayName: 'Category',
    name: 'category',
    type: 'options',
    options: PRODUCT_CATEGORIES.map(c => ({ name: c.name, value: c.value })),
    default: 'SERVICE',
    displayOptions: { show: { resource: ['product'], operation: ['create'] } },
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['product'], operation: ['create'] } },
    options: [
      { displayName: 'Description', name: 'description', type: 'string', typeOptions: { rows: 4 }, default: '' },
      { displayName: 'Default Unit Cost', name: 'defaultUnitCost', type: 'number', typeOptions: { numberPrecision: 2 }, default: 0 },
      { displayName: 'Taxable', name: 'taxable', type: 'boolean', default: true },
      { displayName: 'Online Bookable', name: 'onlineBookable', type: 'boolean', default: false },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const name = this.getNodeParameter('name', index) as string;
  const category = this.getNodeParameter('category', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const input: IDataObject = {
    name,
    category,
  };

  if (additionalFields.description) input.description = additionalFields.description;
  if (additionalFields.defaultUnitCost !== undefined) input.defaultUnitCost = additionalFields.defaultUnitCost;
  if (additionalFields.taxable !== undefined) input.taxable = additionalFields.taxable;
  if (additionalFields.onlineBookable !== undefined) input.onlineBookable = additionalFields.onlineBookable;

  const response = await jobberGraphQLRequest.call(this, CREATE_PRODUCT, { input });
  const productOrServiceCreate = response.productOrServiceCreate as IDataObject | undefined;
  handleUserErrors(productOrServiceCreate);
  const productOrService = productOrServiceCreate?.productOrService as IDataObject | undefined;
  return productOrService ?? {};
}
