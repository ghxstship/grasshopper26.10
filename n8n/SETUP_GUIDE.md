# N8N Setup Guide

> **Complete setup instructions for the GVTEWAY/COMPVSS/ATLVS N8N automation system**

---

## 📋 Prerequisites

- Docker and Docker Compose installed
- PostgreSQL database access
- Node.js 18+ (for custom node development)
- Git

---

## 🚀 Initial Setup

### 1. Environment Configuration

Create `.env` file in the project root:

```bash
# N8N Configuration
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your-secure-password
N8N_HOST=localhost
N8N_WEBHOOK_URL=http://localhost:5678/
N8N_ENCRYPTION_KEY=your-encryption-key-min-32-chars

# PostgreSQL Configuration
POSTGRES_USER=n8n
POSTGRES_PASSWORD=your-db-password
POSTGRES_DB=n8n
POSTGRES_HOST=postgres

# Timezone
TIMEZONE=America/New_York

# Custom Extensions Path
N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom
```

### 2. Start N8N

```bash
# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f n8n

# Access N8N UI
open http://localhost:5678
```

### 3. Build Custom Nodes

```bash
# Navigate to nodes directory
cd n8n/nodes

# Install dependencies
npm install

# Build nodes
npm run build

# Restart N8N to load custom nodes
docker-compose restart n8n
```

---

## 🔧 Custom Node Development

### Node Structure

Each custom node requires:
- `NodeName.node.ts` - Main node logic
- `NodeName.node.json` - Node metadata (optional)
- `icon.svg` - Node icon (optional)

### Development Workflow

1. **Create new node:**
```bash
cd n8n/nodes/nodes
mkdir MyNewNode
cd MyNewNode
touch MyNewNode.node.ts
```

2. **Implement node:**
```typescript
import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class MyNewNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'My New Node',
    name: 'myNewNode',
    group: ['transform'],
    version: 1,
    description: 'Description of what the node does',
    defaults: {
      name: 'My New Node',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      // Node parameters
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Node logic
  }
}
```

3. **Register in package.json:**
```json
{
  "n8n": {
    "nodes": [
      "dist/nodes/MyNewNode/MyNewNode.node.js"
    ]
  }
}
```

4. **Build and test:**
```bash
npm run build
docker-compose restart n8n
```

---

## 📦 Workflow Templates

### Importing Workflows

1. Access N8N UI: http://localhost:5678
2. Navigate to **Workflows** → **Import**
3. Select workflow JSON file from `/n8n/workflows/`
4. Configure credentials
5. Activate workflow

### Available Templates

**GVTEWAY (10 workflows):**
- `01-new-event-notification.json` - Event creation notifications
- `02-ticket-purchase-confirmation.json` - Ticket purchase flow
- `03-order-fulfillment.json` - Order processing
- `04-membership-renewal.json` - Membership renewals
- `05-wishlist-price-alert.json` - Price drop alerts
- `06-event-reminder.json` - Event reminders
- `07-social-post-notification.json` - Social notifications
- `08-nft-minting-automation.json` - NFT minting
- `09-wallet-pass-generation.json` - Wallet pass creation
- `10-analytics-report.json` - Analytics reporting

**COMPVSS (10 workflows):**
- `01-advancing-submission-routing.json` - Advancing request routing
- `02-onboarding-automation.json` - Team onboarding
- `03-day-of-show-checkin.json` - Check-in automation
- `04-issue-escalation.json` - Issue routing
- `05-expense-approval.json` - Expense workflows
- `06-affiliate-commission.json` - Commission calculation
- `07-referral-reward.json` - Referral rewards
- `08-credential-expiration.json` - Credential alerts
- `09-qr-generation.json` - QR code generation
- `10-team-notification.json` - Team notifications

**ATLVS (10 workflows):**
- `01-project-creation.json` - Project automation
- `02-task-assignment.json` - Task notifications
- `03-budget-alert.json` - Budget monitoring
- `04-advancing-approval.json` - Approval routing
- `05-resource-allocation.json` - Resource management
- `06-document-version-control.json` - Document tracking
- `07-vendor-contract-renewal.json` - Contract reminders
- `08-team-performance-report.json` - Performance reports
- `09-asset-maintenance.json` - Maintenance reminders
- `10-analytics-dashboard.json` - Dashboard updates

---

## 🔐 Credentials Setup

