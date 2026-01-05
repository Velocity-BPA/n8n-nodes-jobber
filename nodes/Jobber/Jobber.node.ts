/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import * as actions from './actions';

// Emit licensing notice once per node load
const licenseNoticeEmitted = false;
if (!licenseNoticeEmitted) {
  console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
}

export class Jobber implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Jobber',
    name: 'jobber',
    icon: 'file:jobber.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Jobber field service management API',
    defaults: {
      name: 'Jobber',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'jobberApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Client', value: 'client' },
          { name: 'Property', value: 'property' },
          { name: 'Quote', value: 'quote' },
          { name: 'Job', value: 'job' },
          { name: 'Visit', value: 'visit' },
          { name: 'Invoice', value: 'invoice' },
          { name: 'Payment', value: 'payment' },
          { name: 'User', value: 'user' },
          { name: 'Product/Service', value: 'product' },
          { name: 'Time Entry', value: 'timeEntry' },
          { name: 'Expense', value: 'expense' },
          { name: 'Webhook', value: 'webhook' },
        ],
        default: 'client',
      },
      // Client Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['client'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create a client', description: 'Create a new client' },
          { name: 'Get', value: 'get', action: 'Get a client', description: 'Get a client by ID' },
          { name: 'Get Many', value: 'getAll', action: 'Get many clients', description: 'Get many clients' },
          { name: 'Update', value: 'update', action: 'Update a client', description: 'Update a client' },
          { name: 'Archive', value: 'archive', action: 'Archive a client', description: 'Archive a client' },
          { name: 'Get Properties', value: 'getProperties', action: 'Get client properties', description: 'Get properties for a client' },
        ],
        default: 'create',
      },
      // Property Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['property'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create a property', description: 'Create a new property' },
          { name: 'Get', value: 'get', action: 'Get a property', description: 'Get a property by ID' },
          { name: 'Get Many', value: 'getAll', action: 'Get many properties', description: 'Get many properties' },
          { name: 'Update', value: 'update', action: 'Update a property', description: 'Update a property' },
          { name: 'Delete', value: 'delete', action: 'Delete a property', description: 'Delete a property' },
        ],
        default: 'create',
      },
      // Quote Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['quote'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create a quote', description: 'Create a new quote' },
          { name: 'Get', value: 'get', action: 'Get a quote', description: 'Get a quote by ID' },
          { name: 'Get Many', value: 'getAll', action: 'Get many quotes', description: 'Get many quotes' },
          { name: 'Update', value: 'update', action: 'Update a quote', description: 'Update a quote' },
          { name: 'Approve', value: 'approve', action: 'Approve a quote', description: 'Approve a quote' },
          { name: 'Convert to Job', value: 'convertToJob', action: 'Convert quote to job', description: 'Convert a quote to a job' },
          { name: 'Send Email', value: 'sendEmail', action: 'Send quote email', description: 'Send quote via email' },
        ],
        default: 'create',
      },
      // Job Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['job'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create a job', description: 'Create a new job' },
          { name: 'Get', value: 'get', action: 'Get a job', description: 'Get a job by ID' },
          { name: 'Get Many', value: 'getAll', action: 'Get many jobs', description: 'Get many jobs' },
          { name: 'Update', value: 'update', action: 'Update a job', description: 'Update a job' },
          { name: 'Close', value: 'close', action: 'Close a job', description: 'Close a job' },
          { name: 'Archive', value: 'archive', action: 'Archive a job', description: 'Archive a job' },
        ],
        default: 'create',
      },
      // Visit Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['visit'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create a visit', description: 'Create a new visit' },
          { name: 'Get', value: 'get', action: 'Get a visit', description: 'Get a visit by ID' },
          { name: 'Get Many', value: 'getAll', action: 'Get many visits', description: 'Get many visits' },
          { name: 'Update', value: 'update', action: 'Update a visit', description: 'Update a visit' },
          { name: 'Complete', value: 'complete', action: 'Complete a visit', description: 'Mark a visit as complete' },
          { name: 'Delete', value: 'delete', action: 'Delete a visit', description: 'Delete a visit' },
        ],
        default: 'create',
      },
      // Invoice Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['invoice'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create an invoice', description: 'Create a new invoice' },
          { name: 'Get', value: 'get', action: 'Get an invoice', description: 'Get an invoice by ID' },
          { name: 'Get Many', value: 'getAll', action: 'Get many invoices', description: 'Get many invoices' },
          { name: 'Update', value: 'update', action: 'Update an invoice', description: 'Update an invoice' },
          { name: 'Send', value: 'send', action: 'Send an invoice', description: 'Send an invoice via email' },
          { name: 'Mark Paid', value: 'markPaid', action: 'Mark invoice as paid', description: 'Mark an invoice as paid' },
          { name: 'Void', value: 'void', action: 'Void an invoice', description: 'Void an invoice' },
        ],
        default: 'create',
      },
      // Payment Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['payment'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create a payment', description: 'Record a new payment' },
          { name: 'Get', value: 'get', action: 'Get a payment', description: 'Get a payment by ID' },
          { name: 'Get Many', value: 'getAll', action: 'Get many payments', description: 'Get many payments' },
        ],
        default: 'create',
      },
      // User Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['user'] } },
        options: [
          { name: 'Get', value: 'get', action: 'Get a user', description: 'Get a user by ID' },
          { name: 'Get Many', value: 'getAll', action: 'Get many users', description: 'Get many users' },
          { name: 'Get Current', value: 'getCurrent', action: 'Get current user', description: 'Get the currently authenticated user' },
        ],
        default: 'getCurrent',
      },
      // Product Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['product'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create a product', description: 'Create a new product or service' },
          { name: 'Get', value: 'get', action: 'Get a product', description: 'Get a product by ID' },
          { name: 'Get Many', value: 'getAll', action: 'Get many products', description: 'Get many products' },
          { name: 'Update', value: 'update', action: 'Update a product', description: 'Update a product' },
          { name: 'Delete', value: 'delete', action: 'Delete a product', description: 'Delete a product' },
        ],
        default: 'create',
      },
      // Time Entry Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['timeEntry'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create a time entry', description: 'Create a new time entry' },
          { name: 'Get', value: 'get', action: 'Get a time entry', description: 'Get a time entry by ID' },
          { name: 'Get Many', value: 'getAll', action: 'Get many time entries', description: 'Get many time entries' },
          { name: 'Update', value: 'update', action: 'Update a time entry', description: 'Update a time entry' },
          { name: 'Delete', value: 'delete', action: 'Delete a time entry', description: 'Delete a time entry' },
        ],
        default: 'create',
      },
      // Expense Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['expense'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create an expense', description: 'Create a new expense' },
          { name: 'Get', value: 'get', action: 'Get an expense', description: 'Get an expense by ID' },
          { name: 'Get Many', value: 'getAll', action: 'Get many expenses', description: 'Get many expenses' },
          { name: 'Update', value: 'update', action: 'Update an expense', description: 'Update an expense' },
          { name: 'Delete', value: 'delete', action: 'Delete an expense', description: 'Delete an expense' },
        ],
        default: 'create',
      },
      // Webhook Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['webhook'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create a webhook', description: 'Create a new webhook subscription' },
          { name: 'Get Many', value: 'getAll', action: 'Get many webhooks', description: 'Get all webhooks' },
          { name: 'Delete', value: 'delete', action: 'Delete a webhook', description: 'Delete a webhook' },
        ],
        default: 'create',
      },
      // Include operation-specific properties from each resource
      ...actions.client.create.description,
      ...actions.client.get.description,
      ...actions.client.getAll.description,
      ...actions.client.update.description,
      ...actions.client.archive.description,
      ...actions.client.getProperties.description,
      ...actions.property.create.description,
      ...actions.property.get.description,
      ...actions.property.getAll.description,
      ...actions.property.update.description,
      ...actions.property.delete.description,
      ...actions.quote.create.description,
      ...actions.quote.get.description,
      ...actions.quote.getAll.description,
      ...actions.quote.update.description,
      ...actions.quote.approve.description,
      ...actions.quote.convertToJob.description,
      ...actions.quote.sendEmail.description,
      ...actions.job.create.description,
      ...actions.job.get.description,
      ...actions.job.getAll.description,
      ...actions.job.update.description,
      ...actions.job.close.description,
      ...actions.job.archive.description,
      ...actions.visit.create.description,
      ...actions.visit.get.description,
      ...actions.visit.getAll.description,
      ...actions.visit.update.description,
      ...actions.visit.complete.description,
      ...actions.visit.delete.description,
      ...actions.invoice.create.description,
      ...actions.invoice.get.description,
      ...actions.invoice.getAll.description,
      ...actions.invoice.update.description,
      ...actions.invoice.send.description,
      ...actions.invoice.markPaid.description,
      ...actions.invoice.void.description,
      ...actions.payment.create.description,
      ...actions.payment.get.description,
      ...actions.payment.getAll.description,
      ...actions.user.get.description,
      ...actions.user.getAll.description,
      ...actions.user.getCurrent.description,
      ...actions.product.create.description,
      ...actions.product.get.description,
      ...actions.product.getAll.description,
      ...actions.product.update.description,
      ...actions.product.delete.description,
      ...actions.timeEntry.create.description,
      ...actions.timeEntry.get.description,
      ...actions.timeEntry.getAll.description,
      ...actions.timeEntry.update.description,
      ...actions.timeEntry.delete.description,
      ...actions.expense.create.description,
      ...actions.expense.get.description,
      ...actions.expense.getAll.description,
      ...actions.expense.update.description,
      ...actions.expense.delete.description,
      ...actions.webhook.create.description,
      ...actions.webhook.getAll.description,
      ...actions.webhook.delete.description,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let result: IDataObject | IDataObject[];

        switch (resource) {
          case 'client':
            result = await executeClientOperation.call(this, operation, i);
            break;
          case 'property':
            result = await executePropertyOperation.call(this, operation, i);
            break;
          case 'quote':
            result = await executeQuoteOperation.call(this, operation, i);
            break;
          case 'job':
            result = await executeJobOperation.call(this, operation, i);
            break;
          case 'visit':
            result = await executeVisitOperation.call(this, operation, i);
            break;
          case 'invoice':
            result = await executeInvoiceOperation.call(this, operation, i);
            break;
          case 'payment':
            result = await executePaymentOperation.call(this, operation, i);
            break;
          case 'user':
            result = await executeUserOperation.call(this, operation, i);
            break;
          case 'product':
            result = await executeProductOperation.call(this, operation, i);
            break;
          case 'timeEntry':
            result = await executeTimeEntryOperation.call(this, operation, i);
            break;
          case 'expense':
            result = await executeExpenseOperation.call(this, operation, i);
            break;
          case 'webhook':
            result = await executeWebhookOperation.call(this, operation, i);
            break;
          default:
            throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
        }

        if (Array.isArray(result)) {
          returnData.push(...result.map((item) => ({ json: item })));
        } else {
          returnData.push({ json: result });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}

