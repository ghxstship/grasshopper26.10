#!/bin/bash

# Fix CardTitle import conflicts
# Remove CardTitle from Card imports when it's also imported from Typography

find src/app -name "*.tsx" -type f | while read file; do
  # Check if file has both imports
  if grep -q "CardTitle.*Typography" "$file" && grep -q "CardTitle.*Card" "$file"; then
    echo "Fixing: $file"
    
    # Remove CardTitle from Card import line
    sed -i '' 's/\(import.*{\)\([^}]*\)CardTitle,\?\([^}]*\)\(}.*Card\)/\1\2\3\4/g' "$file"
    sed -i '' 's/\(import.*{\)\([^}]*\), CardTitle\([^}]*\)\(}.*Card\)/\1\2\3\4/g' "$file"
    
    # Clean up double commas and spaces
    sed -i '' 's/, ,/,/g' "$file"
    sed -i '' 's/{ ,/{ /g' "$file"
    sed -i '' 's/, }/}/g' "$file"
    sed -i '' 's/{  }/{ }/g' "$file"
  fi
done

echo "Done!"
