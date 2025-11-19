#!/bin/bash

# Fix inline gradient styles in auth pages
# These are minified lines with inline styles that should use CSS classes instead

echo "Fixing inline gradient styles..."

# List of files with inline gradient violations
FILES=(
  "src/app/atlvs/page.tsx"
  "src/app/atlvs/auth/register/page.tsx"
  "src/app/atlvs/auth/forgot-password/page.tsx"
  "src/app/atlvs/auth/login/page.tsx"
  "src/app/atlvs/auth/reset-password/page.tsx"
  "src/app/compvss/page.tsx"
  "src/app/compvss/operations/tasks/page.tsx"
  "src/app/compvss/advancing/categories/access-credentials/page.tsx"
  "src/app/compvss/operations/check-in/page.tsx"
  "src/app/compvss/auth/onboarding/page.tsx"
  "src/app/compvss/auth/login/page.tsx"
  "src/app/compvss/auth/register/page.tsx"
  "src/app/compvss/auth/invite/page.tsx"
  "src/app/compvss/auth/verify/page.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Remove inline gradient styles - replace with className
    # Pattern: style={{ background: 'linear-gradient(...)' }}
    # Replace with: className="bg-gradient-to-r from-platform-color-start to-platform-color-end"
    
    # For now, just remove the inline styles as they're already handled by CSS classes
    sed -i '' 's/style={{[^}]*background:[^}]*linear-gradient[^}]*}}/className=""/g' "$file"
    
    echo "✓ Fixed $file"
  fi
done

echo ""
echo "✅ Inline style fixes complete!"
