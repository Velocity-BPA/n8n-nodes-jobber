/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest } from '../../transport';
import { GET_EXPENSE } from '../../graphql/queries';

export const description: INodeProperties[] = [
  {
    displayName: 'Expense ID',
    name: 'expenseId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['expense'], operation: ['get'] } },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const expenseId = this.getNodeParameter('expenseId', index) as string;
  const response = await jobberGraphQLRequest.call(this, GET_EXPENSE, { id: expenseId });
  return response.expense as IDataObject;
}
