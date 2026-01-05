# n8n-nodes-jobber

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Jobber, the #1 field service management software. This node enables workflow automation for job scheduling, invoicing, client management, and team coordination through Jobber's GraphQL API.

![n8n](https://img.shields.io/badge/n8n-community%20node-orange)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## Features

- **12 Resource Categories**: Clients, Properties, Quotes, Jobs, Visits, Invoices, Payments, Users, Products/Services, Time Entries, Expenses, and Webhooks
- **55+ Operations**: Full CRUD operations for all resources plus specialized actions
- **OAuth 2.0 Authentication**: Secure authentication with automatic token refresh
- **GraphQL API Integration**: Native GraphQL queries and mutations for optimal performance
- **Webhook Triggers**: Real-time event notifications for clients, jobs, quotes, invoices, and visits
- **Field Service Workflows**: Purpose-built for landscaping, HVAC, plumbing, cleaning, and other field service businesses

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Search for `n8n-nodes-jobber`
4. Click **Install**

### Manual Installation

```bash
# In your n8n root directory
npm install n8n-nodes-jobber
```

### Development Installation

```bash
# Extract and enter directory
cd n8n-nodes-jobber

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-jobber

# Restart n8n
n8n start
```

## Credentials Setup

### Creating a Jobber App

1. Log in to your [Jobber Developer Account](https://developer.getjobber.com/)
2. Create a new application
3. Configure the redirect URI for OAuth
4. Note your **Client ID** and **Client Secret**

### Configuring Credentials in n8n

| Field | Description |
|-------|-------------|
| Client ID | Your Jobber OAuth Client ID |
| Client Secret | Your Jobber OAuth Client Secret |

The node handles OAuth 2.0 authorization flow and automatic token refresh.

## Resources & Operations

### Client
| Operation | Description |
|-----------|-------------|
| Create | Create a new client |
| Get | Get a client by ID |
| Get Many | List all clients with pagination |
| Update | Update client information |
| Archive | Archive a client |
| Get Properties | Get all properties for a client |

### Property
| Operation | Description |
|-----------|-------------|
| Create | Create a new property |
| Get | Get a property by ID |
| Get Many | List all properties |
| Update | Update property information |
| Delete | Delete a property |

### Quote
| Operation | Description |
|-----------|-------------|
| Create | Create a new quote |
| Get | Get a quote by ID |
| Get Many | List quotes with status filter |
| Update | Update quote details |
| Approve | Approve a quote |
| Convert to Job | Convert quote to a job |
| Send Email | Send quote via email |

### Job
| Operation | Description |
|-----------|-------------|
| Create | Create a new job |
| Get | Get a job by ID |
| Get Many | List jobs with status filter |
| Update | Update job details |
| Close | Close a completed job |
| Archive | Archive a job |

### Visit
| Operation | Description |
|-----------|-------------|
| Create | Schedule a new visit |
| Get | Get a visit by ID |
| Get Many | List visits with filters |
| Update | Update visit details |
| Complete | Mark visit as complete |
| Delete | Delete a visit |

### Invoice
| Operation | Description |
|-----------|-------------|
| Create | Create a new invoice |
| Get | Get an invoice by ID |
| Get Many | List invoices with status filter |
| Update | Update invoice details |
| Send | Send invoice via email |
| Mark Paid | Mark invoice as paid |
| Void | Void an invoice |

### Payment
| Operation | Description |
|-----------|-------------|
| Create | Record a new payment |
| Get | Get a payment by ID |
| Get Many | List all payments |

### User (Team)
| Operation | Description |
|-----------|-------------|
| Get | Get a user by ID |
| Get Many | List all team members |
| Get Current | Get authenticated user |

### Product/Service
| Operation | Description |
|-----------|-------------|
| Create | Create a new product/service |
| Get | Get a product by ID |
| Get Many | List all products/services |
| Update | Update product details |
| Delete | Delete a product |

### Time Entry
| Operation | Description |
|-----------|-------------|
| Create | Create a time entry |
| Get | Get a time entry by ID |
| Get Many | List all time entries |
| Update | Update time entry |
| Delete | Delete a time entry |

### Expense
| Operation | Description |
|-----------|-------------|
| Create | Create an expense |
| Get | Get an expense by ID |
| Get Many | List all expenses |
| Update | Update expense details |
| Delete | Delete an expense |

### Webhook
| Operation | Description |
|-----------|-------------|
| Create | Create a webhook subscription |
| Get Many | List all webhooks |
| Delete | Delete a webhook |

## Trigger Node

The **Jobber Trigger** node listens for real-time events:

| Event | Description |
|-------|-------------|
| CLIENT_CREATE | New client created |
| CLIENT_UPDATE | Client information updated |
| JOB_CREATE | New job created |
| JOB_UPDATE | Job updated |
| QUOTE_CREATE | New quote created |
| QUOTE_UPDATE | Quote updated |
| INVOICE_CREATE | New invoice created |
| INVOICE_UPDATE | Invoice updated |
| VISIT_COMPLETE | Visit marked complete |

## Usage Examples

### Create a New Client

```json
{
  "resource": "client",
  "operation": "create",
  "firstName": "John",
  "lastName": "Smith",
  "companyName": "Smith Landscaping",
  "emails": [
    {
      "address": "john@smithlandscaping.com",
      "primary": true
    }
  ],
  "phones": [
    {
      "number": "555-123-4567",
      "primary": true
    }
  ]
}
```

### Create a Job from Quote

1. Use **Quote > Convert to Job** operation
2. Provide the Quote ID
3. The job is automatically created with quote details

### Schedule a Visit

```json
{
  "resource": "visit",
  "operation": "create",
  "jobId": "abc123",
  "title": "Lawn Maintenance",
  "startAt": "2024-03-15T09:00:00Z",
  "endAt": "2024-03-15T11:00:00Z",
  "assignedUserIds": ["user1", "user2"]
}
```

## Field Service Concepts

### Job Types
- **One-Off**: Single occurrence jobs
- **Recurring**: Jobs that repeat on a schedule

### Quote Workflow
1. Create quote for client
2. Send quote via email
3. Client approves quote
4. Convert approved quote to job

### Invoice Workflow
1. Create invoice from completed job
2. Send invoice to client
3. Record payment when received
4. Invoice marked as paid

## Error Handling

The node handles errors gracefully:

- **Authentication Errors**: Token refresh handled automatically
- **Rate Limiting**: Implements exponential backoff
- **Validation Errors**: Returns detailed error messages
- **GraphQL Errors**: Parses and returns user-friendly messages

## Security Best Practices

1. **Store credentials securely**: Use n8n's credential management
2. **Use minimum required scopes**: Only request necessary permissions
3. **Implement webhook verification**: Validate webhook signatures
4. **Regular token rotation**: Refresh tokens are rotated automatically
5. **Audit logging**: Enable n8n audit logs for compliance

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-jobber/issues)
- **Documentation**: [Jobber API Docs](https://developer.getjobber.com/)
- **Community**: [n8n Community Forum](https://community.n8n.io/)

## Acknowledgments

- [Jobber](https://getjobber.com/) for their excellent API and documentation
- [n8n](https://n8n.io/) for the powerful workflow automation platform
- The n8n community for inspiration and feedback
