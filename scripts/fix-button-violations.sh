#!/bin/bash

# Fix raw button element violations
# Replace <button> with <Button> component

FILES=(
  "src/app/gvteway/auth/register/page.tsx"
  "src/app/gvteway/auth/login/page.tsx"
  "src/app/gvteway/auth/onboarding/page.tsx"
  "src/app/gvteway/brands/page.tsx"
  "src/app/gvteway/marketplace/cart/page.tsx"
  "src/app/gvteway/wishlist/page.tsx"
  "src/app/atlvs/teams/availability/page.tsx"
  "src/app/atlvs/analytics/kpis/page.tsx"
)

echo "🔧 Fixing button violations..."

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  Processing: $file"
    
    # Add Button import if not present
    if ! grep -q "import.*Button.*from.*@/components" "$file"; then
      # Find the last import line and add Button import after it
      sed -i '' '/^import/,/^$/{ /^$/i\
import { Button } from "@/components/atoms/Button";
}' "$file" 2>/dev/null || true
    fi
  fi
done

echo "✅ Button violations fixed"
