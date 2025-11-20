#!/bin/bash

# Comprehensive script to fix ALL design system violations in GVTEWAY pages
# This applies systematic fixes to achieve 100% compliance

GVTEWAY_DIR="/Users/julianclarkson/Documents/Grasshopper26.10/src/app/gvteway"

echo "=== Fixing ALL GVTEWAY design system violations ==="
echo ""

# Find all pages with violations
PAGES_TO_FIX=$(find "$GVTEWAY_DIR" -name "page.tsx" -not -path "*backup*" -exec grep -l 'className="card\|bg-ghxst-\|text-ghxst-\|section-padding' {} \;)

TOTAL_FILES=$(echo "$PAGES_TO_FIX" | wc -l | tr -d ' ')
echo "Processing $TOTAL_FILES files..."
echo ""

# Process each file
for file in $PAGES_TO_FIX; do
    echo "Fixing: $(basename $(dirname $file))/$(basename $file)"
    
    # Create backup
    cp "$file" "${file}.backup-$(date +%s)"
    
    # Fix common patterns
    # Note: These are safe, systematic replacements
    
    # Replace section-padding with proper padding
    sed -i '' 's/className="section-padding"/className="py-12"/g' "$file"
    sed -i '' 's/className="section-padding bg-ghxst-surface"/className="py-12 bg-grey-50"/g' "$file"
    sed -i '' 's/className="section-padding bg-ghxst-black/className="py-12 bg-black/g' "$file"
    
    # Replace ghxst color classes with proper colors
    sed -i '' 's/bg-ghxst-surface/bg-grey-50/g' "$file"
    sed -i '' 's/bg-ghxst-white/bg-white/g' "$file"
    sed -i '' 's/bg-ghxst-black/bg-black/g' "$file"
    sed -i '' 's/bg-ghxst-border/bg-grey-200/g' "$file"
    sed -i '' 's/bg-ghxst-accent/bg-gvteway-red-500/g' "$file"
    
    sed -i '' 's/text-ghxst-primary/text-black/g' "$file"
    sed -i '' 's/text-ghxst-text-primary/text-black/g' "$file"
    sed -i '' 's/text-ghxst-text-secondary/text-grey-600/g' "$file"
    sed -i '' 's/text-ghxst-white/text-white/g' "$file"
    sed -i '' 's/text-ghxst-black/text-black/g' "$file"
    sed -i '' 's/text-ghxst-accent/text-gvteway-red-500/g' "$file"
    
    sed -i '' 's/border-ghxst-border/border-grey-200/g' "$file"
    sed -i '' 's/border-ghxst-black/border-black/g' "$file"
    sed -i '' 's/border-ghxst-primary/border-gvteway-red-500/g' "$file"
    sed -i '' 's/border-ghxst-accent/border-gvteway-red-500/g' "$file"
    
    sed -i '' 's/hover:border-ghxst-black/hover:border-gvteway-red-500/g' "$file"
    sed -i '' 's/hover:border-ghxst-primary/hover:border-gvteway-red-500/g' "$file"
    sed -i '' 's/hover:text-ghxst-accent/hover:text-gvteway-red-500/g' "$file"
    
    # Fix card class - this needs manual review but we'll mark it
    # sed -i '' 's/className="card /className="NEEDS_CARD_COMPONENT /g' "$file"
    
done

echo ""
echo "=== Fix Complete ==="
echo "Processed $TOTAL_FILES files"
echo ""
echo "Next steps:"
echo "1. Review changes"
echo "2. Replace remaining 'card' className with Card component"
echo "3. Verify all pages use proper Typography components"
echo "4. Test build"
