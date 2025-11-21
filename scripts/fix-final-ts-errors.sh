#!/bin/bash

# Fix ComingSoonPage imports
find src/app -name "*.tsx" -type f -exec sed -i '' 's/import { ComingSoonPage }/import ComingSoonPage/g' {} \;

# Fix Button variant issues
sed -i '' 's/variant="default"/variant="primary"/g' src/app/\(rebuild\)/social/followers/page.tsx
sed -i '' 's/variant="error"/variant="destructive"/g' src/app/\(rebuild\)/tickets/orders/page.tsx
sed -i '' 's/variant="warning"/variant="secondary"/g' src/app/\(rebuild\)/tickets/orders/page.tsx

# Fix import paths
sed -i '' 's|@/components/atoms/|@/components/ui-rebuild/atoms/|g' src/lib/patterns/PagePatterns.tsx
sed -i '' 's|@/components/organisms/Modal|@/components/ui-rebuild/organisms/Modal|g' src/lib/performance/lazy-loading.tsx
sed -i '' 's|@/components/organisms/CommandPalette|@/components/ui-rebuild/organisms/CommandPalette|g' src/lib/performance/lazy-loading.tsx

echo "Fixed import issues"
