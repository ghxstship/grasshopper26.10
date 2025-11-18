#!/bin/bash

# Edge Functions Deployment Script
# Deploys all 13 edge functions to Supabase

set -e

echo "🚀 Deploying Edge Functions to Supabase..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Install with: npm install -g supabase"
    exit 1
fi

# Check if logged in
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase. Run: supabase login"
    exit 1
fi

# List of all edge functions
FUNCTIONS=(
    "analytics-tracker"
    "auth-validator"
    "cache-manager"
    "email-notification"
    "export"
    "geolocation"
    "image-optimizer"
    "push-notification"
    "qr-generator"
    "scheduler"
    "sms-notification"
    "stripe-webhook"
    "web3-validator"
)

echo "📦 Functions to deploy: ${#FUNCTIONS[@]}"
echo ""

# Deploy each function
SUCCESS_COUNT=0
FAIL_COUNT=0

for func in "${FUNCTIONS[@]}"; do
    echo "Deploying $func..."
    if supabase functions deploy "$func" --no-verify-jwt; then
        echo "✅ $func deployed successfully"
        ((SUCCESS_COUNT++))
    else
        echo "❌ $func deployment failed"
        ((FAIL_COUNT++))
    fi
    echo ""
done

echo "================================"
echo "Deployment Summary:"
echo "✅ Successful: $SUCCESS_COUNT"
echo "❌ Failed: $FAIL_COUNT"
echo "================================"

if [ $FAIL_COUNT -eq 0 ]; then
    echo "🎉 All edge functions deployed successfully!"
    exit 0
else
    echo "⚠️  Some deployments failed. Check logs above."
    exit 1
fi
