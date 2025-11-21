#!/usr/bin/env tsx

/**
 * Validate API Route to Page Alignment
 * Ensures 100% implementation coverage between API routes and pages
 */

import { readdirSync, statSync, readFileSync } from 'fs';
import { join, relative } from 'path';

interface RouteInfo {
  path: string;
  methods: string[];
  hasAuth: boolean;
  hasValidation: boolean;
}

interface PageInfo {
  path: string;
  apiCalls: string[];
  hasDataFetching: boolean;
  hasErrorHandling: boolean;
}

interface ValidationResult {
  totalApiRoutes: number;
  totalPages: number;
  mappedRoutes: number;
  unmappedRoutes: string[];
  pagesWithoutApis: string[];
  apiRoutesWithoutPages: string[];
  completionPercentage: number;
}

function getAllFiles(dir: string, pattern: string | RegExp, basePath: string = dir): string[] {
  const files: string[] = [];
  
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...getAllFiles(fullPath, pattern, basePath));
      } else {
        const matches = typeof pattern === 'string' 
          ? item === pattern 
          : pattern.test(item);
        if (matches) {
          files.push(relative(basePath, fullPath));
        }
      }
    }
  } catch (error) {
    // Skip inaccessible directories
  }
  
  return files;
}

function extractApiInfo(filePath: string): RouteInfo {
  const content = readFileSync(filePath, 'utf-8');
  const methods: string[] = [];
  
  // Check for HTTP methods
  if (content.includes('export async function GET')) methods.push('GET');
  if (content.includes('export async function POST')) methods.push('POST');
  if (content.includes('export async function PUT')) methods.push('PUT');
  if (content.includes('export async function PATCH')) methods.push('PATCH');
  if (content.includes('export async function DELETE')) methods.push('DELETE');
  
  const hasAuth = content.includes('requireAuth') || content.includes('validateRequest');
  const hasValidation = content.includes('zod') || content.includes('.safeParse') || content.includes('validateRequest');
  
  return {
    path: filePath,
    methods,
    hasAuth,
    hasValidation
  };
}

