#!/usr/bin/env node

/**
 * API Implementation Validation Script
 * 
 * This script validates that all API routes are:
 * 1. Fully implemented in the backend (route handlers)
 * 2. Connected to UI components (frontend consumption)
 * 3. Have corresponding service layer implementations
 * 4. Include proper validation, authentication, and error handling
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const results = {
  totalRoutes: 0,
  fullyImplemented: 0,
  partiallyImplemented: 0,
  notImplemented: 0,
  routes: [],
};

/**
 * Find all API route files
 */
function findApiRoutes(dir, routes = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findApiRoutes(filePath, routes);
    } else if (file === 'route.ts') {
      routes.push(filePath);
    }
  }

  return routes;
}

/**
 * Extract HTTP methods from route file
 */
function extractHttpMethods(content) {
  const methods = [];
  const methodRegex = /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE)\s*\(/g;
  let match;

  while ((match = methodRegex.exec(content)) !== null) {
    methods.push(match[1]);
  }

  return methods;
}

/**
 * Check if route has proper authentication
 */
function hasAuthentication(content) {
  return (
    content.includes('validateRequest') ||
    content.includes('requireAuth') ||
    content.includes('getSession') ||
    content.includes('auth')
  );
}

/**
 * Check if route has validation
 */
function hasValidation(content) {
  return (
    content.includes('z.object') ||
    content.includes('schema.parse') ||
    content.includes('validate')
  );
}

/**
 * Check if route has error handling
 */
function hasErrorHandling(content) {
  return (
    content.includes('try') &&
    content.includes('catch') &&
    (content.includes('handleApiError') || content.includes('NextResponse.json'))
  );
}

/**
 * Check if route has rate limiting
 */
function hasRateLimiting(content) {
  return content.includes('rateLimit') || content.includes('RATE_LIMITS');
}

/**
 * Check if route uses service layer
 */
function usesServiceLayer(content) {
  return content.includes('Service') && content.includes('new ');
}

/**
 * Check if route has database operations
 */
function hasDatabaseOps(content) {
  return content.includes('prisma.') || content.includes('supabase.');
}

/**
 * Find UI components that consume this API
 */
function findUIConsumers(apiPath) {
  const routePath = apiPath
    .replace(path.join(rootDir, 'src/app/api'), '')
    .replace('/route.ts', '')
    .replace(/\[(\w+)\]/g, ':$1');

  const consumers = [];
  const appDir = path.join(rootDir, 'src/app');

  function searchDir(dir) {
    try {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          searchDir(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          try {
            const content = fs.readFileSync(filePath, 'utf-8');
            // Check for fetch calls or service usage
            if (
              content.includes(`/api${routePath}`) ||
              content.includes(`\`/api${routePath}`) ||
              content.includes(`'/api${routePath}'`) ||
              content.includes(`"/api${routePath}"`)
            ) {
              consumers.push(filePath.replace(rootDir, ''));
            }
          } catch {
            // Skip files that can't be read
          }
        }
      }
    } catch {
      // Skip directories that can't be read
    }
  }

  searchDir(appDir);
  return consumers;
}

/**
 * Find corresponding service file
 */
function findServiceFile(apiPath) {
  const routePath = apiPath
    .replace(path.join(rootDir, 'src/app/api'), '')
    .replace('/route.ts', '');

  const servicesDir = path.join(rootDir, 'src/lib/services');
  const possiblePaths = [
    path.join(servicesDir, `${routePath}.service.ts`),
    path.join(servicesDir, `${routePath}Service.ts`),
    path.join(servicesDir, routePath, 'index.ts'),
  ];

  for (const servicePath of possiblePaths) {
    if (fs.existsSync(servicePath)) {
      return servicePath.replace(rootDir, '');
    }
  }

  // Search for related service files
  const pathParts = routePath.split('/').filter(Boolean);
  for (let i = pathParts.length; i > 0; i--) {
    const partialPath = pathParts.slice(0, i).join('/');
    const searchPath = path.join(servicesDir, partialPath);

    if (fs.existsSync(searchPath)) {
      const files = fs.readdirSync(searchPath);
      const serviceFile = files.find(f => f.endsWith('.service.ts') || f.endsWith('Service.ts'));
      if (serviceFile) {
        return path.join(searchPath, serviceFile).replace(rootDir, '');
      }
    }
  }

  return null;
}

