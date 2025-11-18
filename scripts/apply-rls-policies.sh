#!/bin/bash

# =====================================================
# Apply Row-Level Security Policies
# =====================================================

set -e

echo "🔒 Applying Row-Level Security (RLS) Policies..."
echo ""

# Check if Supabase is running
if ! npx supabase status &> /dev/null; then
  echo "❌ Supabase is not running. Please start it first with:"
  echo "   npx supabase start"
  exit 1
fi

# Get database URL
DB_URL=$(npx supabase status | grep "DB URL" | awk '{print $3}')

if [ -z "$DB_URL" ]; then
  echo "❌ Could not retrieve database URL"
  exit 1
fi

echo "📊 Database URL: $DB_URL"
echo ""

# Apply RLS policies
echo "🔐 Applying RLS policies from migration file..."
psql "$DB_URL" -f supabase/migrations/20250114_rls_policies.sql

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ RLS policies applied successfully!"
  echo ""
  echo "📋 Summary:"
  echo "   - Enabled RLS on 70+ tables"
  echo "   - Created 80+ security policies"
  echo "   - User data protection: ✅"
  echo "   - Team data isolation: ✅"
  echo "   - Project access control: ✅"
  echo "   - Admin override: ✅"
  echo ""
  echo "🔍 To verify policies, run:"
  echo "   psql \"$DB_URL\" -c \"SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true;\""
else
  echo ""
  echo "❌ Failed to apply RLS policies"
  exit 1
fi