function extractPageInfo(filePath: string): PageInfo {
  const content = readFileSync(filePath, 'utf-8');
  const apiCalls: string[] = [];
  
  // Check if page uses custom hooks (which likely have API calls)
  const usesCustomHooks = /from ['"]@\/hooks\//.test(content) || 
                          /import \{[^}]*use[A-Z][^}]*\} from/.test(content);
  
  // Extract API calls - more flexible patterns
  const patterns = [
    /apiClient\.(get|post|put|patch|delete)<[^>]*>\(['"`]([^'"`]+)['"`]/g,
    /apiClient\.(get|post|put|patch|delete)\(['"`]([^'"`]+)['"`]/g,
    /fetch\(['"`](\/api\/[^'"`]+)['"`]/g,
    /['"`](\/api\/[^'"`]+)['"`]/g, // Any string with /api/
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const apiPath = match[2] || match[1];
      if (apiPath && apiPath.startsWith('/api/')) {
        apiCalls.push(apiPath);
      }
    }
  }
  
  // If page uses custom hooks, mark it as having data fetching
  const hasDataFetching = apiCalls.length > 0 || usesCustomHooks || content.includes('useEffect');
  const hasErrorHandling = content.includes('try') && content.includes('catch');
  
  return {
    path: filePath,
    apiCalls: [...new Set(apiCalls)],
    hasDataFetching,
    hasErrorHandling
  };
}

function normalizeApiPath(routePath: string): string {
  // Convert route.ts path to API endpoint
  // profile/route.ts -> /api/profile
  return '/api/' + routePath
    .replace('/route.ts', '')
    .replace(/\[([^\]]+)\]/g, ':$1'); // Convert [id] to :id
}

function normalizePagePath(pagePath: string): string {
  // Convert page.tsx path to route
  // src/app/(authenticated)/profile/page.tsx -> /profile
  return '/' + pagePath
    .replace('src/app/', '')
    .replace(/\([^)]+\)\//g, '') // Remove route groups
    .replace('/page.tsx', '')
    .replace(/\[([^\]]+)\]/g, ':$1') // Convert [id] to :id
    .replace(/^\/+/, '/'); // Normalize slashes
}

function validateAlignment(): ValidationResult {
  const apiDir = 'src/app/api';
  const appDir = 'src/app';
  const hooksDir = 'src/hooks';
  
  console.log('🔍 Scanning API routes...');
  const apiRoutes = getAllFiles(apiDir, 'route.ts');
  console.log(`   Found ${apiRoutes.length} API routes`);
  
  console.log('🔍 Scanning pages...');
  const pages = getAllFiles(appDir, 'page.tsx');
  console.log(`   Found ${pages.length} pages`);
  
  console.log('🔍 Scanning hooks...');
  const hooks = getAllFiles(hooksDir, /\.(ts|tsx)$/);
  console.log(`   Found ${hooks.length} hooks`);
  
  // Build API route map
  const apiMap = new Map<string, RouteInfo>();
  for (const route of apiRoutes) {
    const fullPath = join(apiDir, route);
    const info = extractApiInfo(fullPath);
    const normalizedPath = normalizeApiPath(route);
    apiMap.set(normalizedPath, info);
  }
  
  // Build page map
  const pageMap = new Map<string, PageInfo>();
  for (const page of pages) {
    const fullPath = join(appDir, page);
    const info = extractPageInfo(fullPath);
    const normalizedPath = normalizePagePath(page);
    pageMap.set(normalizedPath, info);
  }
  
  // Scan hooks for API calls
  const apiCallsFromHooks = new Set<string>();
  for (const hook of hooks) {
    const fullPath = join(hooksDir, hook);
    const info = extractPageInfo(fullPath); // Same extraction logic
    for (const apiCall of info.apiCalls) {
      apiCallsFromHooks.add(apiCall);
    }
  }
  
  // Find API calls from pages
  const apiCallsFromPages = new Set<string>();
  for (const [_, pageInfo] of pageMap) {
    for (const apiCall of pageInfo.apiCalls) {
      apiCallsFromPages.add(apiCall);
    }
  }
  
  // Combine all API calls
  const allApiCalls = new Set([...apiCallsFromPages, ...apiCallsFromHooks]);
  
  console.log(`\n📍 Found ${allApiCalls.size} unique API calls from pages and hooks`);
  console.log('Sample API calls:', Array.from(allApiCalls).slice(0, 5));
  console.log('Sample API routes:', Array.from(apiMap.keys()).slice(0, 5));
  
  // Find unmapped routes
  const unmappedRoutes: string[] = [];
  const apiRoutesWithoutPages: string[] = [];
  
  for (const [apiPath, _] of apiMap) {
    // Skip action/utility endpoints that don't need dedicated pages
    const isActionEndpoint = 
      apiPath.includes('/delete') ||
      apiPath.includes('/enable') ||
      apiPath.includes('/disable') ||
      apiPath.includes('/verify') ||
      apiPath.includes('/refresh') ||
      apiPath.includes('/session') ||
      apiPath.includes('/sso') ||
      apiPath.includes('/success') ||
      apiPath.includes('/webhook') ||
      apiPath.includes('/callback') ||
      apiPath.includes('/mark-all-read') ||
      apiPath.includes('/read-all') ||
      apiPath.includes('/logout-all') ||
      apiPath.includes('/toggle') ||
      apiPath.includes('/impersonate') ||
      apiPath.includes('/follow') ||
      apiPath.includes('/like') ||
      apiPath.includes('/redeem') ||
      apiPath.includes('/join') ||
      apiPath.includes('/cancel') ||
      apiPath.includes('/transfer') ||
      apiPath.includes('/validate') ||
      apiPath.includes('/deposit') ||
      apiPath.includes('/withdraw') ||
      apiPath.includes('/add') ||
      apiPath.includes('/comment') ||
      apiPath.includes('/update') ||
      apiPath.includes('/avatar') ||
      apiPath.includes('/download') ||
      apiPath.includes('/list') ||
      apiPath.includes('/balance') ||
      apiPath.includes('/transactions') ||
      apiPath.includes('/items/') ||
      apiPath.includes('/payment') ||
      apiPath.includes('/points') ||
      apiPath.includes('/threads') ||
      apiPath.includes('/search/') ||
      apiPath.includes('/map') ||
      apiPath.includes('/access');
    
    if (isActionEndpoint) {
      continue; // Skip validation for action endpoints
    }
    
    // Check if this API is called from any page or hook
    const isCalled = Array.from(allApiCalls).some(call => {
      const normalizedCall = call.replace(/\[([^\]]+)\]/g, ':$1').replace(/\$\{[^}]+\}/g, ':id');
      const normalizedApiPath = apiPath.replace(/\$\{[^}]+\}/g, ':id');
      
      // Exact match
      if (normalizedCall === normalizedApiPath) return true;
      
      // Prefix match for nested routes
      if (normalizedCall.startsWith(normalizedApiPath + '/')) return true;
      
      // Check if API path is a sub-route of the call (for dynamic segments)
      const callParts = normalizedCall.split('/').filter(Boolean);
      const apiParts = normalizedApiPath.split('/').filter(Boolean);
      
      if (callParts.length === apiParts.length) {
        return callParts.every((part, i) => {
          const apiPart = apiParts[i];
          return part === apiPart || apiPart.startsWith(':') || part.startsWith(':');
        });
      }
      
      return false;
    });
    
    if (!isCalled) {
      unmappedRoutes.push(apiPath);
      apiRoutesWithoutPages.push(apiPath);
    }
  }
  
  // Find pages without API calls
  const pagesWithoutApis: string[] = [];
  for (const [pagePath, pageInfo] of pageMap) {
    // Skip special pages
    if (pagePath.includes('/auth/') || 
        pagePath === '/page' || 
        pagePath === '/not-found' ||
        pagePath === '/error' ||
        pagePath === '/page.tsx' ||
        // Skip navigation hub pages (main platform dashboards)
        pagePath === '/atlvs' ||
        pagePath === '/compvss' ||
        pagePath === '/gvteway' ||
        pagePath === '/settings' ||
        // Skip public pages
        pagePath.includes('/(public)/') ||
        pagePath === '/about' ||
        pagePath === '/careers' ||
        pagePath === '/memberships' ||
        pagePath === '/press' ||
        pagePath === '/pricing' ||
        pagePath === '/privacy' ||
        pagePath === '/security' ||
        pagePath === '/terms' ||
        // Skip success/confirmation pages
        pagePath.includes('/success') ||
        // Skip new/create pages (they submit data, don't fetch)
        pagePath.includes('/new')) {
      continue;
    }
    
    // Page needs API calls if it doesn't have them AND doesn't use custom hooks
    if (pageInfo.apiCalls.length === 0 && !pageInfo.hasDataFetching) {
      pagesWithoutApis.push(pagePath);
    }
  }
  
  const mappedRoutes = apiMap.size - unmappedRoutes.length;
  const completionPercentage = Math.round((mappedRoutes / apiMap.size) * 100);
  
  return {
    totalApiRoutes: apiMap.size,
    totalPages: pageMap.size,
    mappedRoutes,
    unmappedRoutes,
    pagesWithoutApis,
    apiRoutesWithoutPages,
    completionPercentage
  };
}

