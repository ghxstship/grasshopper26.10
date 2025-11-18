# Deployment Guide

**Version:** 1.0.0  
**Last Updated:** November 15, 2025

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Deployment](#database-deployment)
4. [Application Deployment](#application-deployment)
5. [Smart Contract Deployment](#smart-contract-deployment)
6. [Post-Deployment](#post-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

### Required Tools

- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Redis 7+
- Docker (optional, for containerized deployment)
- Git
- Vercel CLI (for Vercel deployment)
- Hardhat (for smart contract deployment)

### Required Accounts

- Vercel account (for hosting)
- Supabase account (for database)
- Stripe account (for payments)
- Pinata account (for IPFS)
- SendGrid account (for emails)
- Sentry account (for monitoring)
- PostHog account (for analytics)

---

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/gvteway-atlvs.git
cd gvteway-atlvs
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create `.env.local` file:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"
DIRECT_URL="postgresql://user:password@host:5432/dbname"

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
JWT_SECRET="your-jwt-secret-key"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Web3/NFT
NFT_CONTRACT_ADDRESS="0x..."
PRIVATE_KEY="your-wallet-private-key"
INFURA_API_KEY="your-infura-key"
PINATA_API_KEY="your-pinata-key"
PINATA_SECRET_KEY="your-pinata-secret"

# Email
SENDGRID_API_KEY="SG...."
FROM_EMAIL="noreply@your-domain.com"

# Monitoring
SENTRY_DSN="https://...@sentry.io/..."
NEXT_PUBLIC_SENTRY_DSN="https://...@sentry.io/..."

# Analytics
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"

# Redis
REDIS_URL="redis://localhost:6379"

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="your-service-account@..."
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# App URLs
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_API_URL="https://your-domain.com/api"
```

---

## Database Deployment

### 1. Set Up Supabase Project

1. Create new project at [supabase.com](https://supabase.com)
2. Copy connection string to `DATABASE_URL`
3. Enable Row Level Security (RLS)

### 2. Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

### 3. Create Database Indexes

```bash
# Apply performance indexes
psql $DATABASE_URL < src/lib/db/indexes.sql
```

### 4. Verify Database

```bash
# Check connection
npx prisma db pull

# View data
npx prisma studio
```

---

## Application Deployment

### Option 1: Vercel (Recommended)

#### Initial Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link
```

#### Configure Environment Variables

```bash
# Add all environment variables
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
# ... add all other variables
```

#### Deploy

```bash
# Deploy to production
vercel --prod

# Or use Git integration (automatic)
git push origin main
```

#### Post-Deployment

1. Configure custom domain in Vercel dashboard
2. Set up SSL certificate (automatic with Vercel)
3. Configure redirects if needed

### Option 2: Docker

#### Build Image

```bash
# Build production image
docker build -t gvteway-atlvs:latest .

# Tag for registry
docker tag gvteway-atlvs:latest registry.example.com/gvteway-atlvs:latest

# Push to registry
docker push registry.example.com/gvteway-atlvs:latest
```

#### Run Container

```bash
# Run with environment file
docker run -d \
  --name gvteway-atlvs \
  --env-file .env.production \
  -p 3000:3000 \
  gvteway-atlvs:latest
```

#### Docker Compose

```yaml
version: '3.8'

services:
  app:
    image: gvteway-atlvs:latest
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: gvteway
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

Run with:
```bash
docker-compose up -d
```

### Option 3: Traditional Server

#### Build Application

```bash
# Build for production
npm run build

# Start production server
npm start
```

#### Process Manager (PM2)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "gvteway-atlvs" -- start

# Save PM2 configuration
pm2 save

# Set up auto-restart on reboot
pm2 startup
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Smart Contract Deployment

### 1. Configure Hardhat

Ensure `hardhat.config.ts` has correct network settings.

### 2. Deploy to Testnet (Sepolia)

```bash
# Compile contracts
npx hardhat compile

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy-nft.ts --network sepolia

# Verify on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

### 3. Deploy to Mainnet

```bash
# Deploy to Ethereum mainnet
npx hardhat run scripts/deploy-nft.ts --network mainnet

# Verify on Etherscan
npx hardhat verify --network mainnet <CONTRACT_ADDRESS>
```

### 4. Update Environment Variables

Add contract address to `.env`:

```bash
NFT_CONTRACT_ADDRESS="0x..."
```

### 5. Test Contract

```bash
# Run contract tests
npx hardhat test

# Test on testnet
npx hardhat run scripts/test-contract.ts --network sepolia
```

---

## Post-Deployment

### 1. Health Checks

```bash
# Check API health
curl https://your-domain.com/api/health

# Check database connection
curl https://your-domain.com/api/health/db

# Check Redis connection
curl https://your-domain.com/api/health/redis
```

### 2. Smoke Tests

Run critical user flows:

1. User registration/login
2. Event creation
3. Ticket purchase
4. Advancing request submission
5. Project creation
6. Task assignment

### 3. Configure Monitoring

#### Sentry

```bash
# Initialize Sentry
npx @sentry/wizard@latest -i nextjs
```

#### PostHog

Already configured via environment variables.

### 4. Set Up Alerts

Configure alerts in:
- Sentry (error rates, performance)
- Vercel (deployment failures)
- Supabase (database issues)

### 5. Performance Optimization

```bash
# Analyze bundle size
npm run analyze

# Check Lighthouse scores
npx lighthouse https://your-domain.com --view
```

---

## Monitoring & Maintenance

### Application Monitoring

**Sentry Dashboard:**
- Error tracking
- Performance monitoring
- User feedback

**PostHog Dashboard:**
- User analytics
- Feature flags
- Session recordings

**Vercel Dashboard:**
- Deployment logs
- Function logs
- Analytics

### Database Monitoring

**Supabase Dashboard:**
- Query performance
- Connection pool
- Storage usage

### Logs

```bash
# View Vercel logs
vercel logs

# View Docker logs
docker logs gvteway-atlvs

# View PM2 logs
pm2 logs gvteway-atlvs
```

### Backups

**Database Backups:**

```bash
# Manual backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Automated backups (cron)
0 2 * * * pg_dump $DATABASE_URL > /backups/backup_$(date +\%Y\%m\%d).sql
```

**Supabase** provides automatic daily backups.

### Updates

```bash
# Update dependencies
npm update

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## Rollback Procedures

### Application Rollback

#### Vercel

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback <deployment-url>
```

#### Docker

```bash
# Stop current container
docker stop gvteway-atlvs

# Start previous version
docker run -d \
  --name gvteway-atlvs \
  --env-file .env.production \
  -p 3000:3000 \
  gvteway-atlvs:previous-tag
```

### Database Rollback

```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back <migration-name>

# Restore from backup
psql $DATABASE_URL < backup_20250114.sql
```

### Smart Contract

**Note:** Smart contracts cannot be rolled back once deployed. Deploy new version if needed.

---

## Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

**Database Connection Issues:**
```bash
# Test connection
npx prisma db pull

# Check connection string format
echo $DATABASE_URL
```

**Environment Variable Issues:**
```bash
# Verify all variables are set
vercel env ls

# Pull environment variables
vercel env pull .env.local
```

**Performance Issues:**
```bash
# Check Redis connection
redis-cli ping

# Monitor database queries
# Enable query logging in Supabase dashboard
```

---

## Security Checklist

- [ ] All environment variables secured
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Secrets rotated regularly
- [ ] Database backups automated
- [ ] Monitoring alerts configured
- [ ] Error tracking enabled
- [ ] Access logs reviewed regularly

---

## Support

For deployment issues:
- Email: devops@gvteway-atlvs.com
- Slack: #deployment-support
- Documentation: https://docs.gvteway-atlvs.com

---

**Last Updated:** November 15, 2025  
**Maintained By:** DevOps Team
