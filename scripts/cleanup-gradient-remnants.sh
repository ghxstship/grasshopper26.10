#!/bin/bash

# Script to clean up remaining gradient color classes (from-, via-, to-)
# that are orphaned after gradient removal

set -e

echo "🔍 Finding files with orphaned gradient classes..."
FILES=$(grep -rl "from-\|via-\|to-" src/app --include="*.tsx" | grep -v "node_modules")

echo "📝 Processing files..."
echo ""

COUNTER=0

for file in $FILES; do
    # Skip if file contains transform or translate (legitimate uses)
    if grep -q "transform\|translate" "$file"; then
        # Still process but be more careful
        :
    fi
    
    COUNTER=$((COUNTER + 1))
    echo "[$COUNTER] Processing: $file"
    
    # Create backup
    cp "$file" "$file.bak"
    
    # Remove orphaned gradient color classes
    # Pattern: from-color-number (but not transform-related)
    sed -i '' -E 's/ from-[a-z]+-[a-z]+-[0-9]+//g' "$file"
    sed -i '' -E 's/ via-[a-z]+-[a-z]+-[0-9]+//g' "$file"
    sed -i '' -E 's/ to-[a-z]+-[a-z]+-[0-9]+//g' "$file"
    
    # Pattern: from-color-number (single word colors)
    sed -i '' -E 's/ from-[a-z]+-[0-9]+//g' "$file"
    sed -i '' -E 's/ via-[a-z]+-[0-9]+//g' "$file"
    sed -i '' -E 's/ to-[a-z]+-[0-9]+//g' "$file"
    
    # Pattern: hover:from-/hover:via-/hover:to-
    sed -i '' -E 's/ hover:from-[a-z]+-[a-z]+-[0-9]+//g' "$file"
    sed -i '' -E 's/ hover:via-[a-z]+-[a-z]+-[0-9]+//g' "$file"
    sed -i '' -E 's/ hover:to-[a-z]+-[a-z]+-[0-9]+//g' "$file"
    sed -i '' -E 's/ hover:from-[a-z]+-[0-9]+//g' "$file"
    sed -i '' -E 's/ hover:via-[a-z]+-[0-9]+//g' "$file"
    sed -i '' -E 's/ hover:to-[a-z]+-[0-9]+//g' "$file"
    
    # Clean up double spaces that might result
    sed -i '' -E 's/  +/ /g' "$file"
    
    # Check if file was actually modified
    if ! diff -q "$file" "$file.bak" > /dev/null 2>&1; then
        echo "  ✅ Modified"
    else
        echo "  ⏭️  No changes needed"
    fi
    
    # Remove backup
    rm "$file.bak"
done

echo ""
echo "✨ Complete!"
echo ""
echo "🔍 Final verification..."
REMAINING=$(grep -r "from-\|via-\|to-" src/app --include="*.tsx" 2>/dev/null | grep -v "transform" | grep -v "translate" | wc -l | tr -d ' ')
echo "Remaining gradient color classes: $REMAINING"
