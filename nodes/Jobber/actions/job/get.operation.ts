/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest } from '../../transport';
import { GET_JOB } from '../../graphql/queries';

export const description: INodeProperties[] = [
  {
    displayName: 'Job ID',
    name: 'jobId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['job'], operation: ['get'] } },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const jobId = this.getNodeParameter('jobId', index) as string;
  const response = await jobberGraphQLRequest.call(this, GET_JOB, { id: jobId });
  return response.job as IDataObject;
}
