#!/bin/bash

# Script to find legacy CSS class usage after optimization
# Run from project root: ./scripts/find-legacy-css-classes.sh

echo "🔍 Searching for legacy CSS classes..."
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Legacy Grid Classes (.grid-2, .grid-3, .grid-4, .grid-5)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
grep -rn 'className="grid-[2-5]' src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" || echo "✅ None found"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🃏 Legacy Card Classes (.card, .card-dark)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
grep -rn 'className="card-dark' src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" || echo "✅ None found"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Legacy Container Classes (.container-wide, .container-standard)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
grep -rn 'container-wide\|container-standard' src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" || echo "✅ None found"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔤 Legacy Monospace Classes (.mono, .metadata, .caption)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
grep -rn 'className="mono\|className="metadata\|className="caption' src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" || echo "✅ None found"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔘 Legacy Button Classes (.btn, .btn-primary, .btn-secondary, .btn-accent)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
grep -rn 'className="btn' src/ --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" || echo "✅ None found"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "See docs/guides/CSS_OPTIMIZATION_MIGRATION.md for migration instructions"
