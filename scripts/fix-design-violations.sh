#!/bin/bash

# Atomic Design System Violation Fix Script
# Systematically fixes common design system violations across the codebase

set -e

echo "🔍 Starting Atomic Design System Violation Fixes..."
echo ""

# Color mapping for semantic tokens
declare -A COLOR_MAP=(
  ["text-gray-300"]="text-ghxst-text-secondary"
  ["text-gray-400"]="text-ghxst-text-secondary"
  ["text-gray-500"]="text-ghxst-text-secondary"
  ["text-gray-600"]="text-ghxst-text-secondary"
  ["text-gray-700"]="text-ghxst-text-primary"
  ["text-gray-800"]="text-ghxst-text-primary"
  ["text-gray-900"]="text-ghxst-text-primary"
  ["text-white"]="text-ghxst-text-inverse"
  ["text-black"]="text-ghxst-text-primary"
)

# Count violations before
echo "📊 Counting violations before fixes..."
BEFORE_TEXT=$(grep -r "className=\"text-gray" src/app --include="*.tsx" | wc -l | tr -d ' ')
BEFORE_BG=$(grep -r "className=\"bg-gray" src/app --include="*.tsx" | wc -l | tr -d ' ')

echo "  - text-gray violations: $BEFORE_TEXT"
echo "  - bg-gray violations: $BEFORE_BG"
echo ""

# Fix 1: Replace text-gray-* with semantic tokens
echo "🔧 Fix 1: Replacing text-gray-* with semantic tokens..."
for old_class in "${!COLOR_MAP[@]}"; do
  new_class="${COLOR_MAP[$old_class]}"
  find src/app -type f -name "*.tsx" -exec sed -i.bak "s/$old_class/$new_class/g" {} \;
done

# Fix 2: Remove bg-gray-* from Card components (they should use variants)
echo "🔧 Fix 2: Removing bg-gray-* overrides from Card components..."
find src/app -type f -name "*.tsx" -exec sed -i.bak 's/className="bg-gray-[0-9]*\/[0-9]* /className="/g' {} \;
find src/app -type f -name "*.tsx" -exec sed -i.bak 's/className="bg-gray-[0-9]* /className="/g' {} \;

# Fix 3: Replace Card variant="default" with platform-specific variants
echo "🔧 Fix 3: Updating Card variants..."
# This requires context awareness, so we'll flag these for manual review
grep -r 'Card variant="default"' src/app --include="*.tsx" -l > /tmp/cards-to-review.txt || true

# Clean up backup files
echo "🧹 Cleaning up backup files..."
find src/app -name "*.bak" -delete

# Count violations after
echo ""
echo "📊 Counting violations after fixes..."
AFTER_TEXT=$(grep -r "className=\"text-gray" src/app --include="*.tsx" | wc -l | tr -d ' ')
AFTER_BG=$(grep -r "className=\"bg-gray" src/app --include="*.tsx" | wc -l | tr -d ' ')

echo "  - text-gray violations: $AFTER_TEXT (was $BEFORE_TEXT)"
echo "  - bg-gray violations: $AFTER_BG (was $BEFORE_BG)"
echo ""

# Summary
TEXT_FIXED=$((BEFORE_TEXT - AFTER_TEXT))
BG_FIXED=$((BEFORE_BG - AFTER_BG))

echo "✅ Fixed $TEXT_FIXED text-gray violations"
echo "✅ Fixed $BG_FIXED bg-gray violations"
echo ""

if [ -s /tmp/cards-to-review.txt ]; then
  CARD_COUNT=$(wc -l < /tmp/cards-to-review.txt | tr -d ' ')
  echo "⚠️  $CARD_COUNT files with Card variant=\"default\" need manual review"
  echo "   See: /tmp/cards-to-review.txt"
fi

echo ""
echo "🎉 Automated fixes complete!"
echo "   Next steps: Manual review of remaining violations"
