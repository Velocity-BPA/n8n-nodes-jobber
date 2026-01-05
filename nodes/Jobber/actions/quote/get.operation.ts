/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest } from '../../transport';
import { GET_QUOTE } from '../../graphql/queries';

export const description: INodeProperties[] = [
  {
    displayName: 'Quote ID',
    name: 'quoteId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the quote to retrieve',
    displayOptions: {
      show: {
        resource: ['quote'],
        operation: ['get'],
      },
    },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const quoteId = this.getNodeParameter('quoteId', index) as string;
  const response = await jobberGraphQLRequest.call(this, GET_QUOTE, { id: quoteId });
  return response.quote as IDataObject;
}
