#!/bin/bash
# Fix all findById calls that pass objects instead of strings
# Most service findById methods only take an id string parameter

cd /Users/julianclarkson/Documents/Grasshopper26.10

# Find all route files with findById calls that pass objects
echo "🔧 Fixing findById calls..."

# Use sed to replace patterns like:
# .findById({ where: { id } }) with .findById(id)
# .findById({ where: { id: someVar } }) with .findById(someVar)

find src/app/api -name "route.ts" -type f -exec sed -i '' \
  -e 's/\.findById({ *where: *{ *id *} *})/\.findById(id)/g' \
  -e 's/\.findById({ *where: *{ *id: *\([a-zA-Z0-9_]*\) *} *})/\.findById(\1)/g' \
  {} \;

echo "✅ Done fixing findById calls"
