/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { jobberGraphQLRequest } from '../../transport';
import { GET_CLIENT_PROPERTIES } from '../../graphql/queries';

export const description: INodeProperties[] = [
  {
    displayName: 'Client ID',
    name: 'clientId',
    type: 'string',
    required: true,
    default: '',
    description: 'The ID of the client to get properties for',
    displayOptions: {
      show: {
        resource: ['client'],
        operation: ['getProperties'],
      },
    },
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    description: 'Whether to return all results or only up to a given limit',
    displayOptions: {
      show: {
        resource: ['client'],
        operation: ['getProperties'],
      },
    },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 25,
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    displayOptions: {
      show: {
        resource: ['client'],
        operation: ['getProperties'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
];

export async function execute(this: IExecuteFunctions, index: number): Promise<IDataObject[]> {
  const clientId = this.getNodeParameter('clientId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;

  const allProperties: IDataObject[] = [];
  let hasNextPage = true;
  let cursor: string | undefined;

  const pageSize = returnAll ? 100 : (this.getNodeParameter('limit', index, 25) as number);

  while (hasNextPage) {
    const variables: IDataObject = {
      clientId,
      first: pageSize,
      after: cursor,
    };

    const response = await jobberGraphQLRequest.call(this, GET_CLIENT_PROPERTIES, variables);
    const client = response.client as IDataObject;
    const properties = client.properties as IDataObject;
    const edges = properties.edges as Array<{ node: IDataObject; cursor: string }>;
    const pageInfo = properties.pageInfo as { hasNextPage: boolean; endCursor?: string };

    if (edges && edges.length > 0) {
      const items = edges.map((edge) => edge.node);
      allProperties.push(...items);
    }

    if (!returnAll || !pageInfo?.hasNextPage) {
      hasNextPage = false;
    } else {
      cursor = pageInfo.endCursor;
    }
  }

  return returnAll ? allProperties : allProperties.slice(0, pageSize);
}
