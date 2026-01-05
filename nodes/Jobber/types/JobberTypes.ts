/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

// Base Types
export interface IJobberAddress {
  street1?: string;
  street2?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

export interface IJobberEmail {
  address: string;
  description?: string;
  primary?: boolean;
}

export interface IJobberPhone {
  number: string;
  description?: string;
  primary?: boolean;
  smsAllowed?: boolean;
}

// Client Types
export interface IJobberClient {
  id: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  emails?: IJobberEmail[];
  phones?: IJobberPhone[];
  billingAddress?: IJobberAddress;
  isCompany?: boolean;
  isLead?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IJobberClientInput {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  emails?: IJobberEmail[];
  phones?: IJobberPhone[];
  billingAddress?: IJobberAddress;
  isCompany?: boolean;
  isLead?: boolean;
  tags?: string[];
}

// Property Types
export interface IJobberProperty {
  id: string;
  client?: { id: string };
  address?: IJobberAddress;
  taxRate?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IJobberPropertyInput {
  clientId: string;
  address?: IJobberAddress;
  taxRate?: number;
  notes?: string;
}

// Line Item Types
export interface IJobberLineItem {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  taxable?: boolean;
}

// Quote Types
export type QuoteStatus = 'draft' | 'awaiting_response' | 'approved' | 'rejected' | 'converted';

export interface IJobberQuote {
  id: string;
  quoteNumber?: number;
  quoteStatus?: QuoteStatus;
  client?: { id: string };
  property?: { id: string };
  lineItems?: IJobberLineItem[];
  message?: string;
  validUntil?: string;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IJobberQuoteInput {
  clientId: string;
  propertyId?: string;
  lineItems?: IJobberLineItem[];
  message?: string;
  validUntil?: string;
}

// Job Types
export type JobStatus = 'active' | 'archived' | 'completed';
export type JobType = 'one_off' | 'recurring';

export interface IJobberJob {
  id: string;
  jobNumber?: number;
  jobStatus?: JobStatus;
  jobType?: JobType;
  client?: { id: string };
  property?: { id: string };
  lineItems?: IJobberLineItem[];
  instructions?: string;
  title?: string;
  startAt?: string;
  endAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IJobberJobInput {
  clientId: string;
  propertyId?: string;
  lineItems?: IJobberLineItem[];
  instructions?: string;
  title?: string;
  jobType?: JobType;
}

// Visit Types
export interface IJobberVisit {
  id: string;
  job?: { id: string };
  title?: string;
  startAt?: string;
  endAt?: string;
  allDay?: boolean;
  assignedUsers?: { id: string }[];
  completedAt?: string;
  instructions?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IJobberVisitInput {
  jobId: string;
  title?: string;
  startAt: string;
  endAt?: string;
  allDay?: boolean;
  assignedUserIds?: string[];
  instructions?: string;
}

// Invoice Types
export type InvoiceStatus = 'draft' | 'awaiting_payment' | 'past_due' | 'paid' | 'bad_debt';

export interface IJobberInvoice {
  id: string;
  invoiceNumber?: number;
  invoiceStatus?: InvoiceStatus;
  client?: { id: string };
  lineItems?: IJobberLineItem[];
  subject?: string;
  dueDate?: string;
  amountDue?: number;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IJobberInvoiceInput {
  clientId: string;
  lineItems?: IJobberLineItem[];
  subject?: string;
  dueDate?: string;
  jobId?: string;
}

// Payment Types
export type PaymentMethod = 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'other';

export interface IJobberPayment {
  id: string;
  invoice?: { id: string };
  amount?: number;
  paymentMethod?: PaymentMethod;
  receivedAt?: string;
  details?: string;
  createdAt?: string;
}

export interface IJobberPaymentInput {
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  receivedAt?: string;
  details?: string;
}

// User Types
export type UserRole = 'admin' | 'manager' | 'user';

export interface IJobberUser {
  id: string;
  name?: { full?: string; first?: string; last?: string };
  email?: { address: string };
  role?: UserRole;
  isAccountOwner?: boolean;
  phone?: { number: string };
  createdAt?: string;
}

// Product/Service Types
export type ProductCategory = 'products' | 'services';

export interface IJobberProduct {
  id: string;
  name?: string;
  description?: string;
  defaultUnitCost?: number;
  category?: ProductCategory;
  taxable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IJobberProductInput {
  name: string;
  description?: string;
  defaultUnitCost?: number;
  category?: ProductCategory;
  taxable?: boolean;
}

// Time Entry Types
export interface IJobberTimeEntry {
  id: string;
  user?: { id: string };
  visit?: { id: string };
  startAt?: string;
  endAt?: string;
  durationSeconds?: number;
  note?: string;
  createdAt?: string;
}

export interface IJobberTimeEntryInput {
  userId: string;
  visitId?: string;
  startAt: string;
  endAt?: string;
  note?: string;
}

// Expense Types
export interface IJobberExpense {
  id: string;
  title?: string;
  amount?: number;
  job?: { id: string };
  user?: { id: string };
  date?: string;
  reimburseToUser?: boolean;
  description?: string;
  createdAt?: string;
}

export interface IJobberExpenseInput {
  title: string;
  amount: number;
  jobId?: string;
  userId?: string;
  date?: string;
  reimburseToUser?: boolean;
  description?: string;
}

// Webhook Types
export type WebhookTopic =
  | 'CLIENT_CREATE'
  | 'CLIENT_UPDATE'
  | 'JOB_CREATE'
  | 'JOB_UPDATE'
  | 'QUOTE_CREATE'
  | 'QUOTE_UPDATE'
  | 'INVOICE_CREATE'
  | 'INVOICE_UPDATE'
  | 'VISIT_COMPLETE';

export interface IJobberWebhook {
  id: string;
  url: string;
  topic: WebhookTopic;
  createdAt?: string;
}

export interface IJobberWebhookInput {
  url: string;
  topic: WebhookTopic;
}

// GraphQL Response Types
export interface IGraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: Record<string, unknown>;
  }>;
}

export interface IPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface IEdge<T> {
  node: T;
  cursor: string;
}

export interface IConnection<T> {
  edges: IEdge<T>[];
  pageInfo: IPageInfo;
  totalCount?: number;
}

// Operation result types
export interface IMutationResult<T> {
  success: boolean;
  userErrors?: Array<{ message: string; path?: string[] }>;
  data?: T;
}
