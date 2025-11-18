#!/bin/bash

# Script to replace hard-coded Tailwind colors with semantic design tokens
# Run from project root: bash scripts/replace-colors.sh

echo "Replacing hard-coded colors with semantic design tokens..."

# Define the source directory
SRC_DIR="src/app"

# Replace common semantic color patterns
# Success colors (green)
find "$SRC_DIR" -type f -name "*.tsx" -exec sed -i '' \
  -e 's/bg-green-500\/20 text-green-500 border-green-500\/50/bg-success-light text-success border-success-border/g' \
  -e 's/bg-green-500\/20 text-green-500/bg-success-light text-success/g' \
  -e 's/text-green-500/text-success/g' \
  -e 's/text-green-600/text-success/g' \
  -e 's/text-green-800/text-success-foreground/g' \
  -e 's/bg-green-100/bg-success-light/g' \
  -e 's/bg-green-600/bg-success/g' \
  {} +

# Warning colors (yellow)
find "$SRC_DIR" -type f -name "*.tsx" -exec sed -i '' \
  -e 's/bg-yellow-500\/20 text-yellow-500 border-yellow-500\/50/bg-warning-light text-warning border-warning-border/g' \
  -e 's/bg-yellow-500\/20 text-yellow-500/bg-warning-light text-warning/g' \
  -e 's/text-yellow-500/text-warning/g' \
  -e 's/text-yellow-600/text-warning/g' \
  -e 's/bg-yellow-500/bg-warning/g' \
  {} +

# Error colors (red)
find "$SRC_DIR" -type f -name "*.tsx" -exec sed -i '' \
  -e 's/bg-red-500\/20 text-red-500 border-red-500\/50/bg-error-light text-error border-error-border/g' \
  -e 's/bg-red-500\/20 text-red-500/bg-error-light text-error/g' \
  -e 's/text-red-500/text-error/g' \
  -e 's/text-red-600/text-error/g' \
  -e 's/bg-red-500/bg-error/g' \
  {} +

# Info colors (blue)
find "$SRC_DIR" -type f -name "*.tsx" -exec sed -i '' \
  -e 's/bg-blue-500\/20 text-blue-500 border-blue-500\/50/bg-info-light text-info border-info-border/g' \
  -e 's/bg-blue-500\/20 text-blue-500/bg-info-light text-info/g' \
  -e 's/text-blue-500/text-info/g' \
  -e 's/text-blue-600/text-info/g' \
  -e 's/text-blue-400/text-info/g' \
  -e 's/bg-blue-500/bg-info/g' \
  -e 's/bg-blue-100/bg-info-light/g' \
  {} +

# Orange colors (keep as brand color for ATLVS)
find "$SRC_DIR" -type f -name "*.tsx" -exec sed -i '' \
  -e 's/bg-orange-500\/20 text-orange-500 border-orange-500\/50/bg-atlvs-orange-500\/20 text-atlvs-orange-500 border-atlvs-orange-500\/50/g' \
  -e 's/text-orange-500/text-atlvs-orange-500/g' \
  -e 's/text-orange-600/text-atlvs-orange-500/g' \
  -e 's/text-orange-400/text-atlvs-orange-500/g' \
  {} +

# Purple colors (keep as brand color for ATLVS)
find "$SRC_DIR" -type f -name "*.tsx" -exec sed -i '' \
  -e 's/bg-purple-500\/20 text-purple-500 border-purple-500\/50/bg-atlvs-purple-500\/20 text-atlvs-purple-500 border-atlvs-purple-500\/50/g' \
  -e 's/text-purple-500/text-atlvs-purple-500/g' \
  -e 's/text-purple-600/text-atlvs-purple-500/g' \
  -e 's/text-purple-400/text-atlvs-purple-500/g' \
  {} +

echo "Color replacement complete!"
echo "Please review the changes and test the application."
