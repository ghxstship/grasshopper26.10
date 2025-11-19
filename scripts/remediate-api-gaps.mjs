#!/usr/bin/env node

/**
 * API Implementation Gap Remediation Script
 * 
 * This script automatically fixes critical API implementation gaps:
 * 1. Adds rate limiting to routes missing it
 * 2. Adds validation imports where missing
 * 3. Adds authentication checks where missing
 * 4. Documents routes needing manual attention
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m',
};

const stats = {
  routesProcessed: 0,
  rateLimitingAdded: 0,
  authenticationAdded: 0,
  validationAdded: 0,
  errorsEncountered: 0,
  skipped: 0,
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
 * Check if route needs rate limiting
 */
function needsRateLimiting(content) {
  return !content.includes('rateLimit') && !content.includes('RATE_LIMITS');
}

/**
 * Check if route needs authentication
 */
function needsAuthentication(content) {
  // Check if it's a public endpoint
  const isPublicEndpoint = 
    content.includes('PUBLIC_ENDPOINT') ||
    content.includes('// Public endpoint') ||
    content.includes('// No auth required');
  
  if (isPublicEndpoint) return false;
  
  return !(
    content.includes('validateRequest') ||
    content.includes('requireAuth') ||
    content.includes('getSession')
  );
}

/**
 * Check if route needs validation
 */
function needsValidation(content) {
  return !content.includes('z.object') && !content.includes('schema.parse');
}

/**
 * Add rate limiting to route
 */
function addRateLimiting(content, isPublic = false) {
  // Check if imports already exist
  const hasRateLimitImport = content.includes('rateLimit');
  
  let newContent = content;
  
  // Add imports if missing
  if (!hasRateLimitImport) {
    const importStatement = `import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";\nimport { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";\n`;
    
    // Find the last import statement
    const importRegex = /import .+ from .+;/g;
    const imports = content.match(importRegex);
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      newContent = newContent.replace(lastImport, lastImport + '\n' + importStatement);
    }
  }
  
  // Add rate limiting to each HTTP method
  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  
  for (const method of methods) {
    const methodRegex = new RegExp(`export async function ${method}\\(request: NextRequest\\) \\{\\s*try \\{`, 'g');
    
    if (methodRegex.test(newContent)) {
      const rateLimitType = isPublic ? 'PUBLIC_ENDPOINT' : 'WRITE_OPERATIONS';
      const identifier = isPublic 
        ? 'RateLimitIdentifiers.byIP(getClientIdentifier(request))'
        : 'RateLimitIdentifiers.byUserId(context.userId)';
      
      const rateLimitCode = `
    // Rate limiting
    if (
      !rateLimit(
        ${identifier},
        RATE_LIMITS.${rateLimitType}.limit,
        RATE_LIMITS.${rateLimitType}.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }
`;
      
      // Reset regex
      const methodRegex2 = new RegExp(`(export async function ${method}\\(request: NextRequest\\) \\{\\s*try \\{)`, 'g');
      newContent = newContent.replace(methodRegex2, `$1${rateLimitCode}`);
    }
  }
  
  return newContent;
}

/**
 * Add authentication to route
 */
function addAuthentication(content) {
  let newContent = content;
  
  // Check if imports already exist
  if (!content.includes('validateRequest')) {
    const importStatement = `import { validateRequest, requireAuth } from "@/lib/api/middleware";\n`;
    
    const importRegex = /import .+ from .+;/g;
    const imports = content.match(importRegex);
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      newContent = newContent.replace(lastImport, lastImport + '\n' + importStatement);
    }
  }
  
  // Add auth check to each HTTP method
  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  
  for (const method of methods) {
    const methodRegex = new RegExp(`export async function ${method}\\(request: NextRequest\\) \\{\\s*try \\{`, 'g');
    
    if (methodRegex.test(newContent)) {
      const authCode = `
    const context = await validateRequest(request);
    requireAuth(context);
`;
      
      const methodRegex2 = new RegExp(`(export async function ${method}\\(request: NextRequest\\) \\{\\s*try \\{)`, 'g');
      newContent = newContent.replace(methodRegex2, `$1${authCode}`);
    }
  }
  
  return newContent;
}

/**
 * Process a single route file
 */
