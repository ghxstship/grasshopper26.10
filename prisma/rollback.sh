#!/bin/bash
# Prisma Migration Rollback Script
# Usage: ./prisma/rollback.sh [steps]

set -e

STEPS=${1:-1}

echo "🔄 Rolling back $STEPS migration(s)..."

# Get current migration
CURRENT=$(npx prisma migrate status | grep "Applied" | tail -n 1 | awk '{print $1}')

if [ -z "$CURRENT" ]; then
  echo "❌ No migrations to rollback"
  exit 1
fi

echo "📋 Current migration: $CURRENT"

# Confirm rollback
read -p "⚠️  Are you sure you want to rollback? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "❌ Rollback cancelled"
  exit 0
fi

# Backup database
echo "💾 Creating database backup..."
BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
pg_dump $DATABASE_URL > "prisma/backups/$BACKUP_FILE"
echo "✅ Backup created: $BACKUP_FILE"

# Rollback migration
echo "⏪ Rolling back migration..."
npx prisma migrate resolve --rolled-back $CURRENT

echo "✅ Rollback complete"
echo "📝 To restore from backup: psql $DATABASE_URL < prisma/backups/$BACKUP_FILE"
