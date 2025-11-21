#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const issues = {
  hooks: {
    missingApiCalls: [],
    todoComments: [],
    mockData: [],
    incompleteImplementation: [],
    missingErrorHandling: [],
  },
  apis: {
    missingDbCalls: [],
    todoComments: [],
    mockData: [],
    incompleteImplementation: [],
    missingValidation: [],
    missingAuth: [],
  },
  integration: {
    unmatchedHooks: [],
    unmatchedApis: [],
  }
};

// Recursively get all files
function getAllFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  files.forEach(file => {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('__tests__')) {
        getAllFiles(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Check hook implementation
function validateHook(filePath, content) {
  const relativePath = filePath.replace(rootDir, '');
  
  // Check for TODO comments
  const todoMatches = content.match(/\/\/\s*TODO|\/\*\s*TODO/gi);
  if (todoMatches) {
    issues.hooks.todoComments.push({
      file: relativePath,
      count: todoMatches.length
    });
  }

  // Check for mock data
  if (content.includes('mockData') || content.includes('MOCK_') || content.includes('placeholder')) {
    issues.hooks.mockData.push(relativePath);
  }

  // Check for API calls (fetch, axios, or custom API client)
  const hasFetch = content.includes('fetch(') || content.includes('await fetch');
  const hasAxios = content.includes('axios.');
  const hasApiCall = content.includes('/api/');
  
  if (!hasFetch && !hasAxios && !hasApiCall && !content.includes('export const')) {
    // Only flag if it's not just a type export
    if (content.includes('export function') || content.includes('export default')) {
      issues.hooks.missingApiCalls.push(relativePath);
    }
  }

  // Check for error handling
  const hasTryCatch = content.includes('try {') && content.includes('catch');
  const hasErrorState = content.includes('error') || content.includes('Error');
  
  if ((hasFetch || hasAxios) && !hasTryCatch && !hasErrorState) {
    issues.hooks.missingErrorHandling.push(relativePath);
  }

  // Check for incomplete implementations
  if (content.includes('throw new Error("Not implemented")') || 
      content.includes('console.log("TODO")')  ||
      (content.includes('return null') && content.includes('// TODO'))) {
    issues.hooks.incompleteImplementation.push(relativePath);
  }
}

// Check API route implementation
function validateApiRoute(filePath, content) {
  const relativePath = filePath.replace(rootDir, '');
  
  // Check for TODO comments
  const todoMatches = content.match(/\/\/\s*TODO|\/\*\s*TODO/gi);
  if (todoMatches) {
    issues.apis.todoComments.push({
      file: relativePath,
      count: todoMatches.length
    });
  }

  // Check for mock data
  if (content.includes('mockData') || content.includes('MOCK_') || 
      content.includes('placeholder') || content.includes('fake')) {
    issues.apis.mockData.push(relativePath);
  }

  // Check for database calls
  const hasPrisma = content.includes('prisma.');
  const hasSupabase = content.includes('supabase.');
  const hasDb = content.includes('db.');
  
  if (!hasPrisma && !hasSupabase && !hasDb && content.includes('export async function')) {
    issues.apis.missingDbCalls.push(relativePath);
  }

  // Check for validation
  const hasZod = content.includes('z.') || content.includes('schema');
  const hasValidation = content.includes('validate') || content.includes('parse');
  
  if (content.includes('POST') || content.includes('PUT') || content.includes('PATCH')) {
    if (!hasZod && !hasValidation) {
      issues.apis.missingValidation.push(relativePath);
    }
  }

  // Check for authentication
  const hasAuth = content.includes('getServerSession') || 
                  content.includes('auth') ||
                  content.includes('session');
  
  if (!hasAuth && !relativePath.includes('/auth/') && !relativePath.includes('/public/')) {
    issues.apis.missingAuth.push(relativePath);
  }

  // Check for incomplete implementations
  if (content.includes('throw new Error("Not implemented")') || 
      content.includes('NextResponse.json({ message: "Not implemented" })') ||
      content.includes('return new Response("TODO"')) {
    issues.apis.incompleteImplementation.push(relativePath);
  }
}

// Main validation
console.log('🔍 Validating Full-Stack Implementation...\n');

// Validate hooks
const hooksDir = join(rootDir, 'src/hooks');
const hookFiles = getAllFiles(hooksDir);
console.log(`📊 Found ${hookFiles.length} hook files`);

hookFiles.forEach(file => {
  const content = readFileSync(file, 'utf-8');
  validateHook(file, content);
});

// Validate API routes
const apiDir = join(rootDir, 'src/app/api');
const apiFiles = getAllFiles(apiDir).filter(f => f.endsWith('route.ts'));
console.log(`📊 Found ${apiFiles.length} API route files\n`);

apiFiles.forEach(file => {
  const content = readFileSync(file, 'utf-8');
  validateApiRoute(file, content);
});

// Report findings
console.log('═══════════════════════════════════════════════════════════');
console.log('📋 VALIDATION REPORT');
console.log('═══════════════════════════════════════════════════════════\n');

let totalIssues = 0;

console.log('🪝 HOOKS ANALYSIS:');
console.log('─────────────────────────────────────────────────────────────');

if (issues.hooks.missingApiCalls.length > 0) {
  console.log(`\n❌ Missing API Calls (${issues.hooks.missingApiCalls.length}):`);
  issues.hooks.missingApiCalls.forEach(file => console.log(`   ${file}`));
  totalIssues += issues.hooks.missingApiCalls.length;
}

if (issues.hooks.todoComments.length > 0) {
  console.log(`\n⚠️  TODO Comments (${issues.hooks.todoComments.length}):`);
  issues.hooks.todoComments.forEach(item => console.log(`   ${item.file} (${item.count} TODOs)`));
  totalIssues += issues.hooks.todoComments.length;
}

if (issues.hooks.mockData.length > 0) {
  console.log(`\n⚠️  Mock Data Found (${issues.hooks.mockData.length}):`);
  issues.hooks.mockData.forEach(file => console.log(`   ${file}`));
  totalIssues += issues.hooks.mockData.length;
}

if (issues.hooks.incompleteImplementation.length > 0) {
  console.log(`\n❌ Incomplete Implementation (${issues.hooks.incompleteImplementation.length}):`);
  issues.hooks.incompleteImplementation.forEach(file => console.log(`   ${file}`));
  totalIssues += issues.hooks.incompleteImplementation.length;
}

if (issues.hooks.missingErrorHandling.length > 0) {
  console.log(`\n⚠️  Missing Error Handling (${issues.hooks.missingErrorHandling.length}):`);
  issues.hooks.missingErrorHandling.forEach(file => console.log(`   ${file}`));
  totalIssues += issues.hooks.missingErrorHandling.length;
}

console.log('\n\n🌐 API ROUTES ANALYSIS:');
console.log('─────────────────────────────────────────────────────────────');

if (issues.apis.missingDbCalls.length > 0) {
  console.log(`\n❌ Missing Database Calls (${issues.apis.missingDbCalls.length}):`);
  issues.apis.missingDbCalls.forEach(file => console.log(`   ${file}`));
  totalIssues += issues.apis.missingDbCalls.length;
}

if (issues.apis.todoComments.length > 0) {
  console.log(`\n⚠️  TODO Comments (${issues.apis.todoComments.length}):`);
  issues.apis.todoComments.forEach(item => console.log(`   ${item.file} (${item.count} TODOs)`));
  totalIssues += issues.apis.todoComments.length;
}

if (issues.apis.mockData.length > 0) {
  console.log(`\n⚠️  Mock Data Found (${issues.apis.mockData.length}):`);
  issues.apis.mockData.forEach(file => console.log(`   ${file}`));
  totalIssues += issues.apis.mockData.length;
}

if (issues.apis.incompleteImplementation.length > 0) {
  console.log(`\n❌ Incomplete Implementation (${issues.apis.incompleteImplementation.length}):`);
  issues.apis.incompleteImplementation.forEach(file => console.log(`   ${file}`));
  totalIssues += issues.apis.incompleteImplementation.length;
}

if (issues.apis.missingValidation.length > 0) {
  console.log(`\n⚠️  Missing Input Validation (${issues.apis.missingValidation.length}):`);
  issues.apis.missingValidation.forEach(file => console.log(`   ${file}`));
  totalIssues += issues.apis.missingValidation.length;
}

if (issues.apis.missingAuth.length > 0) {
  console.log(`\n⚠️  Missing Authentication (${issues.apis.missingAuth.length}):`);
  issues.apis.missingAuth.forEach(file => console.log(`   ${file}`));
  totalIssues += issues.apis.missingAuth.length;
}

console.log('\n═══════════════════════════════════════════════════════════');
console.log(`📊 TOTAL ISSUES: ${totalIssues}`);
console.log('═══════════════════════════════════════════════════════════\n');

if (totalIssues === 0) {
  console.log('✅ All hooks and API endpoints are fully implemented!\n');
  process.exit(0);
} else {
  console.log('❌ Issues found that need to be resolved.\n');
  process.exit(1);
}
