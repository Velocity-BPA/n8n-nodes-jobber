/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { CLOSE_JOB } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Job ID',
    name: 'jobId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['job'], operation: ['close'] } },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const jobId = this.getNodeParameter('jobId', index) as string;
  const response = await jobberGraphQLRequest.call(this, CLOSE_JOB, { id: jobId });
  const result = response.jobClose as IDataObject;
  handleUserErrors(result);
  return (result?.job ?? result) as IDataObject;
}
