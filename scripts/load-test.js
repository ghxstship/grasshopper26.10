/**
 * Load Testing Script
 * Tests API endpoints under load using autocannon
 * 
 * Usage: node scripts/load-test.js [environment]
 * Example: node scripts/load-test.js staging
 */
/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

const autocannon = require('autocannon');

const environment = process.argv[2] || 'local';

const baseUrls = {
  local: 'http://localhost:3000',
  staging: 'https://staging.gvteway-atlvs.com',
  production: 'https://gvteway-atlvs.com'
};

const baseUrl = baseUrls[environment];

if (!baseUrl) {
  console.error('Invalid environment. Use: local, staging, or production');
  process.exit(1);
}

console.log(`🔥 Starting load tests against: ${baseUrl}\n`);

// Test configurations
const tests = [
  {
    name: 'Health Check',
    url: `${baseUrl}/api/health`,
    connections: 100,
    duration: 10,
    method: 'GET'
  },
  {
    name: 'Events List',
    url: `${baseUrl}/api/events?limit=20`,
    connections: 50,
    duration: 30,
    method: 'GET'
  },
  {
    name: 'Single Event',
    url: `${baseUrl}/api/events/test-event-id`,
    connections: 50,
    duration: 30,
    method: 'GET'
  },
  {
    name: 'Search',
    url: `${baseUrl}/api/search?q=test`,
    connections: 30,
    duration: 20,
    method: 'GET'
  },
  {
    name: 'Projects List',
    url: `${baseUrl}/api/atlvs/projects`,
    connections: 30,
    duration: 20,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer test-token'
    }
  }
];

// Run tests sequentially
async function runTests() {
  const results = [];

  for (const test of tests) {
    console.log(`\n📊 Running: ${test.name}`);
    console.log(`   URL: ${test.url}`);
    console.log(`   Connections: ${test.connections}, Duration: ${test.duration}s\n`);

    const result = await new Promise((resolve) => {
      const instance = autocannon({
        url: test.url,
        connections: test.connections,
        duration: test.duration,
        method: test.method,
        headers: test.headers || {}
      }, (err, result) => {
        if (err) {
          console.error(`❌ Error in ${test.name}:`, err);
          resolve({ name: test.name, error: err.message });
        } else {
          resolve({ name: test.name, result });
        }
      });

      autocannon.track(instance, { renderProgressBar: true });
    });

    results.push(result);

    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Print summary
  console.log('\n\n📈 Load Test Summary\n');
  console.log('='.repeat(80));

  results.forEach(({ name, result, error }) => {
    if (error) {
      console.log(`\n❌ ${name}: FAILED`);
      console.log(`   Error: ${error}`);
    } else {
      const { requests, latency, throughput, errors } = result;
      
      console.log(`\n✅ ${name}`);
      console.log(`   Requests:  ${requests.total} total, ${requests.average}/sec`);
      console.log(`   Latency:   ${latency.mean.toFixed(2)}ms avg, ${latency.p99.toFixed(2)}ms p99`);
      console.log(`   Throughput: ${(throughput.mean / 1024 / 1024).toFixed(2)} MB/s`);
      console.log(`   Errors:    ${errors}`);
      
      // Performance assessment
      if (latency.mean > 500) {
        console.log(`   ⚠️  Warning: High average latency`);
      }
      if (latency.p99 > 2000) {
        console.log(`   ⚠️  Warning: High p99 latency`);
      }
      if (errors > requests.total * 0.01) {
        console.log(`   ⚠️  Warning: Error rate > 1%`);
      }
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n✅ Load testing complete!\n');
}

// Check if autocannon is installed
try {
  require.resolve('autocannon');
  runTests().catch(console.error);
} catch (e) {
  console.error('❌ autocannon not installed. Run: npm install -g autocannon');
  process.exit(1);
}
