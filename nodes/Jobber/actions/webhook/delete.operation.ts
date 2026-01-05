/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { DELETE_WEBHOOK } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Webhook ID',
    name: 'webhookId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['webhook'], operation: ['delete'] } },
    description: 'The ID of the webhook to delete',
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const webhookId = this.getNodeParameter('webhookId', index) as string;

  const response = await jobberGraphQLRequest.call(this, DELETE_WEBHOOK, { id: webhookId });

  handleUserErrors(response.webhookDelete);
  return { success: true, deletedId: webhookId } as IDataObject;
}
