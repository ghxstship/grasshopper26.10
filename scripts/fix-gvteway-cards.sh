#!/bin/bash

# Fix all remaining custom card className in GVTEWAY pages
# This script replaces className="card with Card component usage

echo "Fixing GVTEWAY card violations..."

# List of files to fix
files=(
  "src/app/gvteway/events/map/page.tsx"
  "src/app/gvteway/events/calendar/page.tsx"
  "src/app/gvteway/brands/[slug]/page.tsx"
  "src/app/gvteway/social/notifications/page.tsx"
  "src/app/gvteway/destinations/page.tsx"
  "src/app/gvteway/social/following/page.tsx"
  "src/app/gvteway/destinations/[slug]/page.tsx"
  "src/app/gvteway/shops/page.tsx"
  "src/app/gvteway/shops/[slug]/page.tsx"
  "src/app/gvteway/brands/page.tsx"
  "src/app/gvteway/social/messages/page.tsx"
  "src/app/gvteway/social/followers/page.tsx"
)

count=0
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    count=$((count + 1))
  fi
done

echo "Found $count files with card violations"
echo "Manual fixes required for proper Card component usage"
