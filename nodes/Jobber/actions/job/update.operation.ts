/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors, buildLineItemsInput } from '../../transport';
import { UPDATE_JOB } from '../../graphql/mutations';
import { parseJsonArrayInput } from '../../utils';

export const description: INodeProperties[] = [
  {
    displayName: 'Job ID',
    name: 'jobId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['job'], operation: ['update'] } },
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['job'], operation: ['update'] } },
    options: [
      { displayName: 'Title', name: 'title', type: 'string', default: '' },
      { displayName: 'Instructions', name: 'instructions', type: 'string', typeOptions: { rows: 4 }, default: '' },
      { displayName: 'Line Items (JSON)', name: 'lineItems', type: 'json', default: '[]', description: 'JSON array of line items' },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const jobId = this.getNodeParameter('jobId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const input: IDataObject = { jobId };
  if (updateFields.title) input.title = updateFields.title;
  if (updateFields.instructions) input.instructions = updateFields.instructions;
  if (updateFields.lineItems) {
    const lineItems = parseJsonArrayInput(updateFields.lineItems as string);
    input.lineItems = buildLineItemsInput(lineItems as Array<{
      name: string;
      description?: string;
      quantity: number;
      unitPrice: number;
      taxable?: boolean;
    }>);
  }

  const response = await jobberGraphQLRequest.call(this, UPDATE_JOB, { input });
  const jobUpdate = response.jobUpdate as IDataObject | undefined;
  handleUserErrors(jobUpdate);
  const job = jobUpdate?.job as IDataObject | undefined;
  return job ?? {};
}