/**
 * Analyze a single API route
 */
function analyzeRoute(routePath) {
  const content = fs.readFileSync(routePath, 'utf-8');
  const relativePath = routePath.replace(rootDir, '');
  const apiEndpoint = relativePath
    .replace('/src/app/api', '')
    .replace('/route.ts', '')
    .replace(/\[(\w+)\]/g, ':$1');

  const methods = extractHttpMethods(content);
  const auth = hasAuthentication(content);
  const validation = hasValidation(content);
  const errorHandling = hasErrorHandling(content);
  const rateLimiting = hasRateLimiting(content);
  const serviceLayer = usesServiceLayer(content);
  const dbOps = hasDatabaseOps(content);
  const uiConsumers = findUIConsumers(routePath);
  const serviceFile = findServiceFile(routePath);

  // Calculate implementation score
  let score = 0;
  let maxScore = 0;

  // Backend implementation (60 points)
  maxScore += 10; // Methods exist
  if (methods.length > 0) score += 10;

  maxScore += 10; // Authentication
  if (auth) score += 10;

  maxScore += 10; // Validation
  if (validation) score += 10;

  maxScore += 10; // Error handling
  if (errorHandling) score += 10;

  maxScore += 10; // Rate limiting
  if (rateLimiting) score += 10;

  maxScore += 10; // Service layer or DB ops
  if (serviceLayer || dbOps) score += 10;

  // UI integration (40 points)
  maxScore += 20; // UI consumers exist
  if (uiConsumers.length > 0) score += 20;

  maxScore += 20; // Service file exists
  if (serviceFile) score += 20;

  const percentage = Math.round((score / maxScore) * 100);

  const routeInfo = {
    endpoint: apiEndpoint,
    file: relativePath,
    methods,
    implementation: {
      auth,
      validation,
      errorHandling,
      rateLimiting,
      serviceLayer,
      dbOps,
    },
    uiConsumers,
    serviceFile,
    score,
    maxScore,
    percentage,
  };

  results.routes.push(routeInfo);
  results.totalRoutes++;

  if (percentage === 100) {
    results.fullyImplemented++;
  } else if (percentage >= 50) {
    results.partiallyImplemented++;
  } else {
    results.notImplemented++;
  }

  return routeInfo;
}

/**
 * Print route analysis
 */
