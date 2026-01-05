/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { CREATE_WEBHOOK } from '../../graphql/mutations';
import { WEBHOOK_TOPICS } from '../../constants';

export const description: INodeProperties[] = [
  {
    displayName: 'Webhook URL',
    name: 'url',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'https://your-webhook-url.com/hook',
    displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
    description: 'The URL that will receive webhook events',
  },
  {
    displayName: 'Topic',
    name: 'topic',
    type: 'options',
    required: true,
    options: WEBHOOK_TOPICS.map(t => ({ name: t.name, value: t.value })),
    default: 'CLIENT_CREATE',
    displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
    description: 'The event type that triggers this webhook',
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const url = this.getNodeParameter('url', index) as string;
  const topic = this.getNodeParameter('topic', index) as string;

  const response = await jobberGraphQLRequest.call(this, CREATE_WEBHOOK, {
    input: {
      url,
      topic,
    },
  });

  const webhookCreate = response.webhookCreate as IDataObject | undefined;
  handleUserErrors(webhookCreate);
  const webhook = webhookCreate?.webhook as IDataObject | undefined;
  return webhook ?? {};
}
