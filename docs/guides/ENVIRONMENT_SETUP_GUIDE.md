# Environment Setup Guide
**Last Updated:** November 15, 2025  
**Estimated Time:** 4-8 hours per environment  
**Prerequisites:** Database access, hosting platform account, domain access

---

## Overview

This guide walks through configuring staging and production environments for the GVTEWAY-ATLVS platform.

**Environments:**
- **Development** - Local machine (already configured)
- **Staging** - Pre-production testing environment
- **Production** - Live production environment

---

## Quick Start Checklist

### Staging Environment (4-6 hours)
- [ ] Provision PostgreSQL database
- [ ] Configure environment variables
- [ ] Set up domain and SSL
- [ ] Deploy application
- [ ] Run database migrations
- [ ] Verify all integrations
- [ ] Run smoke tests

### Production Environment (6-8 hours)
- [ ] Provision PostgreSQL database with backups
- [ ] Configure environment variables
- [ ] Set up production domain and SSL
- [ ] Configure CDN
- [ ] Deploy application
- [ ] Run database migrations
- [ ] Verify all integrations
- [ ] Configure monitoring alerts
- [ ] Run full test suite
- [ ] Set up backup strategy

---

## Part 1: Database Setup

### Staging Database

**Option A: Supabase (Recommended)**
```bash
# 1. Create new Supabase project
# Visit: https://supabase.com/dashboard
# Project name: gvteway-atlvs-staging
# Region: Choose closest to your users
# Database password: Generate strong password

# 2. Get connection string
# Dashboard → Settings → Database
# Copy "Connection string" (Transaction mode)
```

**Option B: Railway**
```bash
# 1. Create new Railway project
railway login
railway init
railway add postgresql

# 2. Get connection string
railway variables
# Copy DATABASE_URL
```

**Option C: Render**
```bash
# 1. Create PostgreSQL database
# Visit: https://dashboard.render.com
# New → PostgreSQL
# Name: gvteway-atlvs-staging
# Region: Choose closest region

# 2. Copy connection details
# Internal Database URL (for app)
# External Database URL (for migrations)
```

### Production Database

**Requirements:**
- Automated backups (daily minimum)
- Point-in-time recovery
- High availability (99.9%+ uptime)
- Monitoring and alerts
- Connection pooling

**Recommended Providers:**
1. **Supabase Pro** - $25/month, includes backups
2. **Railway Pro** - $20/month + usage
3. **Render** - $7/month (starter), $20/month (standard)
4. **AWS RDS** - Variable pricing, enterprise-grade

**Setup Example (Supabase Pro):**
```bash
# 1. Upgrade to Pro plan
# Dashboard → Billing → Upgrade to Pro

# 2. Enable point-in-time recovery
# Dashboard → Settings → Database → Enable PITR

# 3. Configure backup retention
# Dashboard → Settings → Database → Backup retention: 7 days

# 4. Get connection string
# Dashboard → Settings → Database → Connection string
```

---

## Part 2: Environment Variables

### Required Variables (All Environments)

Create `.env.staging` and `.env.production` files:

