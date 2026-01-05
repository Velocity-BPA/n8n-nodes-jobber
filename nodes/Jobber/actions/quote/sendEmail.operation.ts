/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { SEND_QUOTE_EMAIL } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Quote ID',
    name: 'quoteId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the quote to email',
    displayOptions: { show: { resource: ['quote'], operation: ['sendEmail'] } },
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['quote'], operation: ['sendEmail'] } },
    options: [
      { displayName: 'Subject', name: 'subject', type: 'string', default: '' },
      { displayName: 'Message', name: 'message', type: 'string', typeOptions: { rows: 4 }, default: '' },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const quoteId = this.getNodeParameter('quoteId', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const input: IDataObject = {};
  if (options.subject) input.subject = options.subject;
  if (options.message) input.message = options.message;

  const response = await jobberGraphQLRequest.call(this, SEND_QUOTE_EMAIL, { id: quoteId, input: Object.keys(input).length > 0 ? input : undefined });
  const result = response.quoteSendEmail as IDataObject;
  handleUserErrors(result);
  return result.quote as IDataObject;
}
