#!/usr/bin/env node
/**
 * Generate Missing API Endpoints
 * Creates all missing endpoint files with proper structure
 */

import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');
const API_DIR = join(ROOT_DIR, 'src/app/api');

const MISSING_ENDPOINTS = [
  '/wallet/apple',
  '/wallet/google',
  '/social/profile',
  '/social/profile/update',
  '/social/notifications',
  '/memberships/join',
  '/memberships/dashboard',
  '/memberships/benefits',
  '/memberships/exclusive',
  '/adventures/vip',
  '/adventures/meet-greet',
  '/adventures/tours',
  '/adventures/bookings',
  '/analytics/events',
  '/analytics/spending',
  '/analytics/recommendations',
  '/wishlist/saved',
  '/wishlist/alerts',
  '/settings/profile',
  '/settings/notifications',
  '/settings/security',
  '/compvss/advancing/access-credentials',
  '/compvss/advancing/site-infrastructure',
  '/compvss/advancing/site-assets',
  '/compvss/advancing/site-utilities',
  '/compvss/advancing/site-vehicles',
  '/compvss/advancing/heavy-equipment',
  '/compvss/advancing/technical-production',
  '/compvss/advancing/hospitality',
  '/compvss/advancing/travel-logistics',
  '/compvss/operations/hub',
  '/compvss/operations/checkin',
  '/compvss/operations/map',
  '/compvss/operations/contacts',
  '/compvss/qr/hub',
  '/compvss/qr/history',
  '/compvss/qr/access',
  '/compvss/credentials/vault',
  '/compvss/credentials/upload',
  '/compvss/credentials/verify',
  '/compvss/credentials/certifications',
  '/compvss/credentials/background',
  '/atlvs/documents/library',
  '/atlvs/documents/contracts',
  '/atlvs/documents/riders',
  '/atlvs/documents/permits',
  '/atlvs/documents/insurance',
  '/atlvs/documents/templates',
  '/atlvs/documents/versions',
  '/atlvs/n8n/hub',
  '/atlvs/n8n/workflows',
  '/atlvs/n8n/executions',
  '/atlvs/n8n/templates',
  '/atlvs/n8n/credentials',
  '/atlvs/n8n/webhooks',
  '/atlvs/analytics/hub',
  '/atlvs/analytics/projects',
  '/atlvs/analytics/budgets',
  '/atlvs/analytics/teams',
  '/atlvs/analytics/advancing',
  '/atlvs/analytics/scheduled',
];

function generateEndpointTemplate(endpoint) {
  const requiresAuth = !endpoint.includes('/public');
  const isWrite = endpoint.includes('/update') || endpoint.includes('/create') || endpoint.includes('/upload');
  
  return `import { NextRequest } from 'next/server';
import { successResponse, createdResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

// GET ${endpoint}
export async function GET(request: NextRequest) {
  try {
    ${requiresAuth ? `const context = await validateRequest(request);
    requireAuth(context);

    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.PUBLIC_ENDPOINT.limit,
      RATE_LIMITS.PUBLIC_ENDPOINT.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }` : `if (!rateLimit(
      RateLimitIdentifiers.byIP('unknown'),
      RATE_LIMITS.PUBLIC_ENDPOINT.limit,
      RATE_LIMITS.PUBLIC_ENDPOINT.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }`}

    // TODO: Implement query logic
    const data = {};

    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}
${isWrite ? `
// POST ${endpoint}
export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.WRITE_OPERATIONS.limit,
      RATE_LIMITS.WRITE_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const body = await request.json();
    
    // TODO: Implement create/update logic
    const result = {};

    return createdResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}` : ''}
`;
}

function createEndpoint(endpoint) {
  const filePath = join(API_DIR, endpoint, 'route.ts');
  const dirPath = dirname(filePath);
  
  if (existsSync(filePath)) {
    console.log(`⏭️  Skipping ${endpoint} (already exists)`);
    return false;
  }
  
  mkdirSync(dirPath, { recursive: true });
  const content = generateEndpointTemplate(endpoint);
  writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Created ${endpoint}`);
  return true;
}

console.log('\n=== GENERATING MISSING ENDPOINTS ===\n');

let created = 0;
let skipped = 0;

for (const endpoint of MISSING_ENDPOINTS) {
  if (createEndpoint(endpoint)) {
    created++;
  } else {
    skipped++;
  }
}

console.log(`\n=== GENERATION COMPLETE ===`);
console.log(`✅ Created: ${created} endpoints`);
console.log(`⏭️  Skipped: ${skipped} endpoints`);
console.log(`📊 Total: ${created + skipped} endpoints\n`);
