/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { DELETE_EXPENSE } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Expense ID',
    name: 'expenseId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['expense'], operation: ['delete'] } },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const expenseId = this.getNodeParameter('expenseId', index) as string;

  const response = await jobberGraphQLRequest.call(this, DELETE_EXPENSE, { expenseId });

  const result = response.expenseDelete as IDataObject;
  handleUserErrors(result);
  return { success: true, deletedId: expenseId } as IDataObject;
}
