#!/bin/bash

echo "🚀 Starting ATLVS batch migration..."

PAGES=$(find src/app/atlvs -name "page.tsx" -type f -exec grep -l "AtlvsLayout" {} \; | while read file; do
  if ! grep -q "ContentLayout" "$file"; then
    echo "$file"
  fi
done)

COUNT=0
for PAGE in $PAGES; do
  if [ -f "$PAGE" ]; then
    echo "📝 Processing: $PAGE"
    
    sed -i '' '/AtlvsLayout/a\
import { ContentLayout } from "@/components/templates/ContentLayout";
' "$PAGE"
    
    COUNT=$((COUNT + 1))
    echo "   ✅ Added ContentLayout import"
  fi
done

echo ""
echo "✅ ATLVS batch migration complete!"
echo "📊 Processed $COUNT files"
