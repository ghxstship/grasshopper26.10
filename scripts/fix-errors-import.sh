#!/bin/bash

# Find all files that use errors but don't import it
for file in $(find src/app/api -name "*.ts" -type f); do
  # Check if file uses errors and doesn't have the import
  if grep -q "throw errors\." "$file" && ! grep -q "import.*errors.*from.*@/lib/api/errors" "$file"; then
    echo "Fixing: $file"
    
    # Find the last import line
    last_import=$(grep -n "^import" "$file" | tail -1 | cut -d: -f1)
    
    if [ -n "$last_import" ]; then
      # Add the import after the last import
      sed -i '' "${last_import}a\\
import { errors } from '@/lib/api/errors';
" "$file"
    else
      # No imports found, add at the beginning after any comments
      first_code=$(grep -n "^[^/\*]" "$file" | head -1 | cut -d: -f1)
      if [ -n "$first_code" ]; then
        sed -i '' "${first_code}i\\
import { errors } from '@/lib/api/errors';\\

" "$file"
      fi
    fi
  fi
done

echo "Done!"
