#!/bin/bash
# Complete migration script for app directory reorganization
# Run this after reviewing the changes

set -e

echo "🚀 Starting complete app directory migration..."
echo ""
echo "⚠️  This script will:"
echo "  1. Move files from (rebuild) to new route groups"
echo "  2. Move utility routes to _lib"
echo "  3. Create necessary configuration files"
echo "  4. Update root page redirect"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Migration cancelled"
    exit 1
fi

# Run the reorganization script
echo "📁 Running directory reorganization..."
bash "$(dirname "$0")/reorganize-app-directory.sh"

# Update root page redirect
echo "🔄 Updating root page redirect..."
cat > "/Users/julianclarkson/Documents/Grasshopper26.10/src/app/page.tsx" << 'EOF'
import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to public landing page
  redirect('/(public)');
}
EOF

# Create index exports for config
echo "📝 Creating config index..."
cat > "/Users/julianclarkson/Documents/Grasshopper26.10/src/app/_config/index.ts" << 'EOF'
/**
 * Centralized Configuration Exports
 */

export * from './metadata';
export * from './routes';
EOF

# Create API utils index
echo "📝 Creating API utils index..."
cat > "/Users/julianclarkson/Documents/Grasshopper26.10/src/app/api/_utils/index.ts" << 'EOF'
/**
 * API Utilities Export
 */

export * from './response';
export * from './validation';
export * from './error';
EOF

echo ""
echo "✅ Migration complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Review moved files and update any broken imports"
echo "  2. Test all routes: npm run dev"
echo "  3. Run type check: npx tsc --noEmit"
echo "  4. Run build: npm run build"
echo "  5. Update any hardcoded route paths to use routes config"
echo ""
echo "📚 Documentation:"
echo "  - App Structure: docs/architecture/APP_DIRECTORY_STRUCTURE.md"
echo "  - API Structure: docs/architecture/API_DIRECTORY_STRUCTURE.md"
echo ""
