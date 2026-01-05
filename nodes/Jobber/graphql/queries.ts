/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

// Client Queries
export const GET_CLIENT = `
  query GetClient($id: EncodedId!) {
    client(id: $id) {
      id
      firstName
      lastName
      companyName
      isCompany
      isLead
      createdAt
      updatedAt
      emails {
        address
        description
        primary
      }
      phones {
        number
        description
        primary
        smsAllowed
      }
      billingAddress {
        street1
        street2
        city
        province
        postalCode
        country
      }
      tags
    }
  }
`;

export const GET_ALL_CLIENTS = `
  query GetAllClients($first: Int, $after: String, $searchTerm: String) {
    clients(first: $first, after: $after, searchTerm: $searchTerm) {
      edges {
        node {
          id
          firstName
          lastName
          companyName
          isCompany
          isLead
          createdAt
          updatedAt
          emails {
            address
            primary
          }
          phones {
            number
            primary
          }
          tags
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
      totalCount
    }
  }
`;

export const GET_CLIENT_PROPERTIES = `
  query GetClientProperties($clientId: EncodedId!, $first: Int, $after: String) {
    client(id: $clientId) {
      properties(first: $first, after: $after) {
        edges {
          node {
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
            createdAt
            updatedAt
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

// Property Queries
export const GET_PROPERTY = `
  query GetProperty($id: EncodedId!) {
    property(id: $id) {
      id
      client {
        id
        firstName
        lastName
        companyName
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
      updatedAt
    }
  }
`;

export const GET_ALL_PROPERTIES = `
  query GetAllProperties($first: Int, $after: String) {
    properties(first: $first, after: $after) {
      edges {
        node {
          id
          client {
            id
            firstName
            lastName
            companyName
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
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

// Quote Queries
export const GET_QUOTE = `
  query GetQuote($id: EncodedId!) {
    quote(id: $id) {
      id
      quoteNumber
      quoteStatus
      client {
        id
        firstName
        lastName
        companyName
      }
      property {
        id
        address {
          street1
          city
          province
        }
      }
      lineItems {
        name
        description
        quantity
        unitPrice
        taxable
        total
      }
      message
      validUntil
      total
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_QUOTES = `
  query GetAllQuotes($first: Int, $after: String, $filter: QuoteFilterAttributes) {
    quotes(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          quoteNumber
          quoteStatus
          client {
            id
            firstName
            lastName
            companyName
          }
          total
          validUntil
          createdAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

// Job Queries
export const GET_JOB = `
  query GetJob($id: EncodedId!) {
    job(id: $id) {
      id
      jobNumber
      jobStatus
      jobType
      title
      client {
        id
        firstName
        lastName
        companyName
      }
      property {
        id
        address {
          street1
          city
          province
        }
      }
      lineItems {
        name
        description
        quantity
        unitPrice
        taxable
        total
      }
      instructions
      total
      startAt
      endAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_JOBS = `
  query GetAllJobs($first: Int, $after: String, $filter: JobFilterAttributes) {
    jobs(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          jobNumber
          jobStatus
          jobType
          title
          client {
            id
            firstName
            lastName
            companyName
          }
          total
          startAt
          createdAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

// Visit Queries
export const GET_VISIT = `
  query GetVisit($id: EncodedId!) {
    visit(id: $id) {
      id
      title
      job {
        id
        jobNumber
        title
      }
      startAt
      endAt
      allDay
      assignedUsers {
        id
        name {
          full
        }
      }
      completedAt
      instructions
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_VISITS = `
  query GetAllVisits($first: Int, $after: String, $filter: VisitFilterAttributes) {
    visits(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          title
          job {
            id
            jobNumber
          }
          startAt
          endAt
          allDay
          completedAt
          createdAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

// Invoice Queries
export const GET_INVOICE = `
  query GetInvoice($id: EncodedId!) {
    invoice(id: $id) {
      id
      invoiceNumber
      invoiceStatus
      client {
        id
        firstName
        lastName
        companyName
      }
      lineItems {
        name
        description
        quantity
        unitPrice
        taxable
        total
      }
      subject
      dueDate
      amountDue
      total
      paidAmount
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_INVOICES = `
  query GetAllInvoices($first: Int, $after: String, $filter: InvoiceFilterAttributes) {
    invoices(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          invoiceNumber
          invoiceStatus
          client {
            id
            firstName
            lastName
            companyName
          }
          total
          amountDue
          dueDate
          createdAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

// Payment Queries
export const GET_PAYMENT = `
  query GetPayment($id: EncodedId!) {
    payment(id: $id) {
      id
      invoice {
        id
        invoiceNumber
      }
      amount
      paymentMethod
      receivedAt
      details
      createdAt
    }
  }
`;

export const GET_ALL_PAYMENTS = `
  query GetAllPayments($first: Int, $after: String) {
    payments(first: $first, after: $after) {
      edges {
        node {
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
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

// User Queries
export const GET_USER = `
  query GetUser($id: EncodedId!) {
    user(id: $id) {
      id
      name {
        full
        first
        last
      }
      email {
        address
      }
      phone {
        number
      }
      role
      isAccountOwner
      createdAt
    }
  }
`;

export const GET_ALL_USERS = `
  query GetAllUsers($first: Int, $after: String) {
    users(first: $first, after: $after) {
      edges {
        node {
          id
          name {
            full
            first
            last
          }
          email {
            address
          }
          role
          isAccountOwner
          createdAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_CURRENT_USER = `
  query GetCurrentUser {
    user {
      id
      name {
        full
        first
        last
      }
      email {
        address
      }
      phone {
        number
      }
      role
      isAccountOwner
      createdAt
    }
  }
`;

// Product Queries
export const GET_PRODUCT = `
  query GetProduct($id: EncodedId!) {
    productOrService(id: $id) {
      id
      name
      description
      defaultUnitCost
      category
      taxable
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_PRODUCTS = `
  query GetAllProducts($first: Int, $after: String, $filter: ProductOrServiceFilterAttributes) {
    productsAndServices(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          name
          description
          defaultUnitCost
          category
          taxable
          createdAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

// Time Entry Queries
export const GET_TIME_ENTRY = `
  query GetTimeEntry($id: EncodedId!) {
    timeEntry(id: $id) {
      id
      user {
        id
        name {
          full
        }
      }
      visit {
        id
        job {
          id
          jobNumber
        }
      }
      startAt
      endAt
      durationSeconds
      note
      createdAt
    }
  }
`;

export const GET_ALL_TIME_ENTRIES = `
  query GetAllTimeEntries($first: Int, $after: String, $filter: TimeEntryFilterAttributes) {
    timeEntries(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          user {
            id
            name {
              full
            }
          }
          startAt
          endAt
          durationSeconds
          note
          createdAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

// Expense Queries
export const GET_EXPENSE = `
  query GetExpense($id: EncodedId!) {
    expense(id: $id) {
      id
      title
      amount
      job {
        id
        jobNumber
      }
      user {
        id
        name {
          full
        }
      }
      date
      reimburseToUser
      description
      createdAt
    }
  }
`;

export const GET_ALL_EXPENSES = `
  query GetAllExpenses($first: Int, $after: String, $filter: ExpenseFilterAttributes) {
    expenses(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          title
          amount
          job {
            id
            jobNumber
          }
          user {
            id
            name {
              full
            }
          }
          date
          reimburseToUser
          createdAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

// Webhook Queries
export const GET_ALL_WEBHOOKS = `
  query GetAllWebhooks {
    webhooks {
      id
      url
      topic
      createdAt
    }
  }
`;
