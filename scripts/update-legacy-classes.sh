#!/bin/bash

# Script to automatically update legacy CSS classes
# Run from project root: ./scripts/update-legacy-classes.sh

echo "🔄 Updating legacy CSS classes..."
echo ""

# Update grid-2 classes
echo "Updating .grid-2 classes..."
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) -exec sed -i '' 's/className="grid-2/className="grid grid-cols-1 md:grid-cols-2 gap-8/g' {} +

# Update grid-3 classes
echo "Updating .grid-3 classes..."
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) -exec sed -i '' 's/className="grid-3/className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8/g' {} +

# Update grid-4 classes
echo "Updating .grid-4 classes..."
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) -exec sed -i '' 's/className="grid-4/className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8/g' {} +

# Update grid-5 classes
echo "Updating .grid-5 classes..."
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) -exec sed -i '' 's/className="grid-5/className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8/g' {} +

# Update container-wide classes
echo "Updating .container-wide classes..."
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) -exec sed -i '' 's/className="container-wide/className="max-w-7xl mx-auto px-8/g' {} +

# Update container-standard classes
echo "Updating .container-standard classes..."
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) -exec sed -i '' 's/className="container-standard/className="max-w-6xl mx-auto px-8/g' {} +

echo ""
echo "✅ Legacy class updates complete!"
echo ""
echo "Next steps:"
echo "1. Run: npm run lint"
echo "2. Review changes: git diff"
echo "3. Test the application"
echo "4. Run: ./scripts/find-legacy-css-classes.sh to verify"
