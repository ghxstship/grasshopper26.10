#!/bin/bash

# Script to identify all pages that need refactoring
# This will help us systematically rebuild every page with atomic design system

echo "=== GRASSHOPPER PAGE REFACTORING AUDIT ==="
echo ""

# Count total pages
total_pages=$(find src/app -name "page.tsx" -type f | wc -l)
echo "Total pages: $total_pages"

# Count pages with TODO
todo_pages=$(grep -r "TODO: Implement" src/app --include="page.tsx" | wc -l)
echo "Pages with TODO: $todo_pages"

# Count pages with "UI implementation pending"
pending_pages=$(grep -r "UI implementation pending" src/app --include="page.tsx" | wc -l)
echo "Pages with 'UI implementation pending': $pending_pages"

# Count pages using old typography (raw font classes)
old_typography=$(grep -r "font-bebas\|font-anton\|font-oswald\|text-h1\|text-h2\|text-h3" src/app --include="page.tsx" | wc -l)
echo "Pages with old typography: $old_typography"

# Count pages using proper atomic components
atomic_pages=$(grep -r "import.*from '@/components/atoms" src/app --include="page.tsx" | wc -l)
echo "Pages importing atomic components: $atomic_pages"

echo ""
echo "=== PAGES NEEDING IMMEDIATE REFACTORING ==="
echo ""

# List all pages with "UI implementation pending"
echo "Pages with placeholder implementation:"
grep -r "UI implementation pending" src/app --include="page.tsx" -l | head -50

echo ""
echo "=== REFACTORING COMPLETE ==="
