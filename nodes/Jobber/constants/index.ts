/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const JOBBER_API_BASE_URL = 'https://api.getjobber.com/api/graphql';
export const JOBBER_API_VERSION = '2023-11-15';

export const JOBBER_RESOURCES = {
  CLIENT: 'client',
  PROPERTY: 'property',
  QUOTE: 'quote',
  JOB: 'job',
  VISIT: 'visit',
  INVOICE: 'invoice',
  PAYMENT: 'payment',
  USER: 'user',
  PRODUCT: 'product',
  TIME_ENTRY: 'timeEntry',
  EXPENSE: 'expense',
  WEBHOOK: 'webhook',
} as const;

export const QUOTE_STATUSES = [
  { name: 'Draft', value: 'draft' },
  { name: 'Awaiting Response', value: 'awaiting_response' },
  { name: 'Approved', value: 'approved' },
  { name: 'Rejected', value: 'rejected' },
  { name: 'Converted', value: 'converted' },
] as const;

export const JOB_STATUSES = [
  { name: 'Active', value: 'active' },
  { name: 'Archived', value: 'archived' },
  { name: 'Completed', value: 'completed' },
] as const;

export const JOB_TYPES = [
  { name: 'One-Off', value: 'one_off' },
  { name: 'Recurring', value: 'recurring' },
] as const;

export const INVOICE_STATUSES = [
  { name: 'Draft', value: 'draft' },
  { name: 'Awaiting Payment', value: 'awaiting_payment' },
  { name: 'Past Due', value: 'past_due' },
  { name: 'Paid', value: 'paid' },
  { name: 'Bad Debt', value: 'bad_debt' },
] as const;

export const PAYMENT_METHODS = [
  { name: 'Cash', value: 'cash' },
  { name: 'Check', value: 'check' },
  { name: 'Credit Card', value: 'credit_card' },
  { name: 'Bank Transfer', value: 'bank_transfer' },
  { name: 'Other', value: 'other' },
] as const;

export const PRODUCT_CATEGORIES = [
  { name: 'Products', value: 'products' },
  { name: 'Services', value: 'services' },
] as const;

export const USER_ROLES = [
  { name: 'Admin', value: 'admin' },
  { name: 'Manager', value: 'manager' },
  { name: 'User', value: 'user' },
] as const;

export const WEBHOOK_TOPICS = [
  { name: 'Client Create', value: 'CLIENT_CREATE' },
  { name: 'Client Update', value: 'CLIENT_UPDATE' },
  { name: 'Job Create', value: 'JOB_CREATE' },
  { name: 'Job Update', value: 'JOB_UPDATE' },
  { name: 'Quote Create', value: 'QUOTE_CREATE' },
  { name: 'Quote Update', value: 'QUOTE_UPDATE' },
  { name: 'Invoice Create', value: 'INVOICE_CREATE' },
  { name: 'Invoice Update', value: 'INVOICE_UPDATE' },
  { name: 'Visit Complete', value: 'VISIT_COMPLETE' },
] as const;

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;
