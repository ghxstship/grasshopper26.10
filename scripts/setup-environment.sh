#!/bin/bash

# Environment Setup Script
# Automates environment configuration for staging/production
# Usage: ./scripts/setup-environment.sh [staging|production]

set -e

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
  echo "Usage: ./scripts/setup-environment.sh [staging|production]"
  exit 1
fi

if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
  echo "Error: Environment must be 'staging' or 'production'"
  exit 1
fi

echo "🚀 Setting up $ENVIRONMENT environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Function to prompt for input
prompt() {
  local var_name=$1
  local prompt_text=$2
  local is_secret=$3
  
  if [ -z "${!var_name}" ]; then
    if [ "$is_secret" = "true" ]; then
      read -sp "$prompt_text: " value
      echo ""
    else
      read -p "$prompt_text: " value
    fi
    eval "$var_name='$value'"
  fi
}

echo "📋 Step 1: Checking prerequisites..."
echo ""

# Check for required tools
MISSING_TOOLS=()

if ! command_exists node; then
  MISSING_TOOLS+=("node")
fi

if ! command_exists npm; then
  MISSING_TOOLS+=("npm")
fi

if ! command_exists git; then
  MISSING_TOOLS+=("git")
fi

if [ ${#MISSING_TOOLS[@]} -gt 0 ]; then
  echo -e "${RED}❌ Missing required tools: ${MISSING_TOOLS[*]}${NC}"
  exit 1
fi

echo -e "${GREEN}✅ All prerequisites installed${NC}"
echo ""

# Check for optional tools
if ! command_exists vercel; then
  echo -e "${YELLOW}⚠️  Vercel CLI not installed. Install with: npm i -g vercel${NC}"
fi

if ! command_exists prisma; then
  echo -e "${YELLOW}⚠️  Prisma CLI not installed. Install with: npm i -g prisma${NC}"
fi

echo ""
echo "🔐 Step 2: Collecting environment variables..."
echo ""

# Create .env file
ENV_FILE=".env.$ENVIRONMENT"

if [ -f "$ENV_FILE" ]; then
  echo -e "${YELLOW}⚠️  $ENV_FILE already exists. Backup will be created.${NC}"
  cp "$ENV_FILE" "$ENV_FILE.backup.$(date +%Y%m%d%H%M%S)"
fi

# Database
echo "--- Database Configuration ---"
prompt DATABASE_URL "Database URL (postgresql://...)" false
prompt DIRECT_URL "Direct URL for migrations (optional, press enter to use DATABASE_URL)" false
if [ -z "$DIRECT_URL" ]; then
  DIRECT_URL="$DATABASE_URL"
fi

# NextAuth
echo ""
echo "--- NextAuth Configuration ---"
if [ "$ENVIRONMENT" = "staging" ]; then
  prompt NEXTAUTH_URL "NextAuth URL (e.g., https://staging.yourdomain.com)" false
else
  prompt NEXTAUTH_URL "NextAuth URL (e.g., https://yourdomain.com)" false
fi

# Generate NEXTAUTH_SECRET if not provided
if [ -z "$NEXTAUTH_SECRET" ]; then
  echo "Generating NEXTAUTH_SECRET..."
  NEXTAUTH_SECRET=$(openssl rand -base64 32)
  echo -e "${GREEN}✅ Generated NEXTAUTH_SECRET${NC}"
fi

# Stripe
echo ""
echo "--- Stripe Configuration ---"
if [ "$ENVIRONMENT" = "staging" ]; then
  echo "Use TEST mode keys (pk_test_ and sk_test_)"
else
  echo "Use LIVE mode keys (pk_live_ and sk_live_)"
fi
prompt NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY "Stripe Publishable Key" false
prompt STRIPE_SECRET_KEY "Stripe Secret Key" true
prompt STRIPE_WEBHOOK_SECRET "Stripe Webhook Secret" true

# SendGrid
echo ""
echo "--- SendGrid Configuration ---"
prompt SENDGRID_API_KEY "SendGrid API Key" true
prompt SENDGRID_FROM_EMAIL "SendGrid From Email" false
SENDGRID_FROM_NAME="GVTEWAY"

# Supabase
echo ""
echo "--- Supabase Configuration ---"
prompt NEXT_PUBLIC_SUPABASE_URL "Supabase URL" false
prompt NEXT_PUBLIC_SUPABASE_ANON_KEY "Supabase Anon Key" false
prompt SUPABASE_SERVICE_ROLE_KEY "Supabase Service Role Key" true

# Firebase
echo ""
echo "--- Firebase Configuration ---"
prompt FIREBASE_PROJECT_ID "Firebase Project ID" false
prompt FIREBASE_CLIENT_EMAIL "Firebase Client Email" false
echo "Firebase Private Key (paste entire key including BEGIN/END lines, then press Ctrl+D):"
FIREBASE_PRIVATE_KEY=$(cat)

# Pinata
echo ""
echo "--- Pinata (IPFS) Configuration ---"
prompt PINATA_API_KEY "Pinata API Key" false
prompt PINATA_SECRET_API_KEY "Pinata Secret API Key" true
prompt PINATA_JWT "Pinata JWT" true

# Web3
echo ""
echo "--- Web3/Blockchain Configuration ---"
if [ "$ENVIRONMENT" = "staging" ]; then
  NEXT_PUBLIC_CHAIN_ID="11155111" # Sepolia
  prompt NEXT_PUBLIC_RPC_URL "RPC URL (e.g., https://sepolia.infura.io/v3/...)" false
else
  NEXT_PUBLIC_CHAIN_ID="1" # Mainnet
  prompt NEXT_PUBLIC_RPC_URL "RPC URL (e.g., https://mainnet.infura.io/v3/...)" false
fi
prompt NEXT_PUBLIC_NFT_CONTRACT_ADDRESS "NFT Contract Address (leave empty if not deployed yet)" false
prompt DEPLOYER_PRIVATE_KEY "Deployer Private Key (for contract deployment)" true

# PostHog
echo ""
echo "--- PostHog Configuration ---"
prompt NEXT_PUBLIC_POSTHOG_KEY "PostHog Project API Key" false
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
prompt POSTHOG_API_KEY "PostHog Personal API Key" true

# Sentry
echo ""
echo "--- Sentry Configuration ---"
prompt NEXT_PUBLIC_SENTRY_DSN "Sentry DSN" false
prompt SENTRY_AUTH_TOKEN "Sentry Auth Token" true
prompt SENTRY_ORG "Sentry Organization" false
prompt SENTRY_PROJECT "Sentry Project" false

# Redis (optional)
echo ""
echo "--- Redis Configuration (Optional) ---"
prompt REDIS_URL "Redis URL (leave empty to skip)" false

# Application
NEXT_PUBLIC_APP_URL="$NEXTAUTH_URL"
NODE_ENV="production"

echo ""
echo "📝 Step 3: Writing environment file..."
echo ""

# Write .env file
cat > "$ENV_FILE" << EOF
# =============================================================================
# ENVIRONMENT: $ENVIRONMENT
# Generated: $(date)
# =============================================================================

# =============================================================================
# DATABASE
# =============================================================================
DATABASE_URL="$DATABASE_URL"
DIRECT_URL="$DIRECT_URL"

# =============================================================================
# NEXTAUTH
# =============================================================================
NEXTAUTH_URL="$NEXTAUTH_URL"
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"

# =============================================================================
# STRIPE
# =============================================================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY"
STRIPE_WEBHOOK_SECRET="$STRIPE_WEBHOOK_SECRET"

# =============================================================================
# SENDGRID
# =============================================================================
SENDGRID_API_KEY="$SENDGRID_API_KEY"
SENDGRID_FROM_EMAIL="$SENDGRID_FROM_EMAIL"
SENDGRID_FROM_NAME="$SENDGRID_FROM_NAME"

# =============================================================================
# SUPABASE STORAGE
# =============================================================================
NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

# =============================================================================
# FIREBASE (Push Notifications)
# =============================================================================
FIREBASE_PROJECT_ID="$FIREBASE_PROJECT_ID"
FIREBASE_CLIENT_EMAIL="$FIREBASE_CLIENT_EMAIL"
FIREBASE_PRIVATE_KEY="$FIREBASE_PRIVATE_KEY"

# =============================================================================
# PINATA (IPFS for NFTs)
# =============================================================================
PINATA_API_KEY="$PINATA_API_KEY"
PINATA_SECRET_API_KEY="$PINATA_SECRET_API_KEY"
PINATA_JWT="$PINATA_JWT"

# =============================================================================
# WEB3 / BLOCKCHAIN
# =============================================================================
NEXT_PUBLIC_CHAIN_ID="$NEXT_PUBLIC_CHAIN_ID"
NEXT_PUBLIC_RPC_URL="$NEXT_PUBLIC_RPC_URL"
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS="$NEXT_PUBLIC_NFT_CONTRACT_ADDRESS"
DEPLOYER_PRIVATE_KEY="$DEPLOYER_PRIVATE_KEY"

# =============================================================================
# POSTHOG (Analytics)
# =============================================================================
NEXT_PUBLIC_POSTHOG_KEY="$NEXT_PUBLIC_POSTHOG_KEY"
NEXT_PUBLIC_POSTHOG_HOST="$NEXT_PUBLIC_POSTHOG_HOST"
POSTHOG_API_KEY="$POSTHOG_API_KEY"

# =============================================================================
# SENTRY (Error Tracking)
# =============================================================================
NEXT_PUBLIC_SENTRY_DSN="$NEXT_PUBLIC_SENTRY_DSN"
SENTRY_AUTH_TOKEN="$SENTRY_AUTH_TOKEN"
SENTRY_ORG="$SENTRY_ORG"
SENTRY_PROJECT="$SENTRY_PROJECT"

# =============================================================================
# REDIS (Caching - Optional)
# =============================================================================
REDIS_URL="$REDIS_URL"

# =============================================================================
# APPLICATION
# =============================================================================
NEXT_PUBLIC_APP_URL="$NEXT_PUBLIC_APP_URL"
NODE_ENV="$NODE_ENV"
EOF

echo -e "${GREEN}✅ Environment file created: $ENV_FILE${NC}"
echo ""

echo "🔒 Step 4: Securing environment file..."
chmod 600 "$ENV_FILE"
echo -e "${GREEN}✅ File permissions set to 600${NC}"
echo ""

echo "📦 Step 5: Installing dependencies..."
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo "🗄️  Step 6: Setting up database..."
echo "Generating Prisma client..."
npx prisma generate
echo -e "${GREEN}✅ Prisma client generated${NC}"
echo ""

read -p "Run database migrations now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Running migrations..."
  export $(cat "$ENV_FILE" | grep DATABASE_URL | xargs)
  npx prisma migrate deploy
  echo -e "${GREEN}✅ Migrations completed${NC}"
else
  echo -e "${YELLOW}⚠️  Skipped migrations. Run manually with: npx prisma migrate deploy${NC}"
fi
echo ""

echo "🏗️  Step 7: Building application..."
read -p "Build application now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  npm run build
  echo -e "${GREEN}✅ Build completed${NC}"
else
  echo -e "${YELLOW}⚠️  Skipped build. Run manually with: npm run build${NC}"
fi
echo ""

echo "✅ Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Review $ENV_FILE and verify all values"
echo "2. Upload environment variables to your deployment platform"
echo "3. Deploy application"
echo "4. Run smoke tests"
echo ""
echo "📚 For detailed instructions, see: docs/guides/ENVIRONMENT_SETUP_GUIDE.md"
echo ""

if [ "$ENVIRONMENT" = "staging" ]; then
  echo "🔗 Deployment commands:"
  echo "  Vercel: vercel --prod"
  echo "  Railway: railway up"
  echo "  Render: git push (if connected)"
fi

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
