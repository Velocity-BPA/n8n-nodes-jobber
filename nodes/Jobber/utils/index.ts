/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, INodePropertyOptions } from 'n8n-workflow';

/**
 * Parse JSON input safely
 */
export function parseJsonInput(input: string | IDataObject): IDataObject {
  if (typeof input === 'string') {
    try {
      return JSON.parse(input) as IDataObject;
    } catch {
      throw new Error('Invalid JSON input');
    }
  }
  return input;
}

/**
 * Parse JSON array input safely
 */
export function parseJsonArrayInput(input: string | IDataObject[]): IDataObject[] {
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed)) {
        throw new Error('Expected JSON array');
      }
      return parsed as IDataObject[];
    } catch {
      throw new Error('Invalid JSON array input');
    }
  }
  return input;
}

/**
 * Format date string to ISO format
 */
export function formatDateToISO(date: string | Date): string {
  if (date instanceof Date) {
    return date.toISOString();
  }
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }
  return parsed.toISOString();
}

/**
 * Convert camelCase to snake_case
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Convert snake_case to camelCase
 */
export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert object keys from camelCase to snake_case
 */
export function objectToSnakeCase(obj: IDataObject): IDataObject {
  const result: IDataObject = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = toSnakeCase(key);
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[snakeKey] = objectToSnakeCase(value as IDataObject);
    } else if (Array.isArray(value)) {
      result[snakeKey] = value.map((item) =>
        typeof item === 'object' ? objectToSnakeCase(item as IDataObject) : item,
      );
    } else {
      result[snakeKey] = value;
    }
  }
  return result;
}

/**
 * Convert object keys from snake_case to camelCase
 */
export function objectToCamelCase(obj: IDataObject): IDataObject {
  const result: IDataObject = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key);
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[camelKey] = objectToCamelCase(value as IDataObject);
    } else if (Array.isArray(value)) {
      result[camelKey] = value.map((item) =>
        typeof item === 'object' ? objectToCamelCase(item as IDataObject) : item,
      );
    } else {
      result[camelKey] = value;
    }
  }
  return result;
}

/**
 * Remove empty values from an object
 */
export function removeEmptyValues(obj: IDataObject): IDataObject {
  const result: IDataObject = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleaned = removeEmptyValues(value as IDataObject);
        if (Object.keys(cleaned).length > 0) {
          result[key] = cleaned;
        }
      } else if (Array.isArray(value) && value.length > 0) {
        result[key] = value;
      } else if (!Array.isArray(value)) {
        result[key] = value;
      }
    }
  }
  return result;
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) {
    throw new Error(`Invalid currency value: ${value}`);
  }
  return parsed;
}

/**
 * Generate resource options for dropdowns
 */
export function generateResourceOptions(
  resources: Array<{ name: string; value: string }>,
): INodePropertyOptions[] {
  return resources.map((r) => ({
    name: r.name,
    value: r.value,
  }));
}

/**
 * Deep merge two objects
 */
export function deepMerge(target: IDataObject, source: IDataObject): IDataObject {
  const result = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      target[key] &&
      typeof target[key] === 'object'
    ) {
      result[key] = deepMerge(target[key] as IDataObject, value as IDataObject);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Validate required fields
 */
export function validateRequiredFields(
  data: IDataObject,
  requiredFields: string[],
  resourceName: string,
): void {
  const missing = requiredFields.filter(
    (field) => data[field] === undefined || data[field] === null || data[field] === '',
  );

  if (missing.length > 0) {
    throw new Error(`Missing required fields for ${resourceName}: ${missing.join(', ')}`);
  }
}

/**
 * Truncate string to specified length
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return `${str.substring(0, maxLength - 3)}...`;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * Generate a unique identifier
 */
export function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Check if a value is a valid Jobber ID (base64 encoded)
 */
export function isValidJobberId(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }
  // Jobber IDs are base64 encoded
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  return base64Regex.test(id);
}

/**
 * Extract ID from Jobber response
 */
export function extractId(response: IDataObject, path = 'id'): string {
  const pathParts = path.split('.');
  let data: unknown = response;

  for (const part of pathParts) {
    if (data && typeof data === 'object' && part in (data as IDataObject)) {
      data = (data as IDataObject)[part];
    } else {
      throw new Error(`Could not extract ID from path: ${path}`);
    }
  }

  if (typeof data !== 'string') {
    throw new Error(`Invalid ID value at path: ${path}`);
  }

  return data;
}
