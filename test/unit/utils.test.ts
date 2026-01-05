/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  parseJsonInput,
  formatDateToISO,
  toSnakeCase,
  toCamelCase,
  objectToSnakeCase,
  objectToCamelCase,
  removeEmptyValues,
  formatCurrency,
  parseCurrency,
  validateRequiredFields,
  truncateString,
  formatPhoneNumber,
  isValidJobberId,
  extractId,
} from '../../nodes/Jobber/utils';

describe('Utility Functions', () => {
  describe('parseJsonInput', () => {
    it('should parse valid JSON string', () => {
      const result = parseJsonInput('{"name":"test"}');
      expect(result).toEqual({ name: 'test' });
    });

    it('should return object as-is if not a string', () => {
      const obj = { name: 'test' };
      const result = parseJsonInput(obj);
      expect(result).toEqual(obj);
    });

    it('should throw error for invalid JSON', () => {
      expect(() => parseJsonInput('invalid')).toThrow('Invalid JSON input');
    });
  });

  describe('formatDateToISO', () => {
    it('should format Date object to ISO string', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDateToISO(date);
      expect(result).toBe('2024-01-15T10:30:00.000Z');
    });

    it('should format date string to ISO string', () => {
      const result = formatDateToISO('2024-01-15');
      expect(result).toContain('2024-01-15');
    });

    it('should throw error for invalid date', () => {
      expect(() => formatDateToISO('invalid')).toThrow('Invalid date');
    });
  });

  describe('toSnakeCase', () => {
    it('should convert camelCase to snake_case', () => {
      expect(toSnakeCase('firstName')).toBe('first_name');
      expect(toSnakeCase('billingAddress')).toBe('billing_address');
      expect(toSnakeCase('isLead')).toBe('is_lead');
    });

    it('should handle single word', () => {
      expect(toSnakeCase('name')).toBe('name');
    });
  });

  describe('toCamelCase', () => {
    it('should convert snake_case to camelCase', () => {
      expect(toCamelCase('first_name')).toBe('firstName');
      expect(toCamelCase('billing_address')).toBe('billingAddress');
      expect(toCamelCase('is_lead')).toBe('isLead');
    });

    it('should handle single word', () => {
      expect(toCamelCase('name')).toBe('name');
    });
  });

  describe('objectToSnakeCase', () => {
    it('should convert object keys to snake_case', () => {
      const result = objectToSnakeCase({
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(result).toEqual({
        first_name: 'John',
        last_name: 'Doe',
      });
    });

    it('should handle nested objects', () => {
      const result = objectToSnakeCase({
        billingAddress: {
          streetName: '123 Main',
        },
      });
      expect(result).toEqual({
        billing_address: {
          street_name: '123 Main',
        },
      });
    });
  });

  describe('objectToCamelCase', () => {
    it('should convert object keys to camelCase', () => {
      const result = objectToCamelCase({
        first_name: 'John',
        last_name: 'Doe',
      });
      expect(result).toEqual({
        firstName: 'John',
        lastName: 'Doe',
      });
    });
  });

  describe('removeEmptyValues', () => {
    it('should remove null and undefined values', () => {
      const result = removeEmptyValues({
        name: 'John',
        email: null,
        phone: undefined,
      });
      expect(result).toEqual({ name: 'John' });
    });

    it('should remove empty strings', () => {
      const result = removeEmptyValues({
        name: 'John',
        email: '',
      });
      expect(result).toEqual({ name: 'John' });
    });

    it('should keep arrays with values', () => {
      const result = removeEmptyValues({
        tags: ['a', 'b'],
        empty: [],
      });
      expect(result).toEqual({ tags: ['a', 'b'] });
    });
  });

  describe('formatCurrency', () => {
    it('should format currency in USD', () => {
      const result = formatCurrency(1234.56);
      expect(result).toBe('$1,234.56');
    });

    it('should handle whole numbers', () => {
      const result = formatCurrency(100);
      expect(result).toBe('$100.00');
    });
  });

  describe('parseCurrency', () => {
    it('should parse currency string to number', () => {
      expect(parseCurrency('$1,234.56')).toBe(1234.56);
      expect(parseCurrency('$100')).toBe(100);
    });

    it('should throw error for invalid currency', () => {
      expect(() => parseCurrency('invalid')).toThrow('Invalid currency value');
    });
  });

  describe('validateRequiredFields', () => {
    it('should pass when all required fields are present', () => {
      const data = { name: 'John', email: 'john@test.com' };
      expect(() => validateRequiredFields(data, ['name', 'email'], 'Client')).not.toThrow();
    });

    it('should throw when required field is missing', () => {
      const data = { name: 'John' };
      expect(() => validateRequiredFields(data, ['name', 'email'], 'Client')).toThrow(
        'Missing required fields for Client: email',
      );
    });
  });

  describe('truncateString', () => {
    it('should truncate long strings', () => {
      const result = truncateString('This is a very long string', 10);
      expect(result).toBe('This is...');
    });

    it('should not truncate short strings', () => {
      const result = truncateString('Short', 10);
      expect(result).toBe('Short');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format 10-digit US phone number', () => {
      expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567');
    });

    it('should format 11-digit US phone number with country code', () => {
      expect(formatPhoneNumber('15551234567')).toBe('+1 (555) 123-4567');
    });

    it('should return original for non-standard format', () => {
      expect(formatPhoneNumber('+44 123456')).toBe('+44 123456');
    });
  });

  describe('isValidJobberId', () => {
    it('should return true for valid base64 ID', () => {
      expect(isValidJobberId('SGVsbG8=')).toBe(true);
    });

    it('should return false for invalid ID', () => {
      expect(isValidJobberId('')).toBe(false);
      expect(isValidJobberId('invalid!@#')).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isValidJobberId(null as any)).toBe(false);
      expect(isValidJobberId(undefined as any)).toBe(false);
    });
  });

  describe('extractId', () => {
    it('should extract ID from response', () => {
      const response = { id: '123' };
      expect(extractId(response)).toBe('123');
    });

    it('should extract nested ID', () => {
      const response = { client: { id: '456' } };
      expect(extractId(response, 'client.id')).toBe('456');
    });

    it('should throw error for missing path', () => {
      const response = { name: 'test' };
      expect(() => extractId(response, 'id')).toThrow('Could not extract ID');
    });
  });
});
