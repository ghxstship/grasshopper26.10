#!/bin/bash

# Quick Setup Script - Creates .env.staging from template
# Usage: ./scripts/quick-setup.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 Quick Staging Environment Setup"
echo ""

# Check if template exists
if [ ! -f ".env.staging.template" ]; then
  echo "❌ Error: .env.staging.template not found"
  exit 1
fi

# Check if .env.staging already exists
if [ -f ".env.staging" ]; then
  echo -e "${YELLOW}⚠️  .env.staging already exists${NC}"
  read -p "Overwrite? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted"
    exit 0
  fi
  # Backup existing file
  cp .env.staging .env.staging.backup.$(date +%Y%m%d%H%M%S)
  echo "✅ Backup created"
fi

# Copy template
cp .env.staging.template .env.staging

# Generate NEXTAUTH_SECRET
echo "🔐 Generating NEXTAUTH_SECRET..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s|NEXTAUTH_SECRET=\"REPLACE_WITH_GENERATED_SECRET_32_CHARS_MIN\"|NEXTAUTH_SECRET=\"$NEXTAUTH_SECRET\"|" .env.staging
else
  # Linux
  sed -i "s|NEXTAUTH_SECRET=\"REPLACE_WITH_GENERATED_SECRET_32_CHARS_MIN\"|NEXTAUTH_SECRET=\"$NEXTAUTH_SECRET\"|" .env.staging
fi

# Set file permissions
chmod 600 .env.staging

echo ""
echo -e "${GREEN}✅ Created .env.staging with generated secrets${NC}"
echo ""
echo "📝 Next steps:"
echo "1. Open .env.staging and replace placeholder values with real credentials"
echo "2. See docs/guides/STAGING_SETUP_CHECKLIST.md for where to get each credential"
echo "3. Deploy with: vercel --prod (or your platform)"
echo "4. Verify with: ./scripts/verify-deployment.sh staging https://your-url"
echo ""
echo "🔍 Quick check - Replace these placeholders:"
echo "   - DATABASE_URL"
echo "   - All Stripe keys (pk_test_, sk_test_, whsec_)"
echo "   - SENDGRID_API_KEY"
echo "   - All Supabase keys"
echo "   - Firebase credentials"
echo "   - Pinata keys"
echo "   - Infura RPC URL"
echo "   - PostHog keys"
echo "   - Sentry DSN and token"
echo ""