### GVTEWAY API

1. Navigate to **Credentials** → **New**
2. Select **GVTEWAY API**
3. Configure:
   - API Key: Your GVTEWAY API key
   - Base URL: `https://api.gvteway.com` (or local dev URL)
4. Test connection
5. Save

### COMPVSS API

1. Navigate to **Credentials** → **New**
2. Select **COMPVSS API**
3. Configure:
   - API Key: Your COMPVSS API key
   - Base URL: `https://api.compvss.com`
4. Test connection
5. Save

### ATLVS API

1. Navigate to **Credentials** → **New**
2. Select **ATLVS API**
3. Configure:
   - API Key: Your ATLVS API key
   - Base URL: `https://api.atlvs.com`
4. Test connection
5. Save

### Third-Party Services

**SendGrid (Email):**
- SMTP Host: `smtp.sendgrid.net`
- Port: `587`
- Username: `apikey`
- Password: Your SendGrid API key

**Twilio (SMS):**
- Account SID: Your Twilio SID
- Auth Token: Your Twilio token

**PostHog (Analytics):**
- API Key: Your PostHog key
- Host: Your PostHog instance URL

---

## 🔄 Webhook Configuration

### Setting Up Webhooks

1. **Production webhook:**
```
https://your-domain.com/webhook/workflow-id
```

2. **Test webhook:**
```
https://your-domain.com/webhook-test/workflow-id
```

3. **Configure in external services:**
- Copy webhook URL from N8N workflow
- Add to external service (Stripe, etc.)
- Test with sample payload

---

## 📊 Monitoring & Debugging

### Execution Logs

1. Navigate to **Executions**
2. Filter by:
   - Workflow
   - Status (success/error)
   - Date range
3. Click execution to view details
4. Review node outputs and errors

### Error Handling

**Common issues:**

1. **Credential errors:**
   - Verify API keys
   - Check credential permissions
   - Test connection

2. **Webhook failures:**
   - Verify webhook URL
   - Check firewall rules
   - Review request payload

3. **Node execution errors:**
   - Check node configuration
   - Verify input data format
   - Review error logs

### Performance Monitoring

Enable metrics in `.env`:
```bash
N8N_METRICS=true
```

Access metrics:
```
http://localhost:5678/metrics
```

---

## 🔧 Maintenance

### Backup Workflows

```bash
# Export all workflows
docker exec gvteway-n8n n8n export:workflow --all --output=/data/backup/

# Copy from container
docker cp gvteway-n8n:/data/backup/ ./n8n-backup/
```

### Update N8N

```bash
# Pull latest image
docker-compose pull n8n

# Restart with new image
docker-compose up -d n8n
```

### Database Backup

```bash
# Backup PostgreSQL
docker exec gvteway-n8n-postgres pg_dump -U n8n n8n > n8n-backup.sql

# Restore
docker exec -i gvteway-n8n-postgres psql -U n8n n8n < n8n-backup.sql
```

---

## 🚨 Troubleshooting

### N8N Won't Start

```bash
# Check logs
docker-compose logs n8n

# Common fixes:
# 1. Port conflict
docker-compose down
# Change port in docker-compose.yml
docker-compose up -d

# 2. Database connection
docker-compose logs postgres
# Verify credentials in .env
```

### Custom Nodes Not Loading

```bash
# Rebuild nodes
cd n8n/nodes
npm run clean
npm install
npm run build

# Restart N8N
docker-compose restart n8n

# Verify in logs
docker-compose logs n8n | grep "custom"
```

### Workflow Execution Fails

1. Check execution logs in UI
2. Verify all credentials are configured
3. Test individual nodes
4. Check API endpoints are accessible
5. Review error messages

---

## 📚 Additional Resources

- [N8N Documentation](https://docs.n8n.io/)
- [Custom Node Development](https://docs.n8n.io/integrations/creating-nodes/)
- [Workflow Examples](https://n8n.io/workflows/)
- [Community Forum](https://community.n8n.io/)

---

## 🎯 Next Steps

1. ✅ Complete environment setup
2. ✅ Build custom nodes
3. ✅ Import workflow templates
4. ✅ Configure credentials
5. ✅ Test workflows
6. ✅ Deploy to production
7. ✅ Monitor executions
8. ✅ Optimize performance

---

**Built with GHXSTSHIP precision ⚓️**
