#!/bin/bash

# Fix Next.js 15 async params issue
# In Next.js 15, route params are now Promise-based

echo "Fixing async params in API routes..."

# Find all route.ts files and fix the params pattern
find src/app/api -name "route.ts" -type f | while read file; do
  # Check if file contains the old pattern
  if grep -q "{ params }: { params: {" "$file"; then
    echo "Fixing: $file"
    # Use sed to replace the pattern (macOS compatible)
    sed -i '' 's/{ params }: { params: {/{ params }: { params: Promise<{/g' "$file"
    # Also need to await params usage
    sed -i '' 's/const { \([^}]*\) } = params;/const { \1 } = await params;/g' "$file"
    sed -i '' 's/params\.\([a-zA-Z_][a-zA-Z0-9_]*\)/\(await params\).\1/g' "$file"
  fi
done

echo "Done!"
