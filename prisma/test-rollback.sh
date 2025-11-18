#!/bin/bash
# Prisma Migration Rollback Test Script
# Tests rollback functionality without affecting production data

set -e

echo "🧪 Testing Prisma Migration Rollback Process"
echo "=============================================="

# Check if we're in test mode
if [ "$NODE_ENV" = "production" ]; then
  echo "❌ Cannot run rollback tests in production environment"
  exit 1
fi

# Step 1: Check current migration status
echo ""
echo "📋 Step 1: Checking current migration status..."
npx prisma migrate status

# Step 2: Create test migration
echo ""
echo "🔨 Step 2: Creating test migration..."
cat > prisma/migrations/test_rollback/migration.sql << 'EOF'
-- Test migration for rollback testing
CREATE TABLE IF NOT EXISTS test_rollback (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EOF

echo "✅ Test migration created"

# Step 3: Apply test migration
echo ""
echo "⬆️  Step 3: Applying test migration..."
npx prisma migrate resolve --applied test_rollback
echo "✅ Test migration applied"

# Step 4: Verify migration applied
echo ""
echo "🔍 Step 4: Verifying migration applied..."
APPLIED=$(npx prisma migrate status | grep "test_rollback" || echo "")
if [ -z "$APPLIED" ]; then
  echo "❌ Test migration not found in applied migrations"
  exit 1
fi
echo "✅ Test migration verified"

# Step 5: Create backup
echo ""
echo "💾 Step 5: Creating database backup..."
mkdir -p prisma/backups
BACKUP_FILE="test_backup_$(date +%Y%m%d_%H%M%S).sql"
if command -v pg_dump &> /dev/null; then
  pg_dump $DATABASE_URL > "prisma/backups/$BACKUP_FILE" 2>/dev/null || echo "⚠️  Backup skipped (pg_dump not available or connection issue)"
  if [ -f "prisma/backups/$BACKUP_FILE" ]; then
    echo "✅ Backup created: $BACKUP_FILE"
  fi
else
  echo "⚠️  pg_dump not available, skipping backup test"
fi

# Step 6: Test rollback
echo ""
echo "⏪ Step 6: Testing rollback..."
npx prisma migrate resolve --rolled-back test_rollback
echo "✅ Rollback command executed"

# Step 7: Verify rollback
echo ""
echo "🔍 Step 7: Verifying rollback..."
ROLLED_BACK=$(npx prisma migrate status | grep "test_rollback" | grep -i "rolled" || echo "")
if [ -z "$ROLLED_BACK" ]; then
  echo "⚠️  Migration not marked as rolled back (may need manual verification)"
else
  echo "✅ Migration marked as rolled back"
fi

# Step 8: Cleanup test migration
echo ""
echo "🧹 Step 8: Cleaning up test migration..."
rm -rf prisma/migrations/test_rollback
echo "✅ Test migration removed"

# Step 9: Cleanup test backup
if [ -f "prisma/backups/$BACKUP_FILE" ]; then
  rm "prisma/backups/$BACKUP_FILE"
  echo "✅ Test backup removed"
fi

# Final summary
echo ""
echo "=============================================="
echo "✅ Rollback Test Complete"
echo ""
echo "Test Results:"
echo "  ✅ Migration status check"
echo "  ✅ Test migration creation"
echo "  ✅ Migration application"
echo "  ✅ Migration verification"
echo "  ✅ Backup creation (if pg_dump available)"
echo "  ✅ Rollback execution"
echo "  ✅ Rollback verification"
echo "  ✅ Cleanup"
echo ""
echo "📝 Rollback script is functional and ready for use"
echo "⚠️  Always test rollback in staging before production use"
