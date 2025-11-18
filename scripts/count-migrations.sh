#!/bin/bash

echo "🔍 Atomic Design System Migration Counter"
echo "=========================================="
echo ""

# Count total pages
TOTAL_COMPVSS=$(find src/app/compvss -name "page.tsx" -type f | wc -l | tr -d ' ')
TOTAL_ATLVS=$(find src/app/atlvs -name "page.tsx" -type f | wc -l | tr -d ' ')
TOTAL_GVTEWAY=$(find src/app/gvteway -name "page.tsx" -type f | wc -l | tr -d ' ')
TOTAL_PAGES=$((TOTAL_COMPVSS + TOTAL_ATLVS + TOTAL_GVTEWAY))

# Count migrated pages (those using ContentLayout)
MIGRATED_COMPVSS=$(grep -r "ContentLayout" src/app/compvss --include="page.tsx" -l | wc -l | tr -d ' ')
MIGRATED_ATLVS=$(grep -r "ContentLayout" src/app/atlvs --include="page.tsx" -l | wc -l | tr -d ' ')
MIGRATED_GVTEWAY=$(grep -r "ContentLayout" src/app/gvteway --include="page.tsx" -l | wc -l | tr -d ' ')
MIGRATED_TOTAL=$((MIGRATED_COMPVSS + MIGRATED_ATLVS + MIGRATED_GVTEWAY))

# Calculate percentages
COMPVSS_PCT=$((MIGRATED_COMPVSS * 100 / TOTAL_COMPVSS))
ATLVS_PCT=$((MIGRATED_ATLVS * 100 / TOTAL_ATLVS))
GVTEWAY_PCT=$((MIGRATED_GVTEWAY * 100 / TOTAL_GVTEWAY))
TOTAL_PCT=$((MIGRATED_TOTAL * 100 / TOTAL_PAGES))

echo "📊 COMPVSS: $MIGRATED_COMPVSS/$TOTAL_COMPVSS pages ($COMPVSS_PCT%)"
echo "📊 ATLVS:   $MIGRATED_ATLVS/$TOTAL_ATLVS pages ($ATLVS_PCT%)"
echo "📊 GVTEWAY: $MIGRATED_GVTEWAY/$TOTAL_GVTEWAY pages ($GVTEWAY_PCT%)"
echo ""
echo "🎯 TOTAL:   $MIGRATED_TOTAL/$TOTAL_PAGES pages ($TOTAL_PCT%)"
echo ""

# Count pages still using old pattern
OLD_PATTERN=$(grep -r "min-h-screen bg-black" src/app --include="page.tsx" | wc -l | tr -d ' ')
echo "⚠️  Pages with old pattern: $OLD_PATTERN"
echo ""
