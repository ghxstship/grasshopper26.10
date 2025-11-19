#!/bin/bash

# Comprehensive Typography Fix
# This script will find and report ALL remaining raw typography issues

echo "🔍 Scanning for remaining typography issues..."
echo ""

echo "📊 Font Classes:"
echo "  font-anton: $(grep -r 'font-anton' src/app --include="*.tsx" | wc -l | tr -d ' ')"
echo "  font-bebas: $(grep -r 'font-bebas' src/app --include="*.tsx" | wc -l | tr -d ' ')"
echo "  font-oswald: $(grep -r 'font-oswald' src/app --include="*.tsx" | wc -l | tr -d ' ')"
echo "  font-share-tech: $(grep -r 'font-share-tech[^-]' src/app --include="*.tsx" | wc -l | tr -d ' ')"
echo ""

echo "📊 Text Size Classes:"
echo "  text-hero: $(grep -r 'text-hero' src/app --include="*.tsx" | wc -l | tr -d ' ')"
echo "  text-display: $(grep -r 'text-display' src/app --include="*.tsx" | wc -l | tr -d ' ')"
echo "  text-h1: $(grep -r 'text-h1[^0-9]' src/app --include="*.tsx" | wc -l | tr -d ' ')"
echo "  text-h2: $(grep -r 'text-h2' src/app --include="*.tsx" | wc -l | tr -d ' ')"
echo "  text-h3: $(grep -r 'text-h3' src/app --include="*.tsx" | wc -l | tr -d ' ')"
echo "  text-h4: $(grep -r 'text-h4' src/app --include="*.tsx" | wc -l | tr -d ' ')"
echo "  text-h5: $(grep -r 'text-h5' src/app --include="*.tsx" | wc -l | tr -d ' ')"
echo "  text-h6: $(grep -r 'text-h6' src/app --include="*.tsx" | wc -l | tr -d ' ')"
echo ""

echo "📁 Top 20 files with most issues:"
grep -r 'font-bebas\|font-anton\|font-oswald\|text-h[1-6]\|text-hero\|text-display' src/app --include="*.tsx" | \
  cut -d: -f1 | sort | uniq -c | sort -rn | head -20

echo ""
echo "✅ Scan complete"
