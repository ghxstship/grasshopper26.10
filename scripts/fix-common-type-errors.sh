#!/bin/bash

# Fix Common TypeScript Errors
# This script fixes the most common patterns causing type errors

echo "Fixing common TypeScript errors..."

# Fix 1: uploadedAt -> uploadedDate
echo "Fixing uploadedAt -> uploadedDate..."
find src/app -name "*.tsx" -type f -exec sed -i '' 's/\.uploadedAt/.uploadedDate/g' {} \;
find src/app -name "*.tsx" -type f -exec sed -i '' 's/{uploadedAt}/{uploadedDate}/g' {} \;

# Fix 2: lastModified -> updatedAt  
echo "Fixing lastModified -> updatedAt..."
find src/app -name "*.tsx" -type f -exec sed -i '' 's/\.lastModified/.updatedAt/g' {} \;

# Fix 3: Add type annotations to common map patterns
echo "Adding type annotations to map callbacks..."
# This is complex and needs manual review, so we'll just report

# Fix 4: Remove unused imports
echo "Note: Run 'npx eslint --fix' to remove unused imports"

echo "Done! Please review changes and run 'npx tsc --noEmit' to check remaining errors."
