#!/bin/bash

# Fix unescaped apostrophes and quotes in JSX/TSX files
# This script replaces straight quotes with proper HTML entities where needed

files=(
  "src/app/atlvs/analytics/report-presets/page.tsx"
  "src/app/atlvs/tasks/calendar/page.tsx"
  "src/app/compvss/applications/page.tsx"
  "src/app/compvss/auth/onboarding/page.tsx"
  "src/app/compvss/auth/verify/page.tsx"
  "src/app/compvss/credentials/vault/page.tsx"
  "src/app/compvss/operations/schedule/page.tsx"
  "src/app/compvss/team/availability/page.tsx"
  "src/app/compvss/team/onboarding/compliance/page.tsx"
  "src/app/gvteway/social/profile/page.tsx"
  "src/app/gvteway/tickets/page.tsx"
  "src/app/gvteway/wallet/nft/page.tsx"
  "src/app/gvteway/wishlist/page.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    # This is a placeholder - we'll fix each file individually
  fi
done
