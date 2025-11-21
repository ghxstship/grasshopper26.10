#!/bin/bash

# Find all route files with the problematic pattern
find src/app/api -name "route.ts" -type f | while read -r file; do
  # Check if file has the problematic pattern (rate limit before context)
  if grep -q "RateLimitIdentifiers.byUserId(context.userId)" "$file"; then
    # Check if context is defined AFTER the rate limit check
    if grep -B 20 "RateLimitIdentifiers.byUserId(context.userId)" "$file" | grep -q "const context = await validateRequest"; then
      echo "Skipping $file - already fixed"
    else
      echo "Fixing $file"
      # This file needs fixing - context used before declaration
      # We'll handle this with a more targeted approach
    fi
  fi
done