async function executeClientOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number
): Promise<IDataObject | IDataObject[]> {
  switch (operation) {
    case 'create':
      return actions.client.create.execute.call(this, index);
    case 'get':
      return actions.client.get.execute.call(this, index);
    case 'getAll':
      return actions.client.getAll.execute.call(this, index);
    case 'update':
      return actions.client.update.execute.call(this, index);
    case 'archive':
      return actions.client.archive.execute.call(this, index);
    case 'getProperties':
      return actions.client.getProperties.execute.call(this, index);
    default:
      throw new Error(`Unknown client operation: ${operation}`);
  }
}

async function executePropertyOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number
): Promise<IDataObject | IDataObject[]> {
  switch (operation) {
    case 'create':
      return actions.property.create.execute.call(this, index);
    case 'get':
      return actions.property.get.execute.call(this, index);
    case 'getAll':
      return actions.property.getAll.execute.call(this, index);
    case 'update':
      return actions.property.update.execute.call(this, index);
    case 'delete':
      return actions.property.delete.execute.call(this, index);
    default:
      throw new Error(`Unknown property operation: ${operation}`);
  }
}

async function executeQuoteOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number
): Promise<IDataObject | IDataObject[]> {
  switch (operation) {
    case 'create':
      return actions.quote.create.execute.call(this, index);
    case 'get':
      return actions.quote.get.execute.call(this, index);
    case 'getAll':
      return actions.quote.getAll.execute.call(this, index);
    case 'update':
      return actions.quote.update.execute.call(this, index);
    case 'approve':
      return actions.quote.approve.execute.call(this, index);
    case 'convertToJob':
      return actions.quote.convertToJob.execute.call(this, index);
    case 'sendEmail':
      return actions.quote.sendEmail.execute.call(this, index);
    default:
      throw new Error(`Unknown quote operation: ${operation}`);
  }
}

