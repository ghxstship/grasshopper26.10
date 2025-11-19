#!/bin/bash

# Design System Enforcement Script
# Finds and reports all design system violations

echo "🔍 GHXSTSHIP Design System Enforcement"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

VIOLATIONS=0

# Check 1: Hardcoded font classes
echo "📝 Checking for raw font class violations..."
FONT_VIOLATIONS=$(grep -r "className.*font-\(bebas\|anton\|share\|oswald\)" --include="*.tsx" --include="*.ts" src/app 2>/dev/null | wc -l | tr -d ' ')
if [ "$FONT_VIOLATIONS" -gt 0 ]; then
    echo -e "${RED}❌ Found $FONT_VIOLATIONS raw font class usages${NC}"
    echo "   Use Typography components instead (HeroTitle, SectionHeader, etc.)"
    VIOLATIONS=$((VIOLATIONS + FONT_VIOLATIONS))
else
    echo -e "${GREEN}✅ No raw font classes found${NC}"
fi

# Check 2: Hardcoded text size classes
echo "📏 Checking for raw text size violations..."
TEXT_VIOLATIONS=$(grep -r "className.*text-\(h1\|h2\|h3\|h4\|h5\|h6\|hero\)" --include="*.tsx" --include="*.ts" src/app 2>/dev/null | wc -l | tr -d ' ')
if [ "$TEXT_VIOLATIONS" -gt 0 ]; then
    echo -e "${RED}❌ Found $TEXT_VIOLATIONS raw text size class usages${NC}"
    echo "   Use Typography components instead"
    VIOLATIONS=$((VIOLATIONS + TEXT_VIOLATIONS))
else
    echo -e "${GREEN}✅ No raw text size classes found${NC}"
fi

# Check 3: Inline styles
echo "🎨 Checking for inline styles..."
INLINE_STYLES=$(grep -r "style={{" --include="*.tsx" --include="*.ts" src/app 2>/dev/null | wc -l | tr -d ' ')
if [ "$INLINE_STYLES" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $INLINE_STYLES inline style usages${NC}"
    echo "   Consider using design tokens or component variants"
    VIOLATIONS=$((VIOLATIONS + INLINE_STYLES))
fi

# Check 4: Hardcoded colors
echo "🎨 Checking for hardcoded color values..."
COLOR_VIOLATIONS=$(grep -rE "#[0-9A-Fa-f]{3,6}|rgb\(|rgba\(" --include="*.tsx" --include="*.ts" src/app 2>/dev/null | grep -v "// " | wc -l | tr -d ' ')
if [ "$COLOR_VIOLATIONS" -gt 0 ]; then
    echo -e "${RED}❌ Found $COLOR_VIOLATIONS hardcoded color values${NC}"
    echo "   Use design tokens from @/design-system/tokens"
    VIOLATIONS=$((VIOLATIONS + COLOR_VIOLATIONS))
else
    echo -e "${GREEN}✅ No hardcoded colors found${NC}"
fi

# Check 5: Custom button styling
echo "🔘 Checking for custom button implementations..."
BUTTON_VIOLATIONS=$(grep -r "<button" --include="*.tsx" src/app 2>/dev/null | grep -v "Button" | wc -l | tr -d ' ')
if [ "$BUTTON_VIOLATIONS" -gt 0 ]; then
    echo -e "${RED}❌ Found $BUTTON_VIOLATIONS raw <button> elements${NC}"
    echo "   Use <Button> component with variants"
    VIOLATIONS=$((VIOLATIONS + BUTTON_VIOLATIONS))
else
    echo -e "${GREEN}✅ All buttons use Button component${NC}"
fi

# Check 6: Custom card styling
echo "🃏 Checking for custom card implementations..."
CARD_VIOLATIONS=$(grep -r "className.*bg-gray-900\|bg-grey-900\|border-gray-800" --include="*.tsx" src/app 2>/dev/null | wc -l | tr -d ' ')
if [ "$CARD_VIOLATIONS" -gt 0 ]; then
    echo -e "${RED}❌ Found $CARD_VIOLATIONS custom card styling instances${NC}"
    echo "   Use <Card> component with variant prop"
    VIOLATIONS=$((VIOLATIONS + CARD_VIOLATIONS))
else
    echo -e "${GREEN}✅ All cards use Card component${NC}"
fi

echo ""
echo "======================================"
if [ "$VIOLATIONS" -eq 0 ]; then
    echo -e "${GREEN}✅ Design system fully enforced! No violations found.${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $VIOLATIONS total violations${NC}"
    echo ""
    echo "Run the following to see details:"
    echo "  grep -r \"className.*font-\" --include=\"*.tsx\" src/app"
    echo "  grep -r \"className.*text-h\" --include=\"*.tsx\" src/app"
    echo "  grep -r \"style={{\" --include=\"*.tsx\" src/app"
    exit 1
fi