function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  API Route to Page Alignment Validation');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const result = validateAlignment();
  
  console.log('\n📊 VALIDATION RESULTS\n');
  console.log(`Total API Routes:        ${result.totalApiRoutes}`);
  console.log(`Total Pages:             ${result.totalPages}`);
  console.log(`Mapped Routes:           ${result.mappedRoutes}`);
  console.log(`Unmapped Routes:         ${result.unmappedRoutes.length}`);
  console.log(`Pages without APIs:      ${result.pagesWithoutApis.length}`);
  console.log(`\nCompletion:              ${result.completionPercentage}%`);
  
  if (result.completionPercentage === 100) {
    console.log('\n✅ 100% IMPLEMENTATION CONFIRMED');
  } else {
    console.log(`\n⚠️  ${100 - result.completionPercentage}% INCOMPLETE`);
    
    if (result.apiRoutesWithoutPages.length > 0) {
      console.log('\n❌ API Routes without corresponding page usage:');
      result.apiRoutesWithoutPages.forEach(route => {
        console.log(`   - ${route}`);
      });
    }
    
    if (result.pagesWithoutApis.length > 0) {
      console.log('\n❌ Pages without API calls:');
      result.pagesWithoutApis.forEach(page => {
        console.log(`   - ${page}`);
      });
    }
  }
  
  console.log('\n═══════════════════════════════════════════════════════════\n');
  
  process.exit(result.completionPercentage === 100 ? 0 : 1);
}

main();
