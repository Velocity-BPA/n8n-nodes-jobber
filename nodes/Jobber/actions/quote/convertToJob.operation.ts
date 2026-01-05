/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { CONVERT_QUOTE_TO_JOB } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Quote ID',
    name: 'quoteId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the quote to convert to a job',
    displayOptions: { show: { resource: ['quote'], operation: ['convertToJob'] } },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const quoteId = this.getNodeParameter('quoteId', index) as string;
  const response = await jobberGraphQLRequest.call(this, CONVERT_QUOTE_TO_JOB, { id: quoteId });
  const result = response.quoteConvertToJob as IDataObject;
  handleUserErrors(result);
  return result.job as IDataObject;
}