async function executeJobOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number
): Promise<IDataObject | IDataObject[]> {
  switch (operation) {
    case 'create':
      return actions.job.create.execute.call(this, index);
    case 'get':
      return actions.job.get.execute.call(this, index);
    case 'getAll':
      return actions.job.getAll.execute.call(this, index);
    case 'update':
      return actions.job.update.execute.call(this, index);
    case 'close':
      return actions.job.close.execute.call(this, index);
    case 'archive':
      return actions.job.archive.execute.call(this, index);
    default:
      throw new Error(`Unknown job operation: ${operation}`);
  }
}

async function executeVisitOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number
): Promise<IDataObject | IDataObject[]> {
  switch (operation) {
    case 'create':
      return actions.visit.create.execute.call(this, index);
    case 'get':
      return actions.visit.get.execute.call(this, index);
    case 'getAll':
      return actions.visit.getAll.execute.call(this, index);
    case 'update':
      return actions.visit.update.execute.call(this, index);
    case 'complete':
      return actions.visit.complete.execute.call(this, index);
    case 'delete':
      return actions.visit.delete.execute.call(this, index);
    default:
      throw new Error(`Unknown visit operation: ${operation}`);
  }
}

async function executeInvoiceOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number
): Promise<IDataObject | IDataObject[]> {
  switch (operation) {
    case 'create':
      return actions.invoice.create.execute.call(this, index);
    case 'get':
      return actions.invoice.get.execute.call(this, index);
    case 'getAll':
      return actions.invoice.getAll.execute.call(this, index);
    case 'update':
      return actions.invoice.update.execute.call(this, index);
    case 'send':
      return actions.invoice.send.execute.call(this, index);
    case 'markPaid':
      return actions.invoice.markPaid.execute.call(this, index);
    case 'void':
      return actions.invoice.void.execute.call(this, index);
    default:
      throw new Error(`Unknown invoice operation: ${operation}`);
  }
}

