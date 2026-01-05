/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { handleUserErrors } from '../../nodes/Jobber/transport';

describe('Transport Functions', () => {
  describe('handleUserErrors', () => {
    it('should not throw when response has no errors', () => {
      const response = {
        userErrors: [],
      };
      expect(() => handleUserErrors(response)).not.toThrow();
    });

    it('should not throw when userErrors is empty', () => {
      const response = {
        userErrors: [],
        client: { id: '123' },
      };
      expect(() => handleUserErrors(response)).not.toThrow();
    });

    it('should throw when userErrors contains errors', () => {
      const response = {
        userErrors: [
          { message: 'Invalid client ID', path: ['clientId'] },
        ],
      };
      expect(() => handleUserErrors(response)).toThrow('Invalid client ID');
    });

    it('should join multiple error messages', () => {
      const response = {
        userErrors: [
          { message: 'Error 1', path: ['field1'] },
          { message: 'Error 2', path: ['field2'] },
        ],
      };
      expect(() => handleUserErrors(response)).toThrow('Error 1, Error 2');
    });

    it('should handle null response gracefully', () => {
      expect(() => handleUserErrors(null)).not.toThrow();
    });

    it('should handle undefined userErrors gracefully', () => {
      const response = {};
      expect(() => handleUserErrors(response)).not.toThrow();
    });
  });
});
