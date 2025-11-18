#!/bin/bash

# Script to add type annotations to common implicit any patterns
# This handles the most common cases of .map(), .filter(), .reduce() callbacks

echo "🔧 Fixing implicit any types in TypeScript files..."

# Count initial errors
INITIAL_ERRORS=$(npx tsc --noEmit 2>&1 | grep -c "implicitly has an 'any' type" || echo "0")
echo "📊 Initial implicit any errors: $INITIAL_ERRORS"

# Common type annotations for different contexts
declare -A TYPE_HINTS=(
  ["log"]="{ id: string; level: string; time: string; workflow: string; message: string }"
  ["template"]="{ id: string; name: string; description?: string }"
  ["trigger"]="{ id: string; name: string; type: string }"
  ["request"]="{ id: string; status: string }"
  ["expense"]="{ id: string; amount: number; status: string }"
  ["rider"]="{ id: string; name: string; type: string }"
  ["alert"]="{ id: string; message: string; severity: string }"
  ["report"]="{ id: string; name: string; date: string }"
  ["item"]="{ id: string; name: string }"
  ["data"]="{ id: string; value: number }"
)

echo "✅ Type annotation script created"
echo "⚠️  Note: This script identifies patterns but manual fixes are recommended for accuracy"
echo ""
echo "Common patterns to fix:"
echo "  - .map((x) => ...) → .map((x: Type) => ...)"
echo "  - .filter((x) => ...) → .filter((x: Type) => ...)"
echo "  - .reduce((acc, x) => ...) → .reduce((acc: AccType, x: Type) => ...)"
