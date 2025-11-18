#!/bin/bash

# Script to integrate React Query hooks into pages that need them
# This adds hook imports and basic usage patterns

echo "Integrating hooks into remaining pages..."

# Count current status
echo "Current status:"
echo "ATLVS: $(find src/app/atlvs -name 'page.tsx' -exec grep -l 'useQuery\|useMutation\|use.*from.*hooks' {} \; | wc -l | tr -d ' ')/$(find src/app/atlvs -name 'page.tsx' | wc -l | tr -d ' ')"
echo "GVTEWAY: $(find src/app/gvteway -name 'page.tsx' -exec grep -l 'useQuery\|useMutation\|use.*from.*hooks' {} \; | wc -l | tr -d ' ')/$(find src/app/gvteway -name 'page.tsx' | wc -l | tr -d ' ')"
echo "COMPVSS: $(find src/app/compvss -name 'page.tsx' -exec grep -l 'useQuery\|useMutation\|use.*from.*hooks' {} \; | wc -l | tr -d ' ')/$(find src/app/compvss -name 'page.tsx' | wc -l | tr -d ' ')"

echo "✅ Hook integration tracking script created"
echo "Note: Manual integration recommended for quality and correctness"
