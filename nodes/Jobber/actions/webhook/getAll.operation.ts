/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest } from '../../transport';
import { GET_ALL_WEBHOOKS } from '../../graphql/queries';

export const description: INodeProperties[] = [];

export async function execute(this: IExecuteFunctions, _index: number): Promise<IDataObject[]> {
  const response = await jobberGraphQLRequest.call(this, GET_ALL_WEBHOOKS, {});
  
  const webhooks = response.webhooks as IDataObject[];
  return webhooks || [];
}
