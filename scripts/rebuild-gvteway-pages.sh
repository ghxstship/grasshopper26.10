#!/bin/bash

# Script to systematically rebuild all GVTEWAY pages with proper atomic design system components
# This script identifies pages with design violations and tracks progress

GVTEWAY_DIR="/Users/julianclarkson/Documents/Grasshopper26.10/src/app/gvteway"
TOTAL_PAGES=0
FIXED_PAGES=0
REMAINING_PAGES=0

echo "=== GVTEWAY Page Rebuild Progress ==="
echo ""

# Count total pages
TOTAL_PAGES=$(find "$GVTEWAY_DIR" -name "page.tsx" -not -path "*backup*" | wc -l | tr -d ' ')
echo "Total pages: $TOTAL_PAGES"

# Count pages with violations (custom card class or ghxst classes)
VIOLATION_PAGES=$(find "$GVTEWAY_DIR" -name "page.tsx" -not -path "*backup*" -exec grep -l 'className="card\|bg-ghxst-\|text-ghxst-\|section-padding' {} \; | wc -l | tr -d ' ')
echo "Pages with violations: $VIOLATION_PAGES"

# Calculate fixed pages
FIXED_PAGES=$((TOTAL_PAGES - VIOLATION_PAGES))
echo "Pages already fixed: $FIXED_PAGES"

# Calculate percentage
PERCENTAGE=$((FIXED_PAGES * 100 / TOTAL_PAGES))
echo "Progress: $PERCENTAGE%"

echo ""
echo "=== Pages still needing fixes ==="
find "$GVTEWAY_DIR" -name "page.tsx" -not -path "*backup*" -exec grep -l 'className="card\|bg-ghxst-\|text-ghxst-\|section-padding' {} \; | sed "s|$GVTEWAY_DIR/||"

echo ""
echo "=== Rebuild complete when all pages use: ==="
echo "- Card with variant='gvteway'"
echo "- Typography components (PageTitle, SectionHeader, BodyText, etc.)"
echo "- Button with gvteway variants"
echo "- NO custom card, section-padding, bg-ghxst-*, text-ghxst-* classes"
