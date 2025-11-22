#!/bin/bash

# Script to push Prisma schema to Supabase
# Retries until database is ready

echo "🔄 Pushing schema to Supabase (zoedfjbsohtrhydxsnpv)..."
echo ""

# Database connection string
DB_URL="postgresql://postgres.zoedfjbsohtrhydxsnpv:CelebritySummit20\$1@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Set max retries
MAX_RETRIES=10
RETRY_COUNT=0
WAIT_TIME=30

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  echo "Attempt $((RETRY_COUNT + 1)) of $MAX_RETRIES..."
  
  # Try to push schema
  DATABASE_URL="$DB_URL" DIRECT_URL="$DB_URL" npx prisma db push --skip-generate --accept-data-loss
  
  # Check if successful
  if [ $? -eq 0 ]; then
    echo "✅ Schema pushed successfully!"
    exit 0
  fi
  
  # Increment counter
  RETRY_COUNT=$((RETRY_COUNT + 1))
  
  # Wait before retry
  if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
    echo "⏳ Waiting ${WAIT_TIME} seconds before retry..."
    sleep $WAIT_TIME
  fi
done

echo "❌ Failed to push schema after $MAX_RETRIES attempts"
echo "The database may need more time to initialize"
echo "Check status at: https://supabase.com/dashboard/project/zoedfjbsohtrhydxsnpv"
exit 1
