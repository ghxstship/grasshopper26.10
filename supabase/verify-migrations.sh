#!/bin/bash

# Migration Verification Script
# Verifies all migrations are present and in correct order

echo "🔍 Verifying Supabase Migrations..."
echo ""

MIGRATIONS_DIR="supabase/migrations"
EXPECTED_MIGRATIONS=(
  "001_base_schema.sql"
  "002_storage_buckets.sql"
  "003_rls_policies.sql"
  "004_rls_fixes.sql"
  "005_performance_indexes.sql"
  "006_database_functions.sql"
  "007_realtime_publications.sql"
  "008_full_text_search.sql"
  "009_auth_helpers.sql"
  "010_postgres_extensions.sql"
  "011_advanced_indexes.sql"
  "012_materialized_views.sql"
  "013_webhook_queue.sql"
  "014_notification_queue.sql"
  "015_audit_compliance.sql"
  "016_geospatial_features.sql"
  "017_advanced_analytics.sql"
  "018_table_partitioning.sql"
  "019_caching_layer.sql"
  "020_backup_recovery.sql"
  "021_kpi_metrics_core.sql"
  "022_kpi_metrics_financial.sql"
  "023_kpi_metrics_extended.sql"
  "024_report_presets.sql"
  "025_report_presets_continued.sql"
)

MISSING=0
PRESENT=0

for migration in "${EXPECTED_MIGRATIONS[@]}"; do
  if [ -f "$MIGRATIONS_DIR/$migration" ]; then
    echo "✅ $migration"
    PRESENT=$((PRESENT + 1))
  else
    echo "❌ $migration - MISSING"
    MISSING=$((MISSING + 1))
  fi
done

echo ""
echo "📊 Summary:"
echo "  Present: $PRESENT"
echo "  Missing: $MISSING"
echo "  Total Expected: ${#EXPECTED_MIGRATIONS[@]}"

if [ $MISSING -eq 0 ]; then
  echo ""
  echo "✅ All migrations present and accounted for!"
  echo ""
  echo "📋 Migration Details:"
  ls -lh $MIGRATIONS_DIR/*.sql | awk '{print "  " $9 " (" $5 ")"}'
  exit 0
else
  echo ""
  echo "❌ Some migrations are missing. Please create them."
  exit 1
fi
