/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { CREATE_EXPENSE } from '../../graphql/mutations';
import { formatDateToISO } from '../../utils';

export const description: INodeProperties[] = [
  {
    displayName: 'Title',
    name: 'title',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['expense'], operation: ['create'] } },
  },
  {
    displayName: 'Amount',
    name: 'amount',
    type: 'number',
    required: true,
    default: 0,
    typeOptions: { numberPrecision: 2 },
    displayOptions: { show: { resource: ['expense'], operation: ['create'] } },
  },
  {
    displayName: 'Date',
    name: 'date',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['expense'], operation: ['create'] } },
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['expense'], operation: ['create'] } },
    options: [
      { displayName: 'Job ID', name: 'jobId', type: 'string', default: '', description: 'Associate with a job' },
      { displayName: 'User ID', name: 'userId', type: 'string', default: '', description: 'Team member who incurred the expense' },
      { displayName: 'Description', name: 'description', type: 'string', typeOptions: { rows: 4 }, default: '' },
      { displayName: 'Reimburse To User', name: 'reimburseToUser', type: 'boolean', default: false },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const title = this.getNodeParameter('title', index) as string;
  const amount = this.getNodeParameter('amount', index) as number;
  const date = this.getNodeParameter('date', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const input: IDataObject = {
    title,
    amount,
    date: formatDateToISO(date),
  };

  if (additionalFields.jobId) input.jobId = additionalFields.jobId;
  if (additionalFields.userId) input.userId = additionalFields.userId;
  if (additionalFields.description) input.description = additionalFields.description;
  if (additionalFields.reimburseToUser !== undefined) input.reimburseToUser = additionalFields.reimburseToUser;

  const response = await jobberGraphQLRequest.call(this, CREATE_EXPENSE, { input });
  const result = response.expenseCreate as IDataObject;
  handleUserErrors(result);
  return (result?.expense ?? result) as IDataObject;
}
