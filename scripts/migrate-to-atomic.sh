#!/bin/bash

# Batch migration script for atomic design system
# Migrates pages to use ContentLayout and atomic components

echo "🚀 Starting atomic design system migration..."

# Find all page.tsx files with old patterns
echo "📊 Scanning for pages needing migration..."

# Count pages with old header pattern
OLD_PATTERN_COUNT=$(grep -r "min-h-screen bg-black" src/app --include="page.tsx" | wc -l)
echo "Found $OLD_PATTERN_COUNT pages with old patterns"

# List files that need ContentLayout import
echo "📝 Files needing ContentLayout:"
grep -r "CompvssLayout\|AtlvsLayout\|GvtewayLayout" src/app --include="page.tsx" -l | while read file; do
  if ! grep -q "ContentLayout" "$file"; then
    echo "  - $file"
  fi
done

echo "✅ Migration scan complete"
echo "Run individual migrations using multi_edit tool"
