/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest } from '../../transport';
import { GET_CLIENT } from '../../graphql/queries';

export const description: INodeProperties[] = [
  {
    displayName: 'Client ID',
    name: 'clientId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the client to retrieve',
    displayOptions: {
      show: {
        resource: ['client'],
        operation: ['get'],
      },
    },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const clientId = this.getNodeParameter('clientId', index) as string;

  const response = await jobberGraphQLRequest.call(this, GET_CLIENT, { id: clientId });

  return response.client as IDataObject;
}
