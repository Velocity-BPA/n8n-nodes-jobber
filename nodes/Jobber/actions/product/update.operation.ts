/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { UPDATE_PRODUCT } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Product/Service ID',
    name: 'productId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['product'], operation: ['update'] } },
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['product'], operation: ['update'] } },
    options: [
      { displayName: 'Name', name: 'name', type: 'string', default: '' },
      { displayName: 'Description', name: 'description', type: 'string', typeOptions: { rows: 4 }, default: '' },
      { displayName: 'Default Unit Cost', name: 'defaultUnitCost', type: 'number', typeOptions: { numberPrecision: 2 }, default: 0 },
      { displayName: 'Taxable', name: 'taxable', type: 'boolean', default: true },
      { displayName: 'Online Bookable', name: 'onlineBookable', type: 'boolean', default: false },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const productId = this.getNodeParameter('productId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const input: IDataObject = { productOrServiceId: productId };
  if (updateFields.name) input.name = updateFields.name;
  if (updateFields.description) input.description = updateFields.description;
  if (updateFields.defaultUnitCost !== undefined) input.defaultUnitCost = updateFields.defaultUnitCost;
  if (updateFields.taxable !== undefined) input.taxable = updateFields.taxable;
  if (updateFields.onlineBookable !== undefined) input.onlineBookable = updateFields.onlineBookable;

  const response = await jobberGraphQLRequest.call(this, UPDATE_PRODUCT, { input });
  const productOrServiceUpdate = response.productOrServiceUpdate as IDataObject | undefined;
  handleUserErrors(productOrServiceUpdate);
  const productOrService = productOrServiceUpdate?.productOrService as IDataObject | undefined;
  return productOrService ?? {};
}
