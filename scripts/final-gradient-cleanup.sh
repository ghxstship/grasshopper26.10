#!/bin/bash

# Final comprehensive gradient cleanup
# Removes all remaining from-/via-/to- references

set -e

echo "🔍 Final gradient cleanup..."

# Get all files with remaining gradient references
FILES=$(grep -rl "from-\|via-\|to-" src/app --include="*.tsx" 2>/dev/null | grep -v "node_modules" || true)

if [ -z "$FILES" ]; then
    echo "✅ No files found with gradient references"
    exit 0
fi

COUNTER=0

for file in $FILES; do
    COUNTER=$((COUNTER + 1))
    echo "[$COUNTER] Processing: $file"
    
    cp "$file" "$file.bak"
    
    # Remove color: 'from-X' patterns (in object properties)
    sed -i '' -E "s/color: 'from-[a-z]+-[a-z]+-[0-9]+'/color: 'bg-black'/g" "$file"
    sed -i '' -E "s/color: 'from-[a-z]+-[0-9]+'/color: 'bg-black'/g" "$file"
    
    # Remove className patterns with orphaned gradient classes
    sed -i '' -E 's/className="([^"]*) from-[a-z]+-[a-z]+-[0-9]+([^"]*)"/className="\1\2"/g' "$file"
    sed -i '' -E 's/className="([^"]*) via-[a-z]+-[a-z]+-[0-9]+([^"]*)"/className="\1\2"/g' "$file"
    sed -i '' -E 's/className="([^"]*) to-[a-z]+-[a-z]+-[0-9]+([^"]*)"/className="\1\2"/g' "$file"
    sed -i '' -E 's/className="([^"]*) from-[a-z]+-[0-9]+([^"]*)"/className="\1\2"/g' "$file"
    sed -i '' -E 's/className="([^"]*) via-[a-z]+-[0-9]+([^"]*)"/className="\1\2"/g' "$file"
    sed -i '' -E 's/className="([^"]*) to-[a-z]+-[0-9]+([^"]*)"/className="\1\2"/g' "$file"
    
    # Remove from template literals
    sed -i '' -E 's/`([^`]*) from-[a-z]+-[a-z]+-[0-9]+([^`]*)`/`\1\2`/g' "$file"
    sed -i '' -E 's/`([^`]*) via-[a-z]+-[a-z]+-[0-9]+([^`]*)`/`\1\2`/g' "$file"
    sed -i '' -E 's/`([^`]*) to-[a-z]+-[a-z]+-[0-9]+([^`]*)`/`\1\2`/g' "$file"
    sed -i '' -E 's/`([^`]*) from-[a-z]+-[0-9]+([^`]*)`/`\1\2`/g' "$file"
    sed -i '' -E 's/`([^`]*) via-[a-z]+-[0-9]+([^`]*)`/`\1\2`/g' "$file"
    sed -i '' -E 's/`([^`]*) to-[a-z]+-[0-9]+([^`]*)`/`\1\2`/g' "$file"
    
    # Clean up double spaces
    sed -i '' -E 's/  +/ /g' "$file"
    sed -i '' -E 's/ "/"/g' "$file"
    sed -i '' -E 's/ `/`/g' "$file"
    
    if ! diff -q "$file" "$file.bak" > /dev/null 2>&1; then
        echo "  ✅ Modified"
    else
        echo "  ⏭️  No changes"
    fi
    
    rm "$file.bak"
done

echo ""
echo "✨ Final cleanup complete!"
echo ""
echo "🔍 Verification..."
REMAINING=$(grep -r "from-\|via-\|to-" src/app --include="*.tsx" 2>/dev/null | grep -v "transform" | grep -v "translate" | grep -v "from-start" | grep -v "to-end" | wc -l | tr -d ' ')
echo "Remaining gradient references: $REMAINING"

if [ "$REMAINING" -eq 0 ]; then
    echo "✅ 100% gradient removal achieved!"
else
    echo "⚠️  Manual review needed for remaining $REMAINING references"
    echo ""
    echo "Remaining files:"
    grep -rl "from-\|via-\|to-" src/app --include="*.tsx" 2>/dev/null | grep -v "node_modules" | head -10
fi