function printRouteAnalysis(route) {
  const statusColor =
    route.percentage === 100
      ? colors.green
      : route.percentage >= 50
      ? colors.yellow
      : colors.red;

  console.log(`\n${colors.bright}${statusColor}${route.endpoint}${colors.reset}`);
  console.log(`  ${colors.cyan}File:${colors.reset} ${route.file}`);
  console.log(`  ${colors.cyan}Methods:${colors.reset} ${route.methods.join(', ') || 'None'}`);
  console.log(`  ${colors.cyan}Implementation:${colors.reset} ${statusColor}${route.percentage}%${colors.reset}`);

  console.log(`\n  ${colors.bright}Backend Implementation:${colors.reset}`);
  console.log(`    Authentication:  ${route.implementation.auth ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  console.log(`    Validation:      ${route.implementation.validation ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  console.log(`    Error Handling:  ${route.implementation.errorHandling ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  console.log(`    Rate Limiting:   ${route.implementation.rateLimiting ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  console.log(`    Service Layer:   ${route.implementation.serviceLayer ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  console.log(`    Database Ops:    ${route.implementation.dbOps ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);

  console.log(`\n  ${colors.bright}UI Integration:${colors.reset}`);
  console.log(`    UI Consumers:    ${route.uiConsumers.length > 0 ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}(${route.uiConsumers.length})`);
  if (route.uiConsumers.length > 0) {
    route.uiConsumers.slice(0, 3).forEach(consumer => {
      console.log(`      - ${consumer}`);
    });
    if (route.uiConsumers.length > 3) {
      console.log(`      ... and ${route.uiConsumers.length - 3} more`);
    }
  }
  console.log(`    Service File:    ${route.serviceFile ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  if (route.serviceFile) {
    console.log(`      ${route.serviceFile}`);
  }
}

/**
 * Print summary
 */
function printSummary() {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`${colors.bright}${colors.cyan}API IMPLEMENTATION VALIDATION SUMMARY${colors.reset}`);
  console.log(`${'='.repeat(80)}\n`);

  const overallPercentage = Math.round(
    (results.routes.reduce((sum, r) => sum + r.percentage, 0) / results.totalRoutes)
  );

  console.log(`${colors.bright}Overall Statistics:${colors.reset}`);
  console.log(`  Total API Routes:        ${results.totalRoutes}`);
  console.log(`  ${colors.green}Fully Implemented:${colors.reset}    ${results.fullyImplemented} (${Math.round((results.fullyImplemented / results.totalRoutes) * 100)}%)`);
  console.log(`  ${colors.yellow}Partially Implemented:${colors.reset} ${results.partiallyImplemented} (${Math.round((results.partiallyImplemented / results.totalRoutes) * 100)}%)`);
  console.log(`  ${colors.red}Not Implemented:${colors.reset}       ${results.notImplemented} (${Math.round((results.notImplemented / results.totalRoutes) * 100)}%)`);
  console.log(`\n  ${colors.bright}Overall Implementation: ${overallPercentage}%${colors.reset}`);

  // Group by platform
  const platforms = {
    gvteway: results.routes.filter(r => r.endpoint.startsWith('/gvteway')),
    atlvs: results.routes.filter(r => r.endpoint.startsWith('/atlvs')),
    compvss: results.routes.filter(r => r.endpoint.startsWith('/compvss')),
    common: results.routes.filter(r => !r.endpoint.startsWith('/gvteway') && !r.endpoint.startsWith('/atlvs') && !r.endpoint.startsWith('/compvss')),
  };

  console.log(`\n${colors.bright}By Platform:${colors.reset}`);
  for (const [platform, routes] of Object.entries(platforms)) {
    if (routes.length > 0) {
      const platformPercentage = Math.round(
        routes.reduce((sum, r) => sum + r.percentage, 0) / routes.length
      );
      console.log(`  ${platform.toUpperCase()}: ${routes.length} routes, ${platformPercentage}% implemented`);
    }
  }

  // Routes needing attention
  const needsAttention = results.routes.filter(r => r.percentage < 100).sort((a, b) => a.percentage - b.percentage);

  if (needsAttention.length > 0) {
    console.log(`\n${colors.bright}${colors.yellow}Routes Needing Attention (${needsAttention.length}):${colors.reset}`);
    needsAttention.slice(0, 10).forEach(route => {
      const issues = [];
      if (!route.implementation.auth) issues.push('auth');
      if (!route.implementation.validation) issues.push('validation');
      if (!route.implementation.errorHandling) issues.push('error handling');
      if (!route.implementation.rateLimiting) issues.push('rate limiting');
      if (!route.implementation.serviceLayer && !route.implementation.dbOps) issues.push('service/db');
      if (route.uiConsumers.length === 0) issues.push('no UI consumers');
      if (!route.serviceFile) issues.push('no service file');

      console.log(`  ${route.percentage}% - ${route.endpoint}`);
      console.log(`       Missing: ${issues.join(', ')}`);
    });
    if (needsAttention.length > 10) {
      console.log(`  ... and ${needsAttention.length - 10} more routes`);
    }
  }

  console.log(`\n${'='.repeat(80)}\n`);
}

/**
 * Generate detailed report
 */
function generateReport() {
  const reportPath = path.join(rootDir, 'API_IMPLEMENTATION_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`${colors.green}✓${colors.reset} Detailed report saved to: ${reportPath}`);

  // Generate markdown report
  const mdReportPath = path.join(rootDir, 'API_IMPLEMENTATION_REPORT.md');
  let mdContent = '# API Implementation Validation Report\n\n';
  mdContent += `**Generated:** ${new Date().toISOString()}\n\n`;
  mdContent += `## Summary\n\n`;
  mdContent += `- **Total API Routes:** ${results.totalRoutes}\n`;
  mdContent += `- **Fully Implemented:** ${results.fullyImplemented} (${Math.round((results.fullyImplemented / results.totalRoutes) * 100)}%)\n`;
  mdContent += `- **Partially Implemented:** ${results.partiallyImplemented} (${Math.round((results.partiallyImplemented / results.totalRoutes) * 100)}%)\n`;
  mdContent += `- **Not Implemented:** ${results.notImplemented} (${Math.round((results.notImplemented / results.totalRoutes) * 100)}%)\n\n`;

  mdContent += `## Routes by Implementation Status\n\n`;

  // Fully implemented
  const fullyImplemented = results.routes.filter(r => r.percentage === 100);
  if (fullyImplemented.length > 0) {
    mdContent += `### ✅ Fully Implemented (${fullyImplemented.length})\n\n`;
    fullyImplemented.forEach(route => {
      mdContent += `- **${route.endpoint}** - ${route.methods.join(', ')}\n`;
    });
    mdContent += '\n';
  }

  // Partially implemented
  const partiallyImplemented = results.routes.filter(r => r.percentage >= 50 && r.percentage < 100);
  if (partiallyImplemented.length > 0) {
    mdContent += `### ⚠️ Partially Implemented (${partiallyImplemented.length})\n\n`;
    partiallyImplemented.forEach(route => {
      const issues = [];
      if (!route.implementation.auth) issues.push('auth');
      if (!route.implementation.validation) issues.push('validation');
      if (!route.implementation.errorHandling) issues.push('error handling');
      if (!route.implementation.rateLimiting) issues.push('rate limiting');
      if (route.uiConsumers.length === 0) issues.push('no UI consumers');
      if (!route.serviceFile) issues.push('no service file');

      mdContent += `- **${route.endpoint}** (${route.percentage}%) - ${route.methods.join(', ')}\n`;
      mdContent += `  - Missing: ${issues.join(', ')}\n`;
    });
    mdContent += '\n';
  }

  // Not implemented
  const notImplemented = results.routes.filter(r => r.percentage < 50);
  if (notImplemented.length > 0) {
    mdContent += `### ❌ Not Implemented (${notImplemented.length})\n\n`;
    notImplemented.forEach(route => {
      mdContent += `- **${route.endpoint}** (${route.percentage}%) - ${route.methods.join(', ')}\n`;
    });
    mdContent += '\n';
  }

  fs.writeFileSync(mdReportPath, mdContent);
  console.log(`${colors.green}✓${colors.reset} Markdown report saved to: ${mdReportPath}`);
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.bright}${colors.cyan}Starting API Implementation Validation...${colors.reset}\n`);

  const apiDir = path.join(rootDir, 'src/app/api');
  const routes = findApiRoutes(apiDir);

  console.log(`Found ${routes.length} API route files\n`);

  // Analyze each route
  routes.forEach(routePath => {
    const analysis = analyzeRoute(routePath);
    if (process.argv.includes('--verbose')) {
      printRouteAnalysis(analysis);
    }
  });

  // Print summary
  printSummary();

  // Generate reports
  generateReport();

  // Exit with appropriate code
  const overallPercentage = Math.round(
    results.routes.reduce((sum, r) => sum + r.percentage, 0) / results.totalRoutes
  );

  if (overallPercentage === 100) {
    console.log(`${colors.green}${colors.bright}✓ All API routes are fully implemented!${colors.reset}\n`);
    process.exit(0);
  } else if (overallPercentage >= 80) {
    console.log(`${colors.yellow}${colors.bright}⚠ Most API routes are implemented, but some need attention.${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}${colors.bright}✗ Significant API implementation gaps detected.${colors.reset}\n`);
    process.exit(1);
  }
}

main();
