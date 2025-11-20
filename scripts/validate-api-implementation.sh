#!/bin/bash

# API Implementation Validation Script
# Checks all API routes for mock data usage

echo "=== API Implementation Validation ==="
echo ""

MOCK_ROUTES=()
TOTAL_ROUTES=0
MOCK_COUNT=0

# Find all route.ts files
while IFS= read -r file; do
  TOTAL_ROUTES=$((TOTAL_ROUTES + 1))
  
  # Check if file contains mock data patterns
  if grep -q "Mock data\|Mock response\|mock data\|MOCK_DATA\|mockData" "$file" 2>/dev/null; then
    MOCK_COUNT=$((MOCK_COUNT + 1))
    RELATIVE_PATH="${file#/Users/julianclarkson/Documents/Grasshopper26.10/}"
    MOCK_ROUTES+=("$RELATIVE_PATH")
    echo "❌ MOCK DATA FOUND: $RELATIVE_PATH"
  fi
done < <(find /Users/julianclarkson/Documents/Grasshopper26.10/src/app/api -name "route.ts" -type f)

echo ""
echo "=== Summary ==="
echo "Total API Routes: $TOTAL_ROUTES"
echo "Routes with Mock Data: $MOCK_COUNT"
echo "Routes with Real DB: $((TOTAL_ROUTES - MOCK_COUNT))"
echo ""

if [ $MOCK_COUNT -gt 0 ]; then
  echo "❌ VALIDATION FAILED: $MOCK_COUNT routes still using mock data"
  echo ""
  echo "Routes requiring implementation:"
  for route in "${MOCK_ROUTES[@]}"; do
    echo "  - $route"
  done
  exit 1
else
  echo "✅ VALIDATION PASSED: All routes using database queries"
  exit 0
fi
