/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { DELETE_VISIT } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Visit ID',
    name: 'visitId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['visit'], operation: ['delete'] } },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const visitId = this.getNodeParameter('visitId', index) as string;
  const response = await jobberGraphQLRequest.call(this, DELETE_VISIT, { input: { visitId } });
  handleUserErrors(response.visitDelete);
  return { success: true, visitId };
}
