/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { UPDATE_EXPENSE } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Expense ID',
    name: 'expenseId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['expense'], operation: ['update'] } },
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['expense'], operation: ['update'] } },
    options: [
      { displayName: 'Title', name: 'title', type: 'string', default: '' },
      { displayName: 'Description', name: 'description', type: 'string', default: '' },
      { displayName: 'Amount', name: 'amount', type: 'number', default: 0, typeOptions: { numberPrecision: 2 } },
      { displayName: 'Date', name: 'date', type: 'dateTime', default: '' },
      { displayName: 'Reimburse to User', name: 'reimburseToUser', type: 'boolean', default: false },
      { displayName: 'Job ID', name: 'jobId', type: 'string', default: '' },
      { displayName: 'User ID', name: 'userId', type: 'string', default: '' },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const expenseId = this.getNodeParameter('expenseId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const attributes: IDataObject = {};
  if (updateFields.title !== undefined) attributes.title = updateFields.title;
  if (updateFields.description !== undefined) attributes.description = updateFields.description;
  if (updateFields.amount !== undefined) attributes.total = updateFields.amount;
  if (updateFields.date !== undefined) attributes.date = updateFields.date;
  if (updateFields.reimburseToUser !== undefined) attributes.reimburseToUser = updateFields.reimburseToUser;
  if (updateFields.jobId) attributes.jobId = updateFields.jobId;
  if (updateFields.userId) attributes.linkedUserId = updateFields.userId;

  const response = await jobberGraphQLRequest.call(this, UPDATE_EXPENSE, {
    expenseId,
    attributes,
  });

  const result = response.expenseUpdate as IDataObject;
  handleUserErrors(result);
  return (result?.expense ?? result) as IDataObject;
}