async function executePaymentOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number
): Promise<IDataObject | IDataObject[]> {
  switch (operation) {
    case 'create':
      return actions.payment.create.execute.call(this, index);
    case 'get':
      return actions.payment.get.execute.call(this, index);
    case 'getAll':
      return actions.payment.getAll.execute.call(this, index);
    default:
      throw new Error(`Unknown payment operation: ${operation}`);
  }
}

async function executeUserOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number
): Promise<IDataObject | IDataObject[]> {
  switch (operation) {
    case 'get':
      return actions.user.get.execute.call(this, index);
    case 'getAll':
      return actions.user.getAll.execute.call(this, index);
    case 'getCurrent':
      return actions.user.getCurrent.execute.call(this, index);
    default:
      throw new Error(`Unknown user operation: ${operation}`);
  }
}

async function executeProductOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number
): Promise<IDataObject | IDataObject[]> {
  switch (operation) {
    case 'create':
      return actions.product.create.execute.call(this, index);
    case 'get':
      return actions.product.get.execute.call(this, index);
    case 'getAll':
      return actions.product.getAll.execute.call(this, index);
    case 'update':
      return actions.product.update.execute.call(this, index);
    case 'delete':
      return actions.product.delete.execute.call(this, index);
    default:
      throw new Error(`Unknown product operation: ${operation}`);
  }
}

async function executeTimeEntryOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number
): Promise<IDataObject | IDataObject[]> {
  switch (operation) {
    case 'create':
      return actions.timeEntry.create.execute.call(this, index);
    case 'get':
      return actions.timeEntry.get.execute.call(this, index);
    case 'getAll':
      return actions.timeEntry.getAll.execute.call(this, index);
    case 'update':
      return actions.timeEntry.update.execute.call(this, index);
    case 'delete':
      return actions.timeEntry.delete.execute.call(this, index);
    default:
      throw new Error(`Unknown time entry operation: ${operation}`);
  }
}

async function executeExpenseOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number
): Promise<IDataObject | IDataObject[]> {
  switch (operation) {
    case 'create':
      return actions.expense.create.execute.call(this, index);
    case 'get':
      return actions.expense.get.execute.call(this, index);
    case 'getAll':
      return actions.expense.getAll.execute.call(this, index);
    case 'update':
      return actions.expense.update.execute.call(this, index);
    case 'delete':
      return actions.expense.delete.execute.call(this, index);
    default:
      throw new Error(`Unknown expense operation: ${operation}`);
  }
}

async function executeWebhookOperation(
  this: IExecuteFunctions,
  operation: string,
  index: number
): Promise<IDataObject | IDataObject[]> {
  switch (operation) {
    case 'create':
      return actions.webhook.create.execute.call(this, index);
    case 'getAll':
      return actions.webhook.getAll.execute.call(this, index);
    case 'delete':
      return actions.webhook.delete.execute.call(this, index);
    default:
      throw new Error(`Unknown webhook operation: ${operation}`);
  }
}
