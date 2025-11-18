#!/bin/bash

# Batch migration script for GVTEWAY pages
# Adds ContentLayout import to pages that already have GvtewayLayout

echo "🚀 Starting GVTEWAY batch migration..."

# Find all GVTEWAY pages with GvtewayLayout but without ContentLayout
PAGES=$(find src/app/gvteway -name "page.tsx" -type f -exec grep -l "GvtewayLayout" {} \; | xargs -I {} bash -c 'grep -q "ContentLayout" {} || echo {}')

COUNT=0
for PAGE in $PAGES; do
  if [ -f "$PAGE" ]; then
    echo "📝 Processing: $PAGE"
    
    # Check if ContentLayout import already exists
    if ! grep -q "ContentLayout" "$PAGE"; then
      # Add ContentLayout import after GvtewayLayout import
      sed -i '' '/GvtewayLayout/a\
import { ContentLayout } from "@/components/templates/ContentLayout";
' "$PAGE"
      
      COUNT=$((COUNT + 1))
      echo "   ✅ Added ContentLayout import"
    fi
  fi
done

echo ""
echo "✅ Batch migration complete!"
echo "📊 Processed $COUNT files"
echo ""
echo "⚠️  Note: Files now have ContentLayout imported."
echo "   Manual wrapping of content still needed for each page."