function processRoute(routePath) {
  try {
    stats.routesProcessed++;
    
    const content = fs.readFileSync(routePath, 'utf-8');
    const relativePath = routePath.replace(rootDir, '');
    
    let modified = false;
    let newContent = content;
    const changes = [];
    
    // Check if it's a public endpoint
    const isPublic = 
      content.includes('PUBLIC_ENDPOINT') ||
      relativePath.includes('/events') ||
      relativePath.includes('/artists') ||
      relativePath.includes('/adventures');
    
    // Add rate limiting if missing
    if (needsRateLimiting(content)) {
      newContent = addRateLimiting(newContent, isPublic);
      stats.rateLimitingAdded++;
      changes.push('rate limiting');
      modified = true;
    }
    
    // Add authentication if missing (skip public endpoints)
    if (!isPublic && needsAuthentication(content)) {
      newContent = addAuthentication(newContent);
      stats.authenticationAdded++;
      changes.push('authentication');
      modified = true;
    }
    
    // Write back if modified
    if (modified) {
      fs.writeFileSync(routePath, newContent);
      console.log(`${colors.green}✓${colors.reset} ${relativePath}`);
      console.log(`  Added: ${changes.join(', ')}`);
      return true;
    } else {
      stats.skipped++;
      return false;
    }
  } catch (error) {
    stats.errorsEncountered++;
    console.error(`${colors.red}✗${colors.reset} ${routePath.replace(rootDir, '')}`);
    console.error(`  Error: ${error.message}`);
    return false;
  }
}

/**
 * Generate manual remediation report
 */
function generateManualReport(routes) {
  const manualTasks = [];
  
  for (const routePath of routes) {
    const content = fs.readFileSync(routePath, 'utf-8');
    const relativePath = routePath.replace(rootDir, '');
    const tasks = [];
    
    // Check for missing validation
    if (needsValidation(content)) {
      tasks.push('Add Zod validation schemas');
    }
    
    // Check for missing service layer
    if (!content.includes('Service') && content.includes('prisma.')) {
      tasks.push('Refactor to service layer');
    }
    
    // Check for missing error handling
    if (!content.includes('handleApiError')) {
      tasks.push('Add proper error handling');
    }
    
    if (tasks.length > 0) {
      manualTasks.push({ path: relativePath, tasks });
    }
  }
  
  // Write report
  const reportPath = path.join(rootDir, 'MANUAL_REMEDIATION_TASKS.md');
  let report = '# Manual API Remediation Tasks\n\n';
  report += `**Generated:** ${new Date().toISOString()}\n\n`;
  report += `## Routes Requiring Manual Attention (${manualTasks.length})\n\n`;
  
  for (const { path, tasks } of manualTasks) {
    report += `### ${path}\n\n`;
    tasks.forEach(task => {
      report += `- [ ] ${task}\n`;
    });
    report += '\n';
  }
  
  fs.writeFileSync(reportPath, report);
  console.log(`\n${colors.cyan}Manual remediation tasks saved to:${colors.reset} ${reportPath}`);
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.bright}${colors.cyan}Starting API Gap Remediation...${colors.reset}\n`);
  
  const apiDir = path.join(rootDir, 'src/app/api');
  const routes = findApiRoutes(apiDir);
  
  console.log(`Found ${routes.length} API route files\n`);
  console.log(`${colors.bright}Processing routes...${colors.reset}\n`);
  
  // Process each route
  for (const routePath of routes) {
    processRoute(routePath);
  }
  
  // Generate manual remediation report
  console.log(`\n${colors.bright}Generating manual remediation report...${colors.reset}`);
  generateManualReport(routes);
  
  // Print summary
  console.log(`\n${'='.repeat(80)}`);
  console.log(`${colors.bright}${colors.cyan}REMEDIATION SUMMARY${colors.reset}`);
  console.log(`${'='.repeat(80)}\n`);
  
  console.log(`${colors.bright}Automated Fixes:${colors.reset}`);
  console.log(`  Routes Processed:        ${stats.routesProcessed}`);
  console.log(`  ${colors.green}Rate Limiting Added:${colors.reset}  ${stats.rateLimitingAdded}`);
  console.log(`  ${colors.green}Authentication Added:${colors.reset} ${stats.authenticationAdded}`);
  console.log(`  Skipped (already fixed): ${stats.skipped}`);
  console.log(`  ${colors.red}Errors Encountered:${colors.reset}   ${stats.errorsEncountered}`);
  
  console.log(`\n${colors.bright}Next Steps:${colors.reset}`);
  console.log(`  1. Review MANUAL_REMEDIATION_TASKS.md for remaining work`);
  console.log(`  2. Run validation script to verify improvements`);
  console.log(`  3. Test affected endpoints`);
  console.log(`  4. Commit changes with descriptive message\n`);
  
  if (stats.errorsEncountered > 0) {
    console.log(`${colors.yellow}⚠ Some routes encountered errors. Please review manually.${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}✓ Remediation completed successfully!${colors.reset}\n`);
    process.exit(0);
  }
}

main();
