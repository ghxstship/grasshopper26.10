#!/bin/bash

# Deployment Verification Script
# Runs smoke tests against deployed environment
# Usage: ./scripts/verify-deployment.sh [staging|production]

set -e

ENVIRONMENT=$1
BASE_URL=$2

if [ -z "$ENVIRONMENT" ]; then
  echo "Usage: ./scripts/verify-deployment.sh [staging|production] [base-url]"
  exit 1
fi

if [ -z "$BASE_URL" ]; then
  echo "Error: Base URL required (e.g., https://staging.yourdomain.com)"
  exit 1
fi

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Verifying $ENVIRONMENT deployment at $BASE_URL"
echo ""

PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
  local name=$1
  local url=$2
  local expected_status=$3
  
  echo -n "Testing $name... "
  
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
  
  if [ "$status" = "$expected_status" ]; then
    echo -e "${GREEN}✅ PASS${NC} (HTTP $status)"
    ((PASSED++))
  else
    echo -e "${RED}❌ FAIL${NC} (Expected $expected_status, got $status)"
    ((FAILED++))
  fi
}

# Function to test JSON endpoint
test_json_endpoint() {
  local name=$1
  local url=$2
  local expected_field=$3
  
  echo -n "Testing $name... "
  
  response=$(curl -s "$url")
  
  if echo "$response" | grep -q "$expected_field"; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
  else
    echo -e "${RED}❌ FAIL${NC} (Expected field: $expected_field)"
    echo "Response: $response"
    ((FAILED++))
  fi
}

echo "📡 API Health Checks"
echo "-------------------"
test_json_endpoint "Health Check" "$BASE_URL/api/health" "status"
test_json_endpoint "Database Health" "$BASE_URL/api/health/db" "connected"
echo ""

echo "🔐 Authentication Endpoints"
echo "---------------------------"
test_endpoint "Login Page" "$BASE_URL/gvteway/auth/login" "200"
test_endpoint "Register Page" "$BASE_URL/gvteway/auth/register" "200"
test_endpoint "Auth API" "$BASE_URL/api/auth/me" "401"
echo ""

echo "🎫 GVTEWAY Endpoints"
echo "--------------------"
test_endpoint "Events Page" "$BASE_URL/gvteway/events" "200"
test_endpoint "Events API" "$BASE_URL/api/events" "200"
test_endpoint "Adventures Page" "$BASE_URL/gvteway/adventures" "200"
test_endpoint "Memberships Page" "$BASE_URL/gvteway/memberships" "200"
echo ""

echo "🏗️ COMPVSS Endpoints"
echo "--------------------"
test_endpoint "Advancing Dashboard" "$BASE_URL/compvss/advancing" "200"
test_endpoint "Advancing API" "$BASE_URL/api/compvss/advancing" "401"
echo ""

echo "📊 ATLVS Endpoints"
echo "------------------"
test_endpoint "Projects Dashboard" "$BASE_URL/atlvs/projects" "200"
test_endpoint "Projects API" "$BASE_URL/api/atlvs/projects" "401"
echo ""

echo "🔍 Search & Upload"
echo "------------------"
test_endpoint "Search API" "$BASE_URL/api/search" "200"
test_endpoint "Upload API" "$BASE_URL/api/upload" "401"
echo ""

echo "💳 Payment Endpoints"
echo "--------------------"
test_endpoint "Checkout API" "$BASE_URL/api/checkout" "405"
echo ""

echo "📊 Results Summary"
echo "=================="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 All tests passed!${NC}"
  echo ""
  echo "✅ Deployment verified successfully"
  exit 0
else
  echo -e "${RED}❌ Some tests failed${NC}"
  echo ""
  echo "⚠️  Please review failed tests and fix issues"
  exit 1
fi
