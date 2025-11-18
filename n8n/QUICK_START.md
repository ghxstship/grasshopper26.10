# N8N Quick Start Guide

> **Get up and running with N8N automation in 5 minutes**

---

## ⚡ Quick Setup

### 1. Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit with your credentials
nano .env
```

Required variables:
- `N8N_BASIC_AUTH_USER` - Admin username
- `N8N_BASIC_AUTH_PASSWORD` - Admin password
- `N8N_ENCRYPTION_KEY` - 32+ character encryption key
- `POSTGRES_USER` - Database username
- `POSTGRES_PASSWORD` - Database password

### 2. Start N8N
```bash
# Start all services
docker-compose up -d

# Verify running
docker-compose ps

# Check logs
docker-compose logs -f n8n
```

### 3. Access N8N
Open browser: **http://localhost:5678**

Login with credentials from `.env` file

---

## 🔧 Build Custom Nodes

```bash
# Navigate to nodes directory
cd n8n/nodes

# Install dependencies
npm install

# Build nodes
npm run build

# Restart N8N
docker-compose restart n8n
```

---

## 📥 Import Workflows

1. Open N8N UI: http://localhost:5678
2. Click **Workflows** → **Import**
3. Select JSON file from `/n8n/workflows/`
4. Click **Import**
5. Configure credentials
6. Activate workflow

---

## 🔑 Setup Credentials

### GVTEWAY API
1. **Credentials** → **New** → **GVTEWAY API**
2. Enter API Key
3. Base URL: `http://localhost:3000` (dev) or production URL
4. **Test** → **Save**

### COMPVSS API
1. **Credentials** → **New** → **COMPVSS API**
2. Enter API Key
3. Base URL: `http://localhost:3000` (dev) or production URL
4. **Test** → **Save**

### ATLVS API
1. **Credentials** → **New** → **ATLVS API**
2. Enter API Key
3. Base URL: `http://localhost:3000` (dev) or production URL
4. **Test** → **Save**

---

## 🎯 Common Commands

```bash
# Start N8N
docker-compose up -d

# Stop N8N
docker-compose down

# View logs
docker-compose logs -f n8n

# Restart N8N
docker-compose restart n8n

# Rebuild custom nodes
cd n8n/nodes && npm run build && cd ../.. && docker-compose restart n8n

# Backup workflows
docker exec gvteway-n8n n8n export:workflow --all --output=/data/backup/

# Backup database
docker exec gvteway-n8n-postgres pg_dump -U n8n n8n > n8n-backup.sql
```

---

## 📋 Workflow Templates

### GVTEWAY Workflows
- **01-new-event-notification.json** - Notify users of new events
- **02-ticket-purchase-confirmation.json** - Send ticket confirmations

### COMPVSS Workflows
- **01-advancing-submission-routing.json** - Route advancing requests

### ATLVS Workflows
- Coming soon...

---

## 🐛 Troubleshooting

### N8N won't start
```bash
# Check logs
docker-compose logs n8n

# Common fix: Port conflict
# Edit docker-compose.yml, change port 5678 to another port
```

### Custom nodes not loading
```bash
# Rebuild nodes
cd n8n/nodes
npm run clean
npm install
npm run build

# Restart N8N
docker-compose restart n8n
```

### Workflow execution fails
1. Check **Executions** tab in N8N UI
2. Review error message
3. Verify credentials are configured
4. Test individual nodes

---

## 📚 Resources

- [Full Setup Guide](./SETUP_GUIDE.md)
- [N8N Documentation](https://docs.n8n.io/)
- [Custom Node Development](https://docs.n8n.io/integrations/creating-nodes/)

---

**Built with GHXSTSHIP precision ⚓️**
