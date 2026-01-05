/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest } from '../../transport';
import { GET_CURRENT_USER } from '../../graphql/queries';

export const description: INodeProperties[] = [
  {
    displayName: 'Info',
    name: 'info',
    type: 'notice',
    default: '',
    displayOptions: { show: { resource: ['user'], operation: ['getCurrent'] } },
    // eslint-disable-next-line n8n-nodes-base/node-param-description-line-break-html-tag
    description: 'Returns the currently authenticated user information',
  },
];

export async function execute(this: IExecuteFunctions, _index: number): Promise<IDataObject> {
  const response = await jobberGraphQLRequest.call(this, GET_CURRENT_USER, {});
  return response.me as IDataObject;
}
