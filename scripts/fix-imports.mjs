#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Map of files that need z import
const filesNeedingZod = [
  'src/app/api/account/delete/route.ts',
  'src/app/api/atlvs/advancing/[id]/comments/route.ts',
  'src/app/api/atlvs/advancing/[id]/route.ts',
  'src/app/api/atlvs/advancing/[id]/status/route.ts',
  'src/app/api/atlvs/inventory/route.ts',
  'src/app/api/atlvs/kpi/event/[eventId]/route.ts',
  'src/app/api/atlvs/kpi/marketing/[eventId]/route.ts',
  'src/app/api/atlvs/maintenance/route.ts',
  'src/app/api/atlvs/opportunities/[id]/applications/route.ts',
  'src/app/api/atlvs/opportunities/[id]/route.ts',
  'src/app/api/atlvs/opportunities/route.ts',
  'src/app/api/atlvs/projects/route.ts',
  'src/app/api/atlvs/settings/route.ts',
  'src/app/api/atlvs/workflows/route.ts',
  'src/app/api/auth/refresh/route.ts',
  'src/app/api/batch/emails/route.ts',
  'src/app/api/batch/notifications/route.ts',
  'src/app/api/batch/qr-codes/route.ts',
  'src/app/api/compvss/affiliates/route.ts',
  'src/app/api/compvss/applications/route.ts',
  'src/app/api/compvss/assets/checkout/route.ts',
  'src/app/api/compvss/assets/route.ts',
  'src/app/api/compvss/documents/route.ts',
  'src/app/api/events/stream/route.ts',
  'src/app/api/integrations/push/route.ts',
  'src/app/api/integrations/slack/route.ts',
  'src/app/api/profile/route.ts',
  'src/app/api/social/follow/route.ts',
  'src/app/api/spotify/artists/[id]/route.ts',
  'src/app/api/tickets/purchase/route.ts',
  'src/app/api/wishlists/route.ts',
];

// Map of files that need prisma import
const filesNeedingPrisma = [
  'src/app/api/account/delete/route.ts',
  'src/app/api/adventures/[id]/book/route.ts',
  'src/app/api/adventures/route.ts',
  'src/app/api/alerts/route.ts',
  'src/app/api/artists/[id]/route.ts',
  'src/app/api/artists/route.ts',
  'src/app/api/atlvs/advancing/[id]/route.ts',
  'src/app/api/atlvs/analytics/insights/route.ts',
  'src/app/api/atlvs/automation/route.ts',
  'src/app/api/atlvs/budgets/route.ts',
  'src/app/api/atlvs/equipment/route.ts',
  'src/app/api/atlvs/inventory/route.ts',
  'src/app/api/atlvs/maintenance/route.ts',
  'src/app/api/atlvs/projects/route.ts',
  'src/app/api/atlvs/tasks/route.ts',
  'src/app/api/atlvs/teams/route.ts',
  'src/app/api/atlvs/workflows/route.ts',
  'src/app/api/auth/[...nextauth]/route.ts',
  'src/app/api/auth/forgot-password/route.ts',
  'src/app/api/auth/login/route.ts',
  'src/app/api/auth/logout/route.ts',
  'src/app/api/auth/me/route.ts',
  'src/app/api/auth/refresh-token/route.ts',
  'src/app/api/auth/refresh/route.ts',
  'src/app/api/auth/register/route.ts',
  'src/app/api/auth/resend-verification/route.ts',
  'src/app/api/auth/reset-password/route.ts',
  'src/app/api/auth/session/route.ts',
  'src/app/api/auth/verify-email/route.ts',
  'src/app/api/auth/wallet/route.ts',
  'src/app/api/batch/qr-codes/route.ts',
  'src/app/api/cart/items/route.ts',
  'src/app/api/compvss/advancing/route.ts',
  'src/app/api/compvss/affiliates/route.ts',
  'src/app/api/compvss/assets/checkout/route.ts',
  'src/app/api/compvss/assets/route.ts',
  'src/app/api/compvss/documents/route.ts',
  'src/app/api/compvss/expenses/route.ts',
  'src/app/api/compvss/issues/route.ts',
  'src/app/api/compvss/tasks/route.ts',
  'src/app/api/crypto/payment/route.ts',
  'src/app/api/events/featured/route.ts',
  'src/app/api/events/route.ts',
  'src/app/api/memberships/me/route.ts',
  'src/app/api/memberships/tiers/route.ts',
  'src/app/api/nft/mint/route.ts',
  'src/app/api/notifications/route.ts',
  'src/app/api/orders/route.ts',
  'src/app/api/organizations/route.ts',
  'src/app/api/products/route.ts',
  'src/app/api/profile/settings/route.ts',
  'src/app/api/social/follow/route.ts',
  'src/app/api/social/posts/[id]/comments/route.ts',
  'src/app/api/social/posts/[id]/like/route.ts',
  'src/app/api/social/posts/route.ts',
  'src/app/api/sync/compvss-to-atlvs/route.ts',
  'src/app/api/sync/gvteway-to-atlvs/route.ts',
  'src/app/api/tickets/[id]/route.ts',
  'src/app/api/tickets/[id]/validate/route.ts',
  'src/app/api/tickets/purchase/route.ts',
  'src/app/api/tickets/route.ts',
  'src/app/api/tickets/validate/route.ts',
  'src/app/api/venues/[id]/route.ts',
  'src/app/api/venues/route.ts',
  'src/app/api/webhooks/stripe/route.ts',
];