```bash
# =============================================================================
# DATABASE
# =============================================================================
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
DIRECT_URL="postgresql://user:password@host:5432/database?schema=public" # For migrations

# =============================================================================
# NEXTAUTH
# =============================================================================
NEXTAUTH_URL="https://staging.yourdomain.com" # or production URL
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# =============================================================================
# STRIPE
# =============================================================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..." # Use pk_live_ for production
STRIPE_SECRET_KEY="sk_test_..." # Use sk_live_ for production
STRIPE_WEBHOOK_SECRET="whsec_..." # Get from Stripe dashboard

# =============================================================================
# SENDGRID
# =============================================================================
SENDGRID_API_KEY="SG...." # Get from SendGrid dashboard
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
SENDGRID_FROM_NAME="GVTEWAY"

# =============================================================================
# SUPABASE STORAGE
# =============================================================================
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..." # Public anon key
SUPABASE_SERVICE_ROLE_KEY="eyJ..." # Secret service role key

# =============================================================================
# FIREBASE (Push Notifications)
# =============================================================================
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# =============================================================================
# PINATA (IPFS for NFTs)
# =============================================================================
PINATA_API_KEY="your-api-key"
PINATA_SECRET_API_KEY="your-secret-key"
PINATA_JWT="eyJ..." # JWT token

# =============================================================================
# WEB3 / BLOCKCHAIN
# =============================================================================
NEXT_PUBLIC_CHAIN_ID="11155111" # Sepolia testnet (1 for mainnet)
NEXT_PUBLIC_RPC_URL="https://sepolia.infura.io/v3/YOUR-PROJECT-ID"
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS="0x..." # Deploy contract first
DEPLOYER_PRIVATE_KEY="0x..." # For contract deployment only

# =============================================================================
# POSTHOG (Analytics)
# =============================================================================
NEXT_PUBLIC_POSTHOG_KEY="phc_..." # Get from PostHog
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
POSTHOG_API_KEY="phx_..." # Server-side API key

# =============================================================================
# SENTRY (Error Tracking)
# =============================================================================
NEXT_PUBLIC_SENTRY_DSN="https://...@sentry.io/..."
SENTRY_AUTH_TOKEN="..." # For source maps upload
SENTRY_ORG="your-org"
SENTRY_PROJECT="gvteway-atlvs"

# =============================================================================
# REDIS (Caching - Optional but Recommended)
# =============================================================================
REDIS_URL="redis://default:password@host:6379"

# =============================================================================
# APPLICATION
# =============================================================================
NEXT_PUBLIC_APP_URL="https://staging.yourdomain.com"
NODE_ENV="production" # Use "production" for both staging and production
```

### Generate Secrets

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# DEPLOYER_PRIVATE_KEY (for NFT deployment)
# Use a dedicated wallet, fund with testnet ETH
# Export private key from MetaMask (DO NOT use personal wallet)
```

---

## Part 3: Third-Party Service Configuration

### 1. Stripe Setup

**Staging (Test Mode):**
```bash
# 1. Visit https://dashboard.stripe.com/test/apikeys
# 2. Copy "Publishable key" → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# 3. Copy "Secret key" → STRIPE_SECRET_KEY
# 4. Set up webhook:
#    - URL: https://staging.yourdomain.com/api/webhooks/stripe
#    - Events: checkout.session.completed, payment_intent.succeeded
#    - Copy webhook secret → STRIPE_WEBHOOK_SECRET
```

**Production (Live Mode):**
```bash
# 1. Complete Stripe account verification
# 2. Visit https://dashboard.stripe.com/apikeys
# 3. Copy live keys (pk_live_ and sk_live_)
# 4. Set up production webhook with same events
```

### 2. SendGrid Setup

```bash
# 1. Visit https://app.sendgrid.com/settings/api_keys
# 2. Create API Key → Full Access
# 3. Copy API key → SENDGRID_API_KEY
# 4. Verify sender email:
#    - Settings → Sender Authentication
#    - Verify your domain or single sender
```

### 3. Supabase Storage Setup

```bash
# 1. Create new Supabase project (or use existing)
# 2. Dashboard → Settings → API
# 3. Copy:
#    - Project URL → NEXT_PUBLIC_SUPABASE_URL
#    - anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - service_role → SUPABASE_SERVICE_ROLE_KEY
# 4. Create storage bucket:
#    - Storage → Create bucket → "uploads"
#    - Make public or set RLS policies
```

### 4. Firebase Setup

```bash
# 1. Visit https://console.firebase.google.com
# 2. Create project or use existing
# 3. Project Settings → Service Accounts
# 4. Generate new private key (downloads JSON)
# 5. Extract from JSON:
#    - project_id → FIREBASE_PROJECT_ID
#    - client_email → FIREBASE_CLIENT_EMAIL
#    - private_key → FIREBASE_PRIVATE_KEY (keep \n characters)
```

### 5. Pinata (IPFS) Setup

```bash
# 1. Visit https://app.pinata.cloud
# 2. API Keys → New Key
# 3. Admin access
# 4. Copy:
#    - API Key → PINATA_API_KEY
#    - API Secret → PINATA_SECRET_API_KEY
#    - JWT → PINATA_JWT
```

### 6. PostHog Setup

```bash
# 1. Visit https://app.posthog.com
# 2. Create project: "GVTEWAY-ATLVS Staging/Production"
# 3. Project Settings → Copy:
#    - Project API Key → NEXT_PUBLIC_POSTHOG_KEY
#    - Host → NEXT_PUBLIC_POSTHOG_HOST
# 4. Personal API Keys → Create → POSTHOG_API_KEY
```

### 7. Sentry Setup

```bash
# 1. Visit https://sentry.io
# 2. Create project: "gvteway-atlvs-staging/production"
# 3. Platform: Next.js
# 4. Copy DSN → NEXT_PUBLIC_SENTRY_DSN
# 5. Settings → Auth Tokens → Create token
#    - Scopes: project:releases, project:write
#    - Copy → SENTRY_AUTH_TOKEN
```

### 8. Infura (Blockchain RPC)

```bash
# 1. Visit https://infura.io
# 2. Create new project
# 3. Endpoints → Sepolia (testnet) or Mainnet
# 4. Copy HTTPS endpoint → NEXT_PUBLIC_RPC_URL
```

---

## Part 4: Deployment Platforms

### Option A: Vercel (Recommended)

**Staging Deployment:**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Link project
vercel link

# 4. Add environment variables
vercel env add DATABASE_URL production
# Repeat for all variables from .env.staging

# 5. Deploy to preview (staging)
vercel --prod
# Or set up Git integration for auto-deploy
```

