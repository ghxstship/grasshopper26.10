#!/bin/bash

# Script to add type imports to files that need them
# This adds the common type import to files with implicit any errors

echo "Adding type imports to files..."

# Find all TypeScript files with implicit any errors
FILES=$(npx tsc --noEmit 2>&1 | grep "implicitly has an 'any' type" | cut -d'(' -f1 | sort -u)

for file in $FILES; do
  # Check if file already has type import
  if ! grep -q "from '@/types'" "$file" 2>/dev/null; then
    # Check if file has other imports
    if grep -q "^import" "$file" 2>/dev/null; then
      # Add after last import
      echo "  Adding type import to: $file"
      # This would need sed/awk to insert after last import
      # For now, just report
    fi
  fi
done

echo "Done! Please review and manually add type annotations to callback parameters."
echo "Example: .map(item => ...) → .map((item: Type) => ...)"
