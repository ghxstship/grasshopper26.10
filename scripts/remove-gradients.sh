#!/bin/bash

# Script to remove all gradient classes from TSX files
# Replaces gradient patterns with solid colors

set -e

echo "🔍 Finding files with gradients..."
FILES=$(find src/app -type f -name "*.tsx" -exec grep -l "bg-gradient" {} \;)
TOTAL=$(echo "$FILES" | wc -l | tr -d ' ')

echo "📝 Found $TOTAL files with gradients"
echo ""

COUNTER=0

for file in $FILES; do
    COUNTER=$((COUNTER + 1))
    echo "[$COUNTER/$TOTAL] Processing: $file"
    
    # Create backup
    cp "$file" "$file.bak"
    
    # Remove gradient patterns and replace with solid colors
    # Pattern 1: bg-gradient-to-r from-X via-Y to-Z -> bg-X (use first color)
    sed -i '' -E 's/bg-gradient-to-r from-([a-z]+-[a-z]+-[0-9]+) via-[a-z]+-[a-z]+-[0-9]+ to-[a-z]+-[a-z]+-[0-9]+/bg-\1/g' "$file"
    sed -i '' -E 's/bg-gradient-to-r from-([a-z]+-[0-9]+) via-[a-z]+-[0-9]+ to-[a-z]+-[0-9]+/bg-\1/g' "$file"
    
    # Pattern 2: bg-gradient-to-r from-X to-Y -> bg-X (use first color)
    sed -i '' -E 's/bg-gradient-to-r from-([a-z]+-[a-z]+-[0-9]+) to-[a-z]+-[a-z]+-[0-9]+/bg-\1/g' "$file"
    sed -i '' -E 's/bg-gradient-to-r from-([a-z]+-[0-9]+) to-[a-z]+-[0-9]+/bg-\1/g' "$file"
    
    # Pattern 3: bg-gradient-to-[direction] -> bg-black (fallback)
    sed -i '' -E 's/bg-gradient-to-[a-z]+/bg-black/g' "$file"
    
    # Pattern 4: Clean up any remaining from-/via-/to- classes that are orphaned
    sed -i '' -E 's/ from-[a-z]+-[a-z]+-[0-9]+//g' "$file"
    sed -i '' -E 's/ via-[a-z]+-[a-z]+-[0-9]+//g' "$file"
    sed -i '' -E 's/ to-[a-z]+-[a-z]+-[0-9]+//g' "$file"
    sed -i '' -E 's/ from-[a-z]+-[0-9]+//g' "$file"
    sed -i '' -E 's/ via-[a-z]+-[0-9]+//g' "$file"
    sed -i '' -E 's/ to-[a-z]+-[0-9]+//g' "$file"
    
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
echo "✨ Complete! Processed $TOTAL files"
echo ""
echo "🔍 Verifying removal..."
REMAINING=$(find src/app -type f -name "*.tsx" -exec grep -l "bg-gradient" {} \; 2>/dev/null | wc -l | tr -d ' ')
echo "Remaining files with bg-gradient: $REMAINING"

REMAINING_FROM=$(grep -r "from-" src/app --include="*.tsx" 2>/dev/null | grep -v "transform" | grep -v "translate" | wc -l | tr -d ' ')
echo "Remaining from- classes: $REMAINING_FROM"