**Environment Variables in Vercel:**
```bash
# Via Dashboard:
# 1. Project Settings → Environment Variables
# 2. Add each variable
# 3. Select environments: Production, Preview, Development

# Via CLI:
vercel env add VARIABLE_NAME production < value.txt
```

**Custom Domain:**
```bash
# 1. Vercel Dashboard → Domains
# 2. Add domain: staging.yourdomain.com
# 3. Configure DNS:
#    - Type: CNAME
#    - Name: staging
#    - Value: cname.vercel-dns.com
# 4. Wait for SSL certificate (automatic)
```

### Option B: Railway

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Create new project
railway init

# 4. Add environment variables
railway variables set DATABASE_URL="postgresql://..."
# Repeat for all variables

# 5. Deploy
railway up

# 6. Add custom domain
railway domain
```

### Option C: Render

```bash
# 1. Visit https://dashboard.render.com
# 2. New → Web Service
# 3. Connect GitHub repository
# 4. Configure:
#    - Name: gvteway-atlvs-staging
#    - Environment: Node
#    - Build Command: npm run build
#    - Start Command: npm start
# 5. Add environment variables in dashboard
# 6. Create service
```

---

## Part 5: Database Migrations

### Run Migrations on Staging

```bash
# 1. Set DATABASE_URL for staging
export DATABASE_URL="postgresql://..."

# 2. Generate Prisma client
npx prisma generate

# 3. Run migrations
npx prisma migrate deploy

# 4. Verify tables created
npx prisma studio
# Or use database GUI to check tables

# 5. (Optional) Seed test data
npm run db:seed
```

### Run Migrations on Production

```bash
# 1. BACKUP FIRST (if database has data)
# Use your database provider's backup tool

# 2. Set DATABASE_URL for production
export DATABASE_URL="postgresql://..."

# 3. Run migrations
npx prisma migrate deploy

# 4. Verify
npx prisma studio

# 5. DO NOT seed production with test data
```

---

## Part 6: NFT Contract Deployment

### Deploy to Testnet (Sepolia)

```bash
# 1. Fund deployer wallet with Sepolia ETH
# Get from: https://sepoliafaucet.com

# 2. Set environment variables
export NEXT_PUBLIC_RPC_URL="https://sepolia.infura.io/v3/YOUR-PROJECT-ID"
export DEPLOYER_PRIVATE_KEY="0x..."

