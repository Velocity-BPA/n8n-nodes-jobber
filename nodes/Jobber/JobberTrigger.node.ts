/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IWebhookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
  IHookFunctions,
  IDataObject,
} from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from './transport';
import { CREATE_WEBHOOK, DELETE_WEBHOOK } from './graphql/mutations';
import { GET_ALL_WEBHOOKS } from './graphql/queries';
import { WEBHOOK_TOPICS } from './constants';

export class JobberTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Jobber Trigger',
    name: 'jobberTrigger',
    icon: 'file:jobber.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Starts the workflow when Jobber events occur',
    defaults: {
      name: 'Jobber Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'jobberApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        required: true,
        options: WEBHOOK_TOPICS.map((t) => ({ name: t.name, value: t.value })),
        default: 'CLIENT_CREATE',
        description: 'The event to listen for',
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default') as string;
        const event = this.getNodeParameter('event') as string;

        try {
          const response = await jobberGraphQLRequest.call(this, GET_ALL_WEBHOOKS, {});
          const webhooks = response.webhooks as Array<{ id: string; url: string; topic: string }>;

          for (const webhook of webhooks) {
            if (webhook.url === webhookUrl && webhook.topic === event) {
              const webhookData = this.getWorkflowStaticData('node');
              webhookData.webhookId = webhook.id;
              return true;
            }
          }
        } catch (error) {
          return false;
        }

        return false;
      },

      async create(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default') as string;
        const event = this.getNodeParameter('event') as string;

        try {
          const response = await jobberGraphQLRequest.call(this, CREATE_WEBHOOK, {
            input: {
              url: webhookUrl,
              topic: event,
            },
          });

          const webhookCreate = response.webhookCreate as IDataObject | undefined;
          handleUserErrors(webhookCreate);

          const webhook = webhookCreate?.webhook as IDataObject | undefined;
          if (webhook?.id) {
            const webhookData = this.getWorkflowStaticData('node');
            webhookData.webhookId = webhook.id as string;
            return true;
          }
        } catch (error) {
          return false;
        }

        return false;
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');
        const webhookId = webhookData.webhookId as string;

        if (!webhookId) {
          return true;
        }

        try {
          const response = await jobberGraphQLRequest.call(this, DELETE_WEBHOOK, {
            id: webhookId,
          });

          handleUserErrors(response.webhookDelete);
          delete webhookData.webhookId;
          return true;
        } catch (error) {
          return false;
        }
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const bodyData = this.getBodyData() as IDataObject;
    const headerData = this.getHeaderData() as IDataObject;

    return {
      workflowData: [
        this.helpers.returnJsonArray({
          ...bodyData,
          _webhookHeaders: headerData,
        }),
      ],
    };
  }
}
