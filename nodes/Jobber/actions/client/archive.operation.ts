/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { ARCHIVE_CLIENT } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Client ID',
    name: 'clientId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the client to archive',
    displayOptions: {
      show: {
        resource: ['client'],
        operation: ['archive'],
      },
    },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const clientId = this.getNodeParameter('clientId', index) as string;

  const response = await jobberGraphQLRequest.call(this, ARCHIVE_CLIENT, { id: clientId });
  const result = response.clientArchive as IDataObject;

  handleUserErrors(result);

  return result.client as IDataObject;
}
