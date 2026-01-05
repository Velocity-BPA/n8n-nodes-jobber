/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { APPROVE_QUOTE } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Quote ID',
    name: 'quoteId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the quote to approve',
    displayOptions: { show: { resource: ['quote'], operation: ['approve'] } },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const quoteId = this.getNodeParameter('quoteId', index) as string;
  const response = await jobberGraphQLRequest.call(this, APPROVE_QUOTE, { id: quoteId });
  const result = response.quoteApprove as IDataObject;
  handleUserErrors(result);
  return result.quote as IDataObject;
}
