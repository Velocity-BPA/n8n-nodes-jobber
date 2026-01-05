/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  IHookFunctions,
  IWebhookFunctions,
  IDataObject,
  IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { JOBBER_API_BASE_URL, JOBBER_API_VERSION, DEFAULT_PAGE_SIZE } from '../constants';

export interface IJobberCredentials {
  clientId: string;
  clientSecret: string;
  accessToken: string;
  refreshToken: string;
}

export interface IGraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
  extensions?: Record<string, unknown>;
}

export interface IGraphQLResponse {
  data?: IDataObject;
  errors?: IGraphQLError[];
}

export interface IUserError {
  message: string;
  path?: string[];
}

/**
 * Execute a GraphQL request to the Jobber API
 */
export async function jobberGraphQLRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
  query: string,
  variables: IDataObject = {},
): Promise<IDataObject> {
  const options = {
    method: 'POST' as IHttpRequestMethods,
    url: JOBBER_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-JOBBER-GRAPHQL-VERSION': JOBBER_API_VERSION,
    },
    body: {
      query,
      variables,
    },
    json: true,
  };

  try {
    const response = (await this.helpers.requestWithAuthentication.call(
      this,
      'jobberApi',
      options,
    )) as IGraphQLResponse;

    if (response.errors && response.errors.length > 0) {
      const errorMessages = response.errors.map((e) => e.message).join(', ');
      throw new NodeApiError(
        this.getNode(),
        { message: `GraphQL Error: ${errorMessages}` },
        { message: `GraphQL Error: ${errorMessages}`, description: JSON.stringify(response.errors) },
      );
    }

    return response.data || {};
  } catch (error) {
    if (error instanceof NodeApiError) {
      throw error;
    }

    const errorData = error as { message?: string; statusCode?: number };
    throw new NodeApiError(
      this.getNode(),
      { message: errorData.message || 'Unknown error occurred' },
      { message: errorData.message || 'Unknown error occurred', httpCode: String(errorData.statusCode || 500) },
    );
  }
}

/**
 * Handle user errors returned from mutations
 */
export function handleUserErrors(
  response: unknown,
): void {
  if (!response || typeof response !== 'object') return;
  
  const data = response as IDataObject;
  const userErrors = data.userErrors as IUserError[] | undefined;
  if (userErrors && userErrors.length > 0) {
    const errorMessages = userErrors.map((e) => e.message).join(', ');
    throw new Error(errorMessages);
  }
}

/**
 * Fetch all pages of a paginated GraphQL query
 */
export async function jobberGraphQLRequestAllItems(
  this: IExecuteFunctions,
  query: string,
  variables: IDataObject = {},
  dataPath: string,
  limit?: number,
): Promise<IDataObject[]> {
  const allItems: IDataObject[] = [];
  let hasNextPage = true;
  let cursor: string | undefined;
  const pageSize = Math.min(limit || DEFAULT_PAGE_SIZE, 100);

  while (hasNextPage) {
    const paginatedVariables = {
      ...variables,
      first: pageSize,
      after: cursor,
    };

    const response = await jobberGraphQLRequest.call(this, query, paginatedVariables);

    // Navigate to the data using the path
    const pathParts = dataPath.split('.');
    let data: IDataObject = response;
    for (const part of pathParts) {
      data = data[part] as IDataObject;
      if (!data) break;
    }

    if (!data) {
      break;
    }

    const edges = data.edges as Array<{ node: IDataObject; cursor: string }>;
    const pageInfo = data.pageInfo as { hasNextPage: boolean; endCursor?: string };

    if (edges && edges.length > 0) {
      const items = edges.map((edge) => edge.node);
      allItems.push(...items);

      // Check if we've reached the limit
      if (limit && allItems.length >= limit) {
        return allItems.slice(0, limit);
      }
    }

    hasNextPage = pageInfo?.hasNextPage || false;
    cursor = pageInfo?.endCursor;

    // Safety check to prevent infinite loops
    if (!cursor && hasNextPage) {
      hasNextPage = false;
    }
  }

  return allItems;
}

/**
 * Build line items input for quotes, jobs, and invoices
 */
export function buildLineItemsInput(
  lineItems: Array<{
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    taxable?: boolean;
  }>,
): IDataObject[] {
  return lineItems.map((item) => ({
    name: item.name,
    description: item.description || '',
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    taxable: item.taxable ?? true,
  }));
}

/**
 * Build address input
 */
export function buildAddressInput(address: IDataObject): IDataObject {
  const result: IDataObject = {};

  if (address.street1) result.street1 = address.street1;
  if (address.street2) result.street2 = address.street2;
  if (address.city) result.city = address.city;
  if (address.province) result.province = address.province;
  if (address.postalCode) result.postalCode = address.postalCode;
  if (address.country) result.country = address.country;

  return result;
}

/**
 * Build email input
 */
export function buildEmailsInput(
  emails: Array<{ address: string; description?: string; primary?: boolean }>,
): IDataObject[] {
  return emails.map((email) => ({
    address: email.address,
    description: email.description || '',
    primary: email.primary ?? false,
  }));
}

/**
 * Build phone input
 */
export function buildPhonesInput(
  phones: Array<{ number: string; description?: string; primary?: boolean; smsAllowed?: boolean }>,
): IDataObject[] {
  return phones.map((phone) => ({
    number: phone.number,
    description: phone.description || '',
    primary: phone.primary ?? false,
    smsAllowed: phone.smsAllowed ?? false,
  }));
}

/**
 * Simplify a GraphQL response by extracting the relevant data
 */
export function simplifyResponse(response: IDataObject, path: string): IDataObject | IDataObject[] {
  const pathParts = path.split('.');
  let data: unknown = response;

  for (const part of pathParts) {
    if (data && typeof data === 'object' && part in (data as IDataObject)) {
      data = (data as IDataObject)[part];
    } else {
      return response;
    }
  }

  return data as IDataObject | IDataObject[];
}
