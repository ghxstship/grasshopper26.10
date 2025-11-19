#!/usr/bin/env ts-node
/**
 * API Route Validation Script
 * Validates that all API routes are properly implemented
 * Checks for:
 * - Proper HTTP method exports (GET, POST, PUT, PATCH, DELETE)
 * - Error handling with handleApiError or try-catch
 * - Rate limiting implementation
 * - Authentication checks
 * - Input validation with Zod schemas
 */

import * as fs from 'fs';
import * as path from 'path';

interface RouteValidation {
  file: string;
  methods: string[];
  hasErrorHandling: boolean;
  hasRateLimiting: boolean;
  hasAuth: boolean;
  hasValidation: boolean;
  hasTODO: boolean;
  issues: string[];
}

const API_DIR = path.join(process.cwd(), 'src/app/api');

function findRouteFiles(dir: string): string[] {
  const files: string[] = [];
  
  function traverse(currentDir: string) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item === 'route.ts') {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function validateRoute(filePath: string): RouteValidation {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(API_DIR, filePath);
  
  const validation: RouteValidation = {
    file: relativePath,
    methods: [],
    hasErrorHandling: false,
    hasRateLimiting: false,
    hasAuth: false,
    hasValidation: false,
    hasTODO: false,
    issues: [],
  };
  
  // Check for HTTP methods (both function and const patterns)
  const functionMethodRegex = /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE)/g;
  const constMethodRegex = /export\s+const\s+(GET|POST|PUT|PATCH|DELETE)\s*=/g;
  
  let match;
  while ((match = functionMethodRegex.exec(content)) !== null) {
    validation.methods.push(match[1]);
  }
  while ((match = constMethodRegex.exec(content)) !== null) {
    validation.methods.push(match[1]);
  }
  
  if (validation.methods.length === 0) {
    validation.issues.push('No HTTP method exports found');
  }
  
  // Check for error handling
  validation.hasErrorHandling = 
    content.includes('handleApiError') || 
    (content.includes('try') && content.includes('catch')) ||
    content.includes('NextAuth('); // NextAuth handles errors internally
  
  if (!validation.hasErrorHandling) {
    validation.issues.push('Missing error handling');
  }
  
  // Check for rate limiting
  validation.hasRateLimiting = content.includes('rateLimit');
  
  // Check for authentication
  validation.hasAuth = 
    content.includes('requireAuth') || 
    content.includes('getServerSession') ||
    content.includes('validateRequest');
  
  // Check for validation
  validation.hasValidation = 
    content.includes('.parse(') || 
    content.includes('.safeParse(') ||
    content.includes('z.object');
  
  // Check for TODOs (only in comments, not in strings)
  const todoRegex = /\/\/\s*(TODO|FIXME)|\/\*[\s\S]*?(TODO|FIXME)[\s\S]*?\*\//gi;
  validation.hasTODO = todoRegex.test(content);
  
  if (validation.hasTODO) {
    validation.issues.push('Contains TODO/FIXME comments');
  }
  
  return validation;
}

function generateReport(validations: RouteValidation[]) {
  console.log('\n=== API Route Validation Report ===\n');
  
  const total = validations.length;
  const withIssues = validations.filter(v => v.issues.length > 0).length;
  const withTODOs = validations.filter(v => v.hasTODO).length;
  const withoutAuth = validations.filter(v => !v.hasAuth).length;
  const withoutRateLimit = validations.filter(v => !v.hasRateLimiting).length;
  const withoutValidation = validations.filter(v => !v.hasValidation).length;
  
  console.log(`Total Routes: ${total}`);
  console.log(`Routes with Issues: ${withIssues} (${((withIssues/total)*100).toFixed(1)}%)`);
  console.log(`Routes with TODOs: ${withTODOs} (${((withTODOs/total)*100).toFixed(1)}%)`);
  console.log(`Routes without Auth: ${withoutAuth} (${((withoutAuth/total)*100).toFixed(1)}%)`);
  console.log(`Routes without Rate Limiting: ${withoutRateLimit} (${((withoutRateLimit/total)*100).toFixed(1)}%)`);
  console.log(`Routes without Validation: ${withoutValidation} (${((withoutValidation/total)*100).toFixed(1)}%)`);
  
  const completionRate = ((total - withIssues) / total * 100).toFixed(1);
  console.log(`\nCompletion Rate: ${completionRate}%`);
  
  if (withIssues > 0) {
    console.log('\n=== Routes with Issues ===\n');
    
    validations
      .filter(v => v.issues.length > 0)
      .forEach(v => {
        console.log(`\n${v.file}`);
        console.log(`  Methods: ${v.methods.join(', ') || 'None'}`);
        console.log(`  Issues:`);
        v.issues.forEach(issue => {
          console.log(`    - ${issue}`);
        });
      });
  }
  
  // Summary by category
  console.log('\n=== Summary by Category ===\n');
  
  const categories = new Map<string, RouteValidation[]>();
  validations.forEach(v => {
    const category = v.file.split('/')[0];
    if (!categories.has(category)) {
      categories.set(category, []);
    }
    categories.get(category)!.push(v);
  });
  
  Array.from(categories.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([category, routes]) => {
      const categoryIssues = routes.filter(r => r.issues.length > 0).length;
      const categoryCompletion = ((routes.length - categoryIssues) / routes.length * 100).toFixed(1);
      console.log(`${category}: ${routes.length} routes, ${categoryCompletion}% complete`);
    });
  
  // Export JSON report
  const reportPath = path.join(process.cwd(), 'API_VALIDATION_REPORT.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        total,
        withIssues,
        withTODOs,
        withoutAuth,
        withoutRateLimit,
        withoutValidation,
        completionRate: parseFloat(completionRate),
      },
      routes: validations,
    }, null, 2)
  );
  
  console.log(`\nDetailed report saved to: ${reportPath}`);
  
  return parseFloat(completionRate);
}

// Main execution
try {
  console.log('Scanning API routes...\n');
  const routeFiles = findRouteFiles(API_DIR);
  console.log(`Found ${routeFiles.length} route files\n`);
  
  const validations = routeFiles.map(validateRoute);
  const completionRate = generateReport(validations);
  
  console.log('\n=== Validation Complete ===\n');
  
  if (completionRate === 100) {
    console.log('✅ All routes are 100% complete!');
    process.exit(0);
  } else {
    console.log(`⚠️  Routes are ${completionRate}% complete`);
    process.exit(1);
  }
} catch (error) {
  console.error('Error during validation:', error);
  process.exit(1);
}
