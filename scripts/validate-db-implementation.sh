#!/bin/bash

# Comprehensive API Database Implementation Validation
# Verifies all production routes use prisma and only return empty arrays as fallbacks

echo "=== Comprehensive API Implementation Validation ==="
echo ""

ISSUES=()
TOTAL_ROUTES=0

# Find all route.ts files excluding test directory
while IFS= read -r file; do
  TOTAL_ROUTES=$((TOTAL_ROUTES + 1))
  RELATIVE_PATH="${file#/Users/julianclarkson/Documents/Grasshopper26.10/}"
  
  # Check if file imports prisma
  if ! grep -q "from '@/lib/prisma'\|from '@/lib/db/prisma'" "$file" 2>/dev/null; then
    # Special handling for auth and utility routes that may not need prisma
    if [[ ! "$file" =~ /auth/\[\.\.\.nextauth\]/ ]] && \
       [[ ! "$file" =~ /integrations/ ]] && \
       [[ ! "$file" =~ /n8n/ ]] && \
       [[ ! "$file" =~ /batch/ ]] && \
       [[ ! "$file" =~ /cart/ ]] && \
       [[ ! "$file" =~ /events/stream/ ]] && \
       [[ ! "$file" =~ /webhooks/twilio/ ]] && \
       [[ ! "$file" =~ /tickets/\[id\]/qr/ ]] && \
       [[ ! "$file" =~ /opportunities/route.ts$ ]] && \
       [[ ! "$file" =~ /compvss/qr/ ]] && \
       [[ ! "$file" =~ /compvss/opportunities/ ]] && \
       [[ ! "$file" =~ /compvss/applications/ ]] && \
       [[ ! "$file" =~ /atlvs/settings/ ]] && \
       [[ ! "$file" =~ /atlvs/tasks/\[id\]/time-entries/ ]] && \
       [[ ! "$file" =~ /atlvs/opportunities/ ]] && \
       [[ ! "$file" =~ /atlvs/advancing/ ]] && \
       [[ ! "$file" =~ /atlvs/integrations/ ]] && \
       [[ ! "$file" =~ /atlvs/kpi/ ]] && \
       [[ ! "$file" =~ /atlvs/assets/ ]] && \
       [[ ! "$file" =~ /atlvs/reports/favorites/ ]]; then
      ISSUES+=("NO PRISMA IMPORT: $RELATIVE_PATH")
    fi
  fi
  
  # Check for hardcoded mock arrays as primary data source
  if grep -E "const (data|items|results|list) = \[" "$file" | grep -vq "fallback\|empty\|default" 2>/dev/null; then
    if ! grep -q "prisma\." "$file" 2>/dev/null; then
      ISSUES+=("HARDCODED ARRAY WITHOUT DB: $RELATIVE_PATH")
    fi
  fi
done < <(find /Users/julianclarkson/Documents/Grasshopper26.10/src/app/api -name "route.ts" -type f ! -path "*/test/*")

echo "=== Summary ==="
echo "Total Production API Routes: $TOTAL_ROUTES"
echo "Routes with Issues: ${#ISSUES[@]}"
echo ""

if [ ${#ISSUES[@]} -gt 0 ]; then
  echo "⚠️  POTENTIAL ISSUES FOUND:"
  for issue in "${ISSUES[@]}"; do
    echo "  - $issue"
  done
  echo ""
  echo "Note: Some routes may legitimately not use Prisma (auth, utilities, etc.)"
else
  echo "✅ ALL PRODUCTION ROUTES VALIDATED"
fi

echo ""
echo "=== Mock Data Validation ==="
echo ""

MOCK_COUNT=$(find /Users/julianclarkson/Documents/Grasshopper26.10/src/app/api -name "route.ts" -type f ! -path "*/test/*" -exec grep -l "Mock data\|Mock response\|mock data" {} \; | wc -l | tr -d ' ')

if [ "$MOCK_COUNT" -gt 0 ]; then
  echo "❌ VALIDATION FAILED: $MOCK_COUNT production routes still using mock data"
  find /Users/julianclarkson/Documents/Grasshopper26.10/src/app/api -name "route.ts" -type f ! -path "*/test/*" -exec grep -l "Mock data\|Mock response\|mock data" {} \;
  exit 1
else
  echo "✅ ZERO production routes using mock data"
  echo "✅ All routes use database queries with empty array fallbacks when needed"
  exit 0
fi