# 3. Deploy contract
npx hardhat run scripts/deploy-nft.ts --network sepolia

# 4. Copy contract address from output
# Deployed TicketNFT to: 0x...

# 5. Update environment variable
export NEXT_PUBLIC_NFT_CONTRACT_ADDRESS="0x..."

# 6. Verify on Etherscan (optional)
npx hardhat verify --network sepolia 0x... "GVTEWAY Tickets" "GVTIX"
```

### Deploy to Mainnet (Production Only)

```bash
# WARNING: Requires real ETH (~0.05-0.1 ETH for gas)

# 1. Fund deployer wallet with mainnet ETH
# 2. Update RPC URL to mainnet
export NEXT_PUBLIC_RPC_URL="https://mainnet.infura.io/v3/YOUR-PROJECT-ID"
export NEXT_PUBLIC_CHAIN_ID="1"

# 3. Deploy
npx hardhat run scripts/deploy-nft.ts --network mainnet

# 4. Verify contract
npx hardhat verify --network mainnet 0x... "GVTEWAY Tickets" "GVTIX"

# 5. Update production environment variables
```

---

## Part 7: Post-Deployment Verification

### Smoke Tests Checklist

```bash
# 1. Health check
curl https://staging.yourdomain.com/api/health
# Expected: {"status": "ok"}

# 2. Database connection
curl https://staging.yourdomain.com/api/health/db
# Expected: {"status": "ok", "connected": true}

# 3. Authentication
# Visit: https://staging.yourdomain.com/gvteway/auth/login
# Try to register and login

# 4. Payment flow (use Stripe test cards)
# Card: 4242 4242 4242 4242
# Visit: https://staging.yourdomain.com/gvteway/events
# Try to purchase a ticket

# 5. File upload
# Visit any form with file upload
# Upload a test file

# 6. Real-time features
# Open two browser windows
# Test WebSocket connection and live updates

# 7. Email delivery
# Trigger password reset
# Check email received

# 8. Error tracking
# Trigger an error
# Check Sentry dashboard for error report

# 9. Analytics
# Navigate around the site
# Check PostHog dashboard for events
```

### Run E2E Tests Against Staging

```bash
# 1. Update Playwright config for staging
# playwright.config.ts
# baseURL: 'https://staging.yourdomain.com'

# 2. Run tests
npm run test:e2e

# 3. Check results
# All tests should pass
```

---

## Part 8: Monitoring & Alerts

### Sentry Alerts

```bash
# 1. Sentry Dashboard → Alerts
# 2. Create alert rules:
#    - Error rate > 1% in 5 minutes
#    - New issue created
#    - Performance degradation
# 3. Configure notifications (email, Slack)
```

### PostHog Monitoring

```bash
# 1. PostHog Dashboard → Insights
# 2. Create dashboards:
#    - User signups
#    - Ticket purchases
#    - Page views
#    - Error rates
# 3. Set up alerts for anomalies
```

### Database Monitoring

```bash
# Supabase:
# Dashboard → Database → Monitoring
# Check: CPU, Memory, Connections

# Set up alerts for:
# - High CPU usage (>80%)
# - Connection pool exhaustion
# - Slow queries
```

### Uptime Monitoring

**Option A: UptimeRobot (Free)**
```bash
# 1. Visit https://uptimerobot.com
# 2. Add monitor:
#    - Type: HTTPS
#    - URL: https://staging.yourdomain.com/api/health
#    - Interval: 5 minutes
# 3. Set up alerts (email, SMS)
```

**Option B: Better Uptime**
```bash
# 1. Visit https://betteruptime.com
# 2. Create monitor
# 3. Configure incident management
```

---

## Part 9: Backup Strategy

### Database Backups

**Automated (Supabase Pro):**
```bash
# Already configured with PITR
# Retention: 7 days
# No action needed
```

**Manual Backup:**
```bash
# 1. Export database
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# 2. Upload to S3 or cloud storage
aws s3 cp backup-*.sql s3://your-backup-bucket/

