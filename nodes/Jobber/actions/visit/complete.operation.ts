/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { COMPLETE_VISIT } from '../../graphql/mutations';
import { formatDateToISO } from '../../utils';

export const description: INodeProperties[] = [
  {
    displayName: 'Visit ID',
    name: 'visitId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['visit'], operation: ['complete'] } },
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['visit'], operation: ['complete'] } },
    options: [
      { displayName: 'Completed At', name: 'completedAt', type: 'dateTime', default: '', description: 'When the visit was completed. Defaults to now.' },
    ],
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const visitId = this.getNodeParameter('visitId', index) as string;
  const options = this.getNodeParameter('options', index, {}) as IDataObject;

  const input: IDataObject = { visitId };
  if (options.completedAt) {
    input.completedAt = formatDateToISO(options.completedAt as string);
  }

  const response = await jobberGraphQLRequest.call(this, COMPLETE_VISIT, { input });
  const visitComplete = response.visitComplete as IDataObject | undefined;
  handleUserErrors(visitComplete);
  const visit = visitComplete?.visit as IDataObject | undefined;
  return visit ?? {};
}
