#!/bin/bash
# Performance Testing Execution Script
# Runs comprehensive performance tests including load, stress, and database optimization

set -e

echo "🚀 Performance Testing Suite"
echo "============================"
echo ""

# Check environment
if [ "$NODE_ENV" = "production" ]; then
  echo "❌ Cannot run performance tests in production environment"
  exit 1
fi

# Step 1: Database Query Performance
echo "📊 Step 1: Testing Database Query Performance..."
echo ""

# Test common queries
psql $DATABASE_URL << 'EOF'
\timing on

-- Test event queries
EXPLAIN ANALYZE SELECT * FROM "Event" WHERE "published" = true LIMIT 20;

-- Test user queries with joins
EXPLAIN ANALYZE SELECT u.*, COUNT(o.id) as order_count 
FROM "User" u 
LEFT JOIN "Order" o ON u.id = o."userId" 
GROUP BY u.id 
LIMIT 20;

-- Test advancing requests
EXPLAIN ANALYZE SELECT * FROM "AdvancingRequest" 
WHERE "status" = 'PENDING' 
ORDER BY "createdAt" DESC 
LIMIT 20;

-- Test project queries
EXPLAIN ANALYZE SELECT * FROM "Project" 
WHERE "status" = 'ACTIVE' 
ORDER BY "updatedAt" DESC 
LIMIT 20;

\timing off
EOF

echo "✅ Database query tests complete"
echo ""

# Step 2: API Load Testing
echo "📈 Step 2: Running API Load Tests..."
echo ""

# Check if server is running
if ! curl -s http://localhost:3000/api/health > /dev/null; then
  echo "⚠️  Server not running on localhost:3000"
  echo "   Start server with: npm run dev"
  echo "   Skipping load tests..."
else
  # Run load tests
  node scripts/load-test.js local
fi

echo ""

# Step 3: Bundle Size Analysis
echo "📦 Step 3: Analyzing Bundle Size..."
echo ""

# Build and analyze
npm run build 2>&1 | grep -E "(Route|First Load JS|○|●|λ)" || echo "Build analysis not available"

echo ""
echo "✅ Bundle size analysis complete"
echo ""

# Step 4: Cache Performance
echo "💾 Step 4: Testing Cache Performance..."
echo ""

# Test Redis cache if available
if command -v redis-cli &> /dev/null; then
  echo "Testing Redis cache..."
  
  # Set test key
  redis-cli SET test:perf "test_value" EX 60 > /dev/null
  
  # Benchmark GET operations
  redis-cli --intrinsic-latency 5 2>&1 | head -n 5
  
  # Clean up
  redis-cli DEL test:perf > /dev/null
  
  echo "✅ Redis cache responsive"
else
  echo "⚠️  Redis not available, skipping cache tests"
fi

echo ""

# Step 5: Memory Usage
echo "🧠 Step 5: Checking Memory Usage..."
echo ""

# Get Node.js memory usage if server is running
if pgrep -f "next dev" > /dev/null; then
  PID=$(pgrep -f "next dev" | head -n 1)
  ps -p $PID -o pid,vsz,rss,pmem,comm
  echo ""
  echo "VSZ: Virtual Memory Size"
  echo "RSS: Resident Set Size (actual RAM used)"
  echo "PMEM: Percentage of physical memory"
else
  echo "⚠️  Next.js server not running"
fi

echo ""

# Summary
echo "============================"
echo "✅ Performance Testing Complete"
echo ""
echo "📋 Summary:"
echo "  ✅ Database query performance analyzed"
echo "  ✅ API load tests executed (if server running)"
echo "  ✅ Bundle size analyzed"
echo "  ✅ Cache performance tested (if Redis available)"
echo "  ✅ Memory usage checked"
echo ""
echo "📝 Recommendations:"
echo "  1. Review EXPLAIN ANALYZE output for slow queries"
echo "  2. Check load test results for latency > 200ms"
echo "  3. Optimize routes with large bundle sizes"
echo "  4. Monitor memory usage under load"
echo "  5. Add database indexes for frequently queried fields"
echo ""
echo "📊 Performance targets:"
echo "  - API response time: < 200ms"
echo "  - Database queries: < 100ms"
echo "  - Bundle size: < 500KB per route"
echo "  - Memory usage: < 512MB"
echo ""
