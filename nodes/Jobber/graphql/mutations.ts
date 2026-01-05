/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

// Client Mutations
export const CREATE_CLIENT = `
  mutation CreateClient($input: ClientCreateInput!) {
    clientCreate(input: $input) {
      client {
        id
        firstName
        lastName
        companyName
        isCompany
        isLead
        createdAt
        emails {
          address
          primary
        }
        phones {
          number
          primary
        }
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const UPDATE_CLIENT = `
  mutation UpdateClient($id: EncodedId!, $input: ClientUpdateInput!) {
    clientUpdate(id: $id, input: $input) {
      client {
        id
        firstName
        lastName
        companyName
        isCompany
        isLead
        updatedAt
        emails {
          address
          primary
        }
        phones {
          number
          primary
        }
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const ARCHIVE_CLIENT = `
  mutation ArchiveClient($id: EncodedId!) {
    clientArchive(id: $id) {
      client {
        id
        firstName
        lastName
      }
      userErrors {
        message
        path
      }
    }
  }
`;

// Property Mutations
export const CREATE_PROPERTY = `
  mutation CreateProperty($input: PropertyCreateInput!) {
    propertyCreate(input: $input) {
      property {
        id
        client {
          id
        }
        address {
          street1
          street2
          city
          province
          postalCode
          country
        }
        taxRate
        notes
        createdAt
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const UPDATE_PROPERTY = `
  mutation UpdateProperty($id: EncodedId!, $input: PropertyUpdateInput!) {
    propertyUpdate(id: $id, input: $input) {
      property {
        id
        address {
          street1
          street2
          city
          province
          postalCode
          country
        }
        taxRate
        notes
        updatedAt
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const DELETE_PROPERTY = `
  mutation DeleteProperty($id: EncodedId!) {
    propertyDelete(id: $id) {
      deletedPropertyId
      userErrors {
        message
        path
      }
    }
  }
`;

// Quote Mutations
export const CREATE_QUOTE = `
  mutation CreateQuote($input: QuoteCreateInput!) {
    quoteCreate(input: $input) {
      quote {
        id
        quoteNumber
        quoteStatus
        client {
          id
        }
        total
        createdAt
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const UPDATE_QUOTE = `
  mutation UpdateQuote($id: EncodedId!, $input: QuoteUpdateInput!) {
    quoteUpdate(id: $id, input: $input) {
      quote {
        id
        quoteNumber
        quoteStatus
        total
        updatedAt
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const APPROVE_QUOTE = `
  mutation ApproveQuote($id: EncodedId!) {
    quoteApprove(id: $id) {
      quote {
        id
        quoteNumber
        quoteStatus
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const CONVERT_QUOTE_TO_JOB = `
  mutation ConvertQuoteToJob($id: EncodedId!) {
    quoteConvertToJob(id: $id) {
      job {
        id
        jobNumber
        jobStatus
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const SEND_QUOTE_EMAIL = `
  mutation SendQuoteEmail($id: EncodedId!, $input: QuoteSendEmailInput) {
    quoteSendEmail(id: $id, input: $input) {
      quote {
        id
        quoteNumber
      }
      userErrors {
        message
        path
      }
    }
  }
`;

// Job Mutations
export const CREATE_JOB = `
  mutation CreateJob($input: JobCreateInput!) {
    jobCreate(input: $input) {
      job {
        id
        jobNumber
        jobStatus
        jobType
        title
        client {
          id
        }
        total
        createdAt
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const UPDATE_JOB = `
  mutation UpdateJob($id: EncodedId!, $input: JobUpdateInput!) {
    jobUpdate(id: $id, input: $input) {
      job {
        id
        jobNumber
        jobStatus
        title
        total
        updatedAt
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const CLOSE_JOB = `
  mutation CloseJob($id: EncodedId!) {
    jobClose(id: $id) {
      job {
        id
        jobNumber
        jobStatus
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const ARCHIVE_JOB = `
  mutation ArchiveJob($id: EncodedId!) {
    jobArchive(id: $id) {
      job {
        id
        jobNumber
        jobStatus
      }
      userErrors {
        message
        path
      }
    }
  }
`;

// Visit Mutations
export const CREATE_VISIT = `
  mutation CreateVisit($input: VisitCreateInput!) {
    visitCreate(input: $input) {
      visit {
        id
        title
        job {
          id
        }
        startAt
        endAt
        allDay
        createdAt
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const UPDATE_VISIT = `
  mutation UpdateVisit($id: EncodedId!, $input: VisitUpdateInput!) {
    visitUpdate(id: $id, input: $input) {
      visit {
        id
        title
        startAt
        endAt
        allDay
        updatedAt
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const COMPLETE_VISIT = `
  mutation CompleteVisit($id: EncodedId!) {
    visitComplete(id: $id) {
      visit {
        id
        completedAt
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const INCOMPLETE_VISIT = `
  mutation IncompleteVisit($id: EncodedId!) {
    visitIncomplete(id: $id) {
      visit {
        id
        completedAt
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const DELETE_VISIT = `
  mutation DeleteVisit($id: EncodedId!) {
    visitDelete(id: $id) {
      deletedVisitId
      userErrors {
        message
        path
      }
    }
  }
`;

// Invoice Mutations
export const CREATE_INVOICE = `
  mutation CreateInvoice($input: InvoiceCreateInput!) {
    invoiceCreate(input: $input) {
      invoice {
        id
        invoiceNumber
        invoiceStatus
        client {
          id
        }
        total
        amountDue
        createdAt
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const UPDATE_INVOICE = `
  mutation UpdateInvoice($id: EncodedId!, $input: InvoiceUpdateInput!) {
    invoiceUpdate(id: $id, input: $input) {
      invoice {
        id
        invoiceNumber
        invoiceStatus
        total
        amountDue
        updatedAt
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const SEND_INVOICE = `
  mutation SendInvoice($id: EncodedId!, $input: InvoiceSendInput) {
    invoiceSend(id: $id, input: $input) {
      invoice {
        id
        invoiceNumber
        invoiceStatus
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const MARK_INVOICE_PAID = `
  mutation MarkInvoicePaid($id: EncodedId!) {
    invoiceMarkPaid(id: $id) {
      invoice {
        id
        invoiceNumber
        invoiceStatus
        paidAmount
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const VOID_INVOICE = `
  mutation VoidInvoice($id: EncodedId!) {
    invoiceVoid(id: $id) {
      invoice {
        id
        invoiceNumber
        invoiceStatus
      }
      userErrors {
        message
        path
      }
    }
  }
`;

// Payment Mutations
export const CREATE_PAYMENT = `
  mutation CreatePayment($input: PaymentCreateInput!) {
    paymentCreate(input: $input) {
      payment {
        id
        invoice {
          id
          invoiceNumber
        }
        amount
        paymentMethod
        receivedAt
        createdAt
      }
      userErrors {
        message
        path
      }
    }
  }
`;

// Product Mutations
export const CREATE_PRODUCT = `
  mutation CreateProduct($input: ProductOrServiceCreateInput!) {
    productOrServiceCreate(input: $input) {
      productOrService {
        id
        name
        description
        defaultUnitCost
        category
        taxable
        createdAt
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const UPDATE_PRODUCT = `
  mutation UpdateProduct($id: EncodedId!, $input: ProductOrServiceUpdateInput!) {
    productOrServiceUpdate(id: $id, input: $input) {
      productOrService {
        id
        name
        description
        defaultUnitCost
        category
        taxable
        updatedAt
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const DELETE_PRODUCT = `
  mutation DeleteProduct($id: EncodedId!) {
    productOrServiceDelete(id: $id) {
      deletedProductOrServiceId
      userErrors {
        message
        path
      }
    }
  }
`;

// Time Entry Mutations
export const CREATE_TIME_ENTRY = `
  mutation CreateTimeEntry($input: TimeEntryCreateInput!) {
    timeEntryCreate(input: $input) {
      timeEntry {
        id
        user {
          id
        }
        startAt
        endAt
        durationSeconds
        note
        createdAt
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const UPDATE_TIME_ENTRY = `
  mutation UpdateTimeEntry($id: EncodedId!, $input: TimeEntryUpdateInput!) {
    timeEntryUpdate(id: $id, input: $input) {
      timeEntry {
        id
        startAt
        endAt
        durationSeconds
        note
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const DELETE_TIME_ENTRY = `
  mutation DeleteTimeEntry($id: EncodedId!) {
    timeEntryDelete(id: $id) {
      deletedTimeEntryId
      userErrors {
        message
        path
      }
    }
  }
`;

// Expense Mutations
export const CREATE_EXPENSE = `
  mutation CreateExpense($input: ExpenseCreateInput!) {
    expenseCreate(input: $input) {
      expense {
        id
        title
        amount
        job {
          id
        }
        user {
          id
        }
        date
        reimburseToUser
        description
        createdAt
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const UPDATE_EXPENSE = `
  mutation UpdateExpense($id: EncodedId!, $input: ExpenseUpdateInput!) {
    expenseUpdate(id: $id, input: $input) {
      expense {
        id
        title
        amount
        date
        reimburseToUser
        description
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const DELETE_EXPENSE = `
  mutation DeleteExpense($id: EncodedId!) {
    expenseDelete(id: $id) {
      deletedExpenseId
      userErrors {
        message
        path
      }
    }
  }
`;

// Webhook Mutations
export const CREATE_WEBHOOK = `
  mutation CreateWebhook($input: WebhookCreateInput!) {
    webhookCreate(input: $input) {
      webhook {
        id
        url
        topic
        createdAt
      }
      userErrors {
        message
        path
      }
    }
  }
`;

export const DELETE_WEBHOOK = `
  mutation DeleteWebhook($id: EncodedId!) {
    webhookDelete(id: $id) {
      deletedWebhookId
      userErrors {
        message
        path
      }
    }
  }
`;
