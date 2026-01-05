/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest, handleUserErrors } from '../../transport';
import { DELETE_PROPERTY } from '../../graphql/mutations';

export const description: INodeProperties[] = [
  {
    displayName: 'Property ID',
    name: 'propertyId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the property to delete',
    displayOptions: {
      show: {
        resource: ['property'],
        operation: ['delete'],
      },
    },
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject> {
  const propertyId = this.getNodeParameter('propertyId', index) as string;

  const response = await jobberGraphQLRequest.call(this, DELETE_PROPERTY, { id: propertyId });
  const result = response.propertyDelete as IDataObject;

  handleUserErrors(result);

  return { success: true, deletedPropertyId: result.deletedPropertyId };
}
