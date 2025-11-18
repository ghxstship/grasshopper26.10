# N8N Automation System

> **Workflow automation for GVTEWAY, COMPVSS, and ATLVS platforms**

---

## 🎯 Overview

This N8N instance provides workflow automation across all three platforms:
- **GVTEWAY**: Consumer-facing event automation
- **COMPVSS**: External team coordination workflows
- **ATLVS**: Internal production management automation

---

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- PostgreSQL database (included in docker-compose)
- Environment variables configured

### Setup

1. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your credentials
```

2. **Start N8N:**
```bash
docker-compose up -d
```

3. **Access N8N:**
- URL: http://localhost:5678
- Default credentials: Set in .env file

4. **Import workflows:**
- Navigate to Workflows → Import
- Select templates from `/n8n/workflows/`

---

## 📦 Custom Nodes (13)

### GVTEWAY Nodes (5)
1. **GVTEWAY Event Trigger** - Monitors event creation/updates
2. **GVTEWAY Ticket Node** - Manages ticket operations
3. **GVTEWAY Order Node** - Handles order processing
4. **GVTEWAY User Node** - User management operations
5. **GVTEWAY Credential Node** - Credential/wallet operations

### COMPVSS Nodes (1)
6. **COMPVSS Advancing Node** - Production advancing workflows

### ATLVS Nodes (5)
7. **ATLVS Project Trigger** - Project lifecycle events
8. **ATLVS Task Node** - Task management operations
9. **ATLVS Budget Node** - Budget tracking and alerts
10. **ATLVS Team Node** - Team coordination
11. **ATLVS Asset Node** - Asset management

### Universal Nodes (2)
12. **Universal Credential Node** - Cross-platform credentials
13. **Cross-Platform Sync Node** - Data synchronization

---

## 🔄 Workflow Templates (30+)

### GVTEWAY Workflows (10)
- New event notification
- Ticket purchase confirmation
- Order fulfillment automation
- Membership renewal reminders
- Wishlist price alerts
- Event reminder notifications
- Social post notifications
- NFT minting automation
- Wallet pass generation
- Analytics report generation

### COMPVSS Workflows (10)
- Onboarding automation
- Advancing submission routing
- Day-of-show check-in automation
- Issue escalation workflows
- Expense approval routing
- Affiliate commission calculation
- Referral reward distribution
- Credential expiration alerts
- QR code generation
- Team notification system

### ATLVS Workflows (10)
- Project creation automation
- Task assignment notifications
- Budget alert system
- Advancing approval routing
- Resource allocation automation
- Document version control
- Vendor contract renewal reminders
- Team performance reports
- Asset maintenance reminders
- Analytics dashboard updates

---

## 🔧 Development

### Creating Custom Nodes

1. **Node structure:**
```
n8n/nodes/
├── GvtewayEventTrigger/
│   ├── GvtewayEventTrigger.node.ts
│   ├── GvtewayEventTrigger.node.json
│   └── icon.svg
```

2. **Build nodes:**
```bash
cd n8n/nodes
npm install
npm run build
```

3. **Restart N8N:**
```bash
docker-compose restart n8n
```

### Creating Workflows

1. Use N8N UI to create workflows
2. Export as JSON
3. Save to `/n8n/workflows/`
4. Document in workflow README

---

## 🔐 Security

### Credentials Management
- All API keys stored in N8N credential system
- Encrypted at rest
- Never committed to version control

### Webhook Security
- Use webhook authentication
- Validate request signatures
- Rate limiting enabled

---

## 📊 Monitoring

### Execution Logs
- View in N8N UI: Executions tab
- Filter by workflow, status, date
- Export for analysis

### Metrics
- Execution success rate
- Average execution time
- Error frequency
- Resource usage

### Alerts
- Failed execution notifications
- Error threshold alerts
- Performance degradation warnings

---

## 🔗 Integration

### API Endpoints
```typescript
// Webhook endpoint
POST https://your-domain.com/webhook/workflow-id

// Manual trigger
POST https://your-domain.com/webhook-test/workflow-id
```

### Database Access
- Direct Prisma integration
- Read/write operations
- Transaction support

---

## 🐛 Troubleshooting

### Common Issues

**N8N won't start:**
```bash
docker-compose logs n8n
# Check for port conflicts, database connection
```

**Custom nodes not loading:**
```bash
# Verify node structure
# Check build output
# Restart container
docker-compose restart n8n
```

**Workflow execution fails:**
- Check credentials
- Verify API endpoints
- Review execution logs
- Test individual nodes

---

## 📚 Resources

- [N8N Documentation](https://docs.n8n.io/)
- [Custom Node Development](https://docs.n8n.io/integrations/creating-nodes/)
- [Workflow Best Practices](https://docs.n8n.io/workflows/best-practices/)

---

**Built with GHXSTSHIP precision ⚓️**
