/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class JobberApi implements ICredentialType {
  name = 'jobberApi';
  displayName = 'Jobber API';
  documentationUrl = 'https://developer.getjobber.com/docs';

  properties: INodeProperties[] = [
    {
      displayName: 'Client ID',
      name: 'clientId',
      type: 'string',
      default: '',
      required: true,
      description: 'OAuth 2.0 Client ID from your Jobber Developer App',
    },
    {
      displayName: 'Client Secret',
      name: 'clientSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'OAuth 2.0 Client Secret from your Jobber Developer App',
    },
    {
      displayName: 'Access Token',
      name: 'accessToken',
      type: 'hidden',
      typeOptions: {
        expirable: true,
      },
      default: '',
    },
    {
      displayName: 'Refresh Token',
      name: 'refreshToken',
      type: 'hidden',
      default: '',
    },
    {
      displayName: 'OAuth Authorization URL',
      name: 'authUrl',
      type: 'hidden',
      default: 'https://api.getjobber.com/api/oauth/authorize',
    },
    {
      displayName: 'OAuth Token URL',
      name: 'accessTokenUrl',
      type: 'hidden',
      default: 'https://api.getjobber.com/api/oauth/token',
    },
    {
      displayName: 'Scope',
      name: 'scope',
      type: 'hidden',
      default: 'read_clients write_clients read_jobs write_jobs read_invoices write_invoices read_quotes write_quotes read_visits write_visits read_users read_products write_products read_expenses write_expenses read_time_entries write_time_entries read_webhooks write_webhooks',
    },
    {
      displayName: 'Auth URI Query Parameters',
      name: 'authQueryParameters',
      type: 'hidden',
      default: '',
    },
    {
      displayName: 'Authentication',
      name: 'authentication',
      type: 'hidden',
      default: 'body',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.accessToken}}',
        'Content-Type': 'application/json',
        'X-JOBBER-GRAPHQL-VERSION': '2023-11-15',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.getjobber.com/api/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-JOBBER-GRAPHQL-VERSION': '2023-11-15',
      },
      body: JSON.stringify({
        query: `query { user { id email { address } } }`,
      }),
    },
  };
}
