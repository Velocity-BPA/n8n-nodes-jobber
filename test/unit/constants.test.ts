/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  JOBBER_API_BASE_URL,
  JOBBER_API_VERSION,
  JOBBER_RESOURCES,
  QUOTE_STATUSES,
  JOB_STATUSES,
  INVOICE_STATUSES,
  PAYMENT_METHODS,
  PRODUCT_CATEGORIES,
  WEBHOOK_TOPICS,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from '../../nodes/Jobber/constants';

describe('Constants', () => {
  describe('API Configuration', () => {
    it('should have correct API base URL', () => {
      expect(JOBBER_API_BASE_URL).toBe('https://api.getjobber.com/api/graphql');
    });

    it('should have correct API version', () => {
      expect(JOBBER_API_VERSION).toBe('2023-11-15');
    });

    it('should have correct default page size', () => {
      expect(DEFAULT_PAGE_SIZE).toBe(25);
    });

    it('should have correct max page size', () => {
      expect(MAX_PAGE_SIZE).toBe(100);
    });
  });

  describe('Resources', () => {
    it('should have all 12 resources defined', () => {
      expect(Object.keys(JOBBER_RESOURCES)).toHaveLength(12);
    });

    it('should include client resource', () => {
      expect(JOBBER_RESOURCES.CLIENT).toBe('client');
    });

    it('should include all expected resources', () => {
      const expectedResources = [
        'CLIENT', 'PROPERTY', 'QUOTE', 'JOB', 'VISIT', 'INVOICE',
        'PAYMENT', 'USER', 'PRODUCT', 'TIME_ENTRY', 'EXPENSE', 'WEBHOOK'
      ];
      expect(Object.keys(JOBBER_RESOURCES)).toEqual(expectedResources);
    });
  });

  describe('Statuses', () => {
    it('should have correct quote statuses', () => {
      expect(QUOTE_STATUSES).toHaveLength(5);
      const values = QUOTE_STATUSES.map(s => s.value);
      expect(values).toContain('draft');
      expect(values).toContain('approved');
    });

    it('should have correct job statuses', () => {
      expect(JOB_STATUSES).toHaveLength(3);
      const values = JOB_STATUSES.map(s => s.value);
      expect(values).toContain('active');
      expect(values).toContain('completed');
    });

    it('should have correct invoice statuses', () => {
      expect(INVOICE_STATUSES).toHaveLength(5);
      const values = INVOICE_STATUSES.map(s => s.value);
      expect(values).toContain('draft');
      expect(values).toContain('paid');
    });
  });

  describe('Payment Methods', () => {
    it('should have correct payment methods', () => {
      expect(PAYMENT_METHODS).toHaveLength(5);
      const values = PAYMENT_METHODS.map(m => m.value);
      expect(values).toContain('cash');
      expect(values).toContain('credit_card');
    });
  });

  describe('Product Categories', () => {
    it('should have correct product categories', () => {
      expect(PRODUCT_CATEGORIES).toHaveLength(2);
      const values = PRODUCT_CATEGORIES.map(c => c.value);
      expect(values).toContain('products');
      expect(values).toContain('services');
    });
  });

  describe('Webhook Topics', () => {
    it('should have correct webhook topics', () => {
      expect(WEBHOOK_TOPICS).toHaveLength(9);
      const values = WEBHOOK_TOPICS.map(t => t.value);
      expect(values).toContain('CLIENT_CREATE');
      expect(values).toContain('JOB_CREATE');
      expect(values).toContain('VISIT_COMPLETE');
    });
  });
});
