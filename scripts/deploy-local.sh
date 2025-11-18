#!/bin/bash

# GVTEWAY + COMPVSS + ATLVS - Local Deployment Script
# Agent 1: Database & Auth Architect

set -e

echo "🚀 Starting local deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if Supabase is running
echo -e "${BLUE}📊 Step 1: Checking Supabase status...${NC}"
if npx supabase status > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Supabase is running${NC}"
else
    echo -e "${YELLOW}⚠️  Supabase not running, starting...${NC}"
    npx supabase start
fi
echo ""

# Step 2: Get Supabase credentials
echo -e "${BLUE}📊 Step 2: Getting Supabase credentials...${NC}"
SUPABASE_URL=$(npx supabase status | grep "API URL" | awk '{print $3}')
SUPABASE_ANON_KEY=$(npx supabase status | grep "anon key" | awk '{print $3}')
SUPABASE_SERVICE_KEY=$(npx supabase status | grep "service_role key" | awk '{print $3}')
DB_URL=$(npx supabase status | grep "DB URL" | awk '{print $3}')

echo -e "${GREEN}✅ Credentials retrieved${NC}"
echo ""

# Step 3: Update .env.local
echo -e "${BLUE}📊 Step 3: Updating .env.local...${NC}"
cat > .env.local << EOF
# Database (Supabase PostgreSQL - Local)
DATABASE_URL="${DB_URL}"
DIRECT_URL="${DB_URL}"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="${SUPABASE_URL}"
NEXT_PUBLIC_SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY}"
SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_KEY}"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# OAuth Providers
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
BLUESKY_CLIENT_ID="YOUR_BLUESKY_CLIENT_ID"
BLUESKY_CLIENT_SECRET="YOUR_BLUESKY_CLIENT_SECRET"

# Stripe (Add your keys)
STRIPE_SECRET_KEY="sk_test_YOUR_KEY_HERE"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_KEY_HERE"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET_HERE"

# Mapbox (Add your token)
NEXT_PUBLIC_MAPBOX_TOKEN="pk.YOUR_TOKEN_HERE"

# N8N
N8N_URL="http://localhost:5678"
N8N_API_KEY="development-key"

# WalletConnect (Add your project ID)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="YOUR_PROJECT_ID"

# SendGrid (Add your API key)
SENDGRID_API_KEY="SG.YOUR_KEY_HERE"
SENDGRID_FROM_EMAIL="noreply@gvteway.com"

# Twilio (Add your credentials)
TWILIO_ACCOUNT_SID="YOUR_SID_HERE"
TWILIO_AUTH_TOKEN="YOUR_TOKEN_HERE"
TWILIO_PHONE_NUMBER="+1234567890"

# Environment
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
EOF

echo -e "${GREEN}✅ .env.local updated${NC}"
echo ""

# Step 4: Generate Prisma Client
echo -e "${BLUE}📊 Step 4: Generating Prisma Client...${NC}"
npm run db:generate
echo -e "${GREEN}✅ Prisma Client generated${NC}"
echo ""

# Step 5: Push schema to database
echo -e "${BLUE}📊 Step 5: Pushing schema to database...${NC}"
npm run db:push
echo -e "${GREEN}✅ Schema pushed to database${NC}"
echo ""

# Step 6: Seed database
echo -e "${BLUE}📊 Step 6: Seeding database...${NC}"
npm run db:seed
echo -e "${GREEN}✅ Database seeded${NC}"
echo ""

# Step 7: Display credentials
echo -e "${BLUE}📊 Step 7: Deployment Summary${NC}"
echo ""
echo -e "${GREEN}✅ Local deployment complete!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📊 SUPABASE CREDENTIALS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "API URL: ${SUPABASE_URL}"
echo "Anon Key: ${SUPABASE_ANON_KEY}"
echo "Service Key: ${SUPABASE_SERVICE_KEY}"
echo "Database URL: ${DB_URL}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}🔐 TEST CREDENTIALS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Admin:    admin@gvteway.com / admin123"
echo "Consumer: consumer@test.com / test123"
echo "Crew:     crew@test.com / test123"
echo "Manager:  manager@test.com / test123"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}🚀 NEXT STEPS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Start dev server:  npm run dev"
echo "2. Open Prisma Studio: npm run db:studio"
echo "3. View Supabase:     npx supabase status"
echo "4. Stop Supabase:     npx supabase stop"
echo ""
echo -e "${GREEN}Built with GHXSTSHIP precision ⚓️${NC}"
echo ""