# 3. Schedule with cron (daily at 2 AM)
0 2 * * * /path/to/backup-script.sh
```

### File Storage Backups

```bash
# Supabase Storage has built-in redundancy
# For additional safety, sync to S3:

# 1. Install Supabase CLI
npm i -g supabase

# 2. Export storage
supabase storage export uploads ./backup/

# 3. Upload to S3
aws s3 sync ./backup/ s3://your-backup-bucket/storage/
```

---

## Part 10: Rollback Procedures

### Application Rollback (Vercel)

```bash
# 1. Vercel Dashboard → Deployments
# 2. Find previous working deployment
# 3. Click "..." → Promote to Production

# Or via CLI:
vercel rollback
```

### Database Rollback

```bash
# 1. Stop application (prevent new writes)
vercel --prod --env DATABASE_URL=""

# 2. Restore from backup
pg_restore -d $DATABASE_URL backup-20251115.sql

# 3. Verify data
npx prisma studio

# 4. Restart application
vercel --prod
```

---

## Part 11: Production Checklist

### Before Going Live

- [ ] All environment variables configured
- [ ] Database migrations run successfully
- [ ] All integrations tested (Stripe, SendGrid, etc.)
- [ ] E2E tests pass on staging
- [ ] Load testing completed
- [ ] Security scan passed
- [ ] SSL certificate active
- [ ] CDN configured
- [ ] Monitoring alerts set up
- [ ] Backup strategy implemented
- [ ] Rollback procedure tested
- [ ] Team trained on deployment process
- [ ] Incident response plan documented
- [ ] Customer support ready

### Launch Day

1. **Final staging validation** (2 hours before)
2. **Database backup** (1 hour before)
3. **Deploy to production** (T-0)
4. **Run smoke tests** (T+5 min)
5. **Monitor for 2 hours** (T+5 min to T+2 hours)
6. **Gradual traffic increase** (if using load balancer)
7. **24-hour monitoring** (first day)

---

## Troubleshooting

### Common Issues

**Database Connection Failed:**
```bash
# Check connection string format
# Ensure IP allowlist includes deployment platform
# Verify SSL mode: ?sslmode=require
```

**Environment Variables Not Loading:**
```bash
# Vercel: Redeploy after adding variables
# Railway: Run `railway up` again
# Check variable names (case-sensitive)
```

**Migration Failed:**
```bash
# Check database permissions
# Ensure DIRECT_URL is set for migrations
# Run: npx prisma migrate resolve --rolled-back "migration-name"
```

**Stripe Webhook Not Working:**
```bash
# Verify webhook URL is correct
# Check webhook secret matches
# Ensure endpoint is publicly accessible
# Check Stripe dashboard → Webhooks → Recent deliveries
```

---

## Estimated Timeline

### Staging Environment (4-6 hours)
- Database setup: 30 min
- Environment variables: 1 hour
- Third-party services: 1.5 hours
- Deployment: 30 min
- Migrations: 15 min
- Verification: 1 hour
- Buffer: 30 min

### Production Environment (6-8 hours)
- Database setup: 1 hour (with backups)
- Environment variables: 1 hour
- Third-party services: 1.5 hours
- Deployment: 1 hour
- Migrations: 30 min
- NFT contract deployment: 1 hour
- Verification: 1.5 hours
- Monitoring setup: 1 hour
- Buffer: 30 min

---

## Next Steps

1. **Start with staging** - Complete all steps for staging first
2. **Test thoroughly** - Run all smoke tests and E2E tests
3. **Document issues** - Keep track of any problems encountered
4. **Repeat for production** - Use staging experience to streamline production setup
5. **Monitor closely** - Watch metrics for first 48 hours after production launch

---

**Need Help?**
- Check deployment logs in your platform dashboard
- Review error messages in Sentry
- Consult platform-specific documentation
- Test each integration individually

**Ready to Deploy?** Follow this guide step-by-step and you'll have both environments configured and operational within 8-16 hours total.
