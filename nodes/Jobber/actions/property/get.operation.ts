/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest } from '../../transport';
import { GET_PROPERTY } from '../../graphql/queries';

export const description: INodeProperties[] = [
  {
    displayName: 'Property ID',
    name: 'propertyId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the property to retrieve',
    displayOptions: {
      show: {
        resource: ['property'],
        operation: ['get'],
      },
    },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const propertyId = this.getNodeParameter('propertyId', index) as string;

  const response = await jobberGraphQLRequest.call(this, GET_PROPERTY, { id: propertyId });

  return response.property as IDataObject;
}
