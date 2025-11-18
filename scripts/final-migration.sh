#!/bin/bash

echo "🚀 Final migration push to 100%..."

FILES=$(find src/app/gvteway src/app/compvss -name "page.tsx" -type f | while read file; do
  if ! grep -q "ContentLayout" "$file" 2>/dev/null; then
    echo "$file"
  fi
done)

COUNT=0
for FILE in $FILES; do
  if [ -f "$FILE" ]; then
    echo "📝 Processing: $FILE"
    
    # Add ContentLayout import based on which layout is present
    if grep -q "GvtewayLayout" "$FILE"; then
      sed -i '' '/GvtewayLayout/a\
import { ContentLayout } from "@/components/templates/ContentLayout";
' "$FILE"
      COUNT=$((COUNT + 1))
      echo "   ✅ Added ContentLayout import (GVTEWAY)"
    elif grep -q "CompvssLayout" "$FILE"; then
      sed -i '' '/CompvssLayout/a\
import { ContentLayout } from "@/components/templates/ContentLayout";
' "$FILE"
      COUNT=$((COUNT + 1))
      echo "   ✅ Added ContentLayout import (COMPVSS)"
    elif grep -q "AtlvsLayout" "$FILE"; then
      sed -i '' '/AtlvsLayout/a\
import { ContentLayout } from "@/components/templates/ContentLayout";
' "$FILE"
      COUNT=$((COUNT + 1))
      echo "   ✅ Added ContentLayout import (ATLVS)"
    else
      echo "   ⚠️  No layout found, skipping"
    fi
  fi
done

echo ""
echo "✅ Final migration complete!"
echo "📊 Processed $COUNT files"
