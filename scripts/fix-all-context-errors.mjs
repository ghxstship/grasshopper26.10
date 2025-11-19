#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const files = [
  "src/app/api/auth/logout/route.ts",
  "src/app/api/auth/me/route.ts",
  "src/app/api/auth/resend-verification/route.ts",
  "src/app/api/auth/session/route.ts",
  "src/app/api/compvss/advancing/access/route.ts",
  "src/app/api/compvss/advancing/accommodation/route.ts",
  "src/app/api/compvss/advancing/hospitality/route.ts",
  "src/app/api/compvss/advancing/marketing/route.ts",
  "src/app/api/compvss/advancing/permits/route.ts",
  "src/app/api/compvss/advancing/security/route.ts",
  "src/app/api/compvss/advancing/staffing/route.ts",
  "src/app/api/compvss/advancing/technical/route.ts",
  "src/app/api/compvss/advancing/transportation/route.ts",
  "src/app/api/compvss/advancing/travel/route.ts",
  "src/app/api/compvss/checkin/route.ts",
  "src/app/api/compvss/expenses/route.ts",
  "src/app/api/compvss/issues/route.ts",
  "src/app/api/compvss/qr/generate/route.ts",
  "src/app/api/compvss/qr/scan/route.ts",
  "src/app/api/compvss/teams/route.ts",
  "src/app/api/crypto/payment/route.ts",
  "src/app/api/memberships/cancel/route.ts",
  "src/app/api/memberships/me/route.ts",
  "src/app/api/memberships/subscribe/route.ts",
  "src/app/api/memberships/tiers/route.ts",
  "src/app/api/notifications/mark-all-read/route.ts",
  "src/app/api/notifications/route.ts",
  "src/app/api/organizations/route.ts",
  "src/app/api/products/route.ts",
  "src/app/api/profile/avatar/route.ts",
  "src/app/api/profile/settings/route.ts",
  "src/app/api/search/users/route.ts",
  "src/app/api/storage/delete/route.ts",
  "src/app/api/storage/download/route.ts",
  "src/app/api/storage/list/route.ts",
  "src/app/api/tickets/route.ts",
  "src/app/api/tickets/validate/route.ts",
  "src/app/api/upload/[id]/route.ts",
  "src/app/api/upload/multiple/route.ts",
  "src/app/api/upload/route.ts",
  "src/app/api/venues/route.ts",
  "src/app/api/wishlists/route.ts"
];

let fixed = 0;
let errors = 0;

for (const file of files) {
  try {
    let content = readFileSync(file, 'utf-8');
    let modified = false;
    
    // Pattern: Find rate limiting block that uses context.userId before declaration
    // Replace with context declaration first, then rate limiting
    const pattern = /(\s+)(\/\/ Rate limiting\s+if \(\s+!rateLimit\(\s+RateLimitIdentifiers\.byUserId\(context\.userId\),[\s\S]*?\}\s+\}\s+)(const context = await validateRequest\(request\);\s+requireAuth\(context\);)/g;
    
    if (pattern.test(content)) {
      content = content.replace(pattern, (match, indent, rateLimitBlock, contextDecl) => {
        return `${indent}${contextDecl}\n\n${indent}${rateLimitBlock}`;
      });
      modified = true;
    }
    
    if (modified) {
      writeFileSync(file, content);
      console.log(`✓ Fixed: ${file}`);
      fixed++;
    } else {
      console.log(`  Skipped (no match): ${file}`);
    }
  } catch (err) {
    console.error(`✗ Error in ${file}:`, err.message);
    errors++;
  }
}

console.log(`\nSummary: Fixed ${fixed} files, ${errors} errors`);
