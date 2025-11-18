#!/bin/bash

echo "🚀 Starting COMPVSS batch migration..."

PAGES=$(find src/app/compvss -name "page.tsx" -type f -exec grep -l "CompvssLayout" {} \; | while read file; do
  if ! grep -q "ContentLayout" "$file"; then
    echo "$file"
  fi
done)

COUNT=0
for PAGE in $PAGES; do
  if [ -f "$PAGE" ]; then
    echo "📝 Processing: $PAGE"
    
    sed -i '' '/CompvssLayout/a\
import { ContentLayout } from "@/components/templates/ContentLayout";
' "$PAGE"
    
    COUNT=$((COUNT + 1))
    echo "   ✅ Added ContentLayout import"
  fi
done

echo ""
echo "✅ COMPVSS batch migration complete!"
echo "📊 Processed $COUNT files"