// Files needing getClientIdentifier
const filesNeedingGetClientIdentifier = [
  'src/app/api/adventures/route.ts',
  'src/app/api/artists/route.ts',
  'src/app/api/auth/forgot-password/route.ts',
  'src/app/api/auth/login/route.ts',
  'src/app/api/auth/register/route.ts',
  'src/app/api/auth/reset-password/route.ts',
  'src/app/api/events/featured/route.ts',
  'src/app/api/events/route.ts',
  'src/app/api/social/posts/[id]/route.ts',
  'src/app/api/webhooks/n8n/events/route.ts',
];

// Files needing rate limit imports
const filesNeedingRateLimit = [
  'src/app/api/atlvs/kpi/event/[eventId]/route.ts',
  'src/app/api/atlvs/kpi/marketing/[eventId]/route.ts',
  'src/app/api/webhooks/sendgrid/route.ts',
  'src/app/api/webhooks/twilio/route.ts',
];

function addImportIfMissing(content, importStatement) {
  if (content.includes(importStatement)) {
    return content;
  }
  
  // Find the last import statement
  const lines = content.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ') || lines[i].trim().startsWith('import{')) {
      lastImportIndex = i;
    } else if (lastImportIndex !== -1 && lines[i].trim() === '') {
      break;
    }
  }
  
  if (lastImportIndex === -1) {
    // No imports found, add at the beginning
    return importStatement + '\n' + content;
  }
  
  // Insert after the last import
  lines.splice(lastImportIndex + 1, 0, importStatement);
  return lines.join('\n');
}

function fixFile(filePath, fixes) {
  const fullPath = path.join(rootDir, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  let modified = false;
  
  for (const importStatement of fixes) {
    const newContent = addImportIfMissing(content, importStatement);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  
  return false;
}

let fixedCount = 0;

// Fix zod imports
console.log('\n📦 Adding zod imports...');
for (const file of filesNeedingZod) {
  if (fixFile(file, ["import { z } from 'zod';"])) {
    fixedCount++;
  }
}

// Fix prisma imports
console.log('\n📦 Adding prisma imports...');
for (const file of filesNeedingPrisma) {
  if (fixFile(file, ["import { prisma } from '@/lib/prisma';"])) {
    fixedCount++;
  }
}

// Fix getClientIdentifier imports
console.log('\n📦 Adding getClientIdentifier imports...');
for (const file of filesNeedingGetClientIdentifier) {
  if (fixFile(file, ["import { getClientIdentifier } from '@/lib/api/middleware';"])) {
    fixedCount++;
  }
}

// Fix rate limit imports
console.log('\n📦 Adding rate limit imports...');
for (const file of filesNeedingRateLimit) {
  if (fixFile(file, [
    "import { rateLimit, requireAuth } from '@/lib/api/middleware';",
    "import { RateLimitIdentifiers, RATE_LIMITS } from '@/lib/api/rate-limits';"
  ])) {
    fixedCount++;
  }
}

console.log(`\n✨ Fixed ${fixedCount} files`);
