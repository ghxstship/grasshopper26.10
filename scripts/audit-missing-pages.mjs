#!/usr/bin/env node
/**
 * Audit Missing Pages Script
 * Compares DETAILED_SITEMAP.md against actual page files
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const REBUILD_DIR = 'src/app/(rebuild)';

// Define all pages from DETAILED_SITEMAP.md
const REQUIRED_PAGES = {
  public: [
    '/',
    '/about',
    '/pricing',
    '/contact',
    '/terms',
    '/privacy',
    '/security',
    '/blog',
    '/blog/[slug]',
    '/careers',
    '/press',
  ],
  auth: [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
    '/auth/onboarding',
    '/auth/connect-wallet',
  ],
  gvteway_events: [
    '/events',
    '/events/[id]',
    '/events/category/[slug]',
    '/events/venue/[id]',
    '/events/artist/[id]',
    '/events/map',
    '/events/calendar',
    '/events/search',
  ],
  gvteway_tickets: [
    '/tickets',
    '/tickets/[id]',
    '/tickets/transfer/[id]',
    '/tickets/sell/[id]',
    '/tickets/checkout',
    '/tickets/success',
    '/tickets/orders',
    '/tickets/orders/[id]',
  ],
  gvteway_wallet: [
    '/wallet',
    '/wallet/passes',
    '/wallet/nft',
    '/wallet/credentials',
    '/wallet/loyalty',
    '/wallet/apple',
    '/wallet/google',
  ],
  gvteway_marketplace: [
    '/marketplace',
    '/marketplace/products',
    '/marketplace/products/[id]',
    '/marketplace/cart',
    '/marketplace/checkout',
    '/marketplace/orders',
  ],
  gvteway_social: [
    '/social/feed',
    '/social/profile/[username]',
    '/social/profile/edit',
    '/social/post/[id]',
    '/social/following',
    '/social/followers',
    '/social/messages',
    '/social/notifications',
  ],
  gvteway_adventures: [
    '/adventures',
    '/adventures/[id]',
    '/adventures/vip',
    '/adventures/meet-greet',
    '/adventures/tours',
    '/adventures/bookings',
  ],
  gvteway_memberships: [
    '/memberships/tiers',
    '/memberships/join',
    '/memberships/dashboard',
    '/memberships/benefits',
    '/memberships/exclusive',
  ],
  gvteway_analytics: [
    '/analytics/personal',
    '/analytics/events',
    '/analytics/spending',
    '/analytics/recommendations',
  ],
  gvteway_wishlist: [
    '/wishlist/saved',
    '/wishlist/alerts',
  ],
  gvteway_settings: [
    '/settings/account',
    '/settings/profile',
    '/settings/payment',
    '/settings/notifications',
    '/settings/privacy',
    '/settings/security',
  ],
  compvss_auth: [
    '/compvss/auth/login',
    '/compvss/auth/register',
    '/compvss/auth/invite',
    '/compvss/auth/onboarding',
    '/compvss/auth/verify',
  ],
  compvss_dashboard: [
    '/compvss',
    '/compvss/day-of-show',
    '/compvss/tasks',
    '/compvss/schedule',
  ],
  compvss_team: [
    '/compvss/team/directory',
    '/compvss/team/profile/[id]',
    '/compvss/team/members',
    '/compvss/team/roles',
    '/compvss/team/availability',
  ],
  compvss_advancing: [
    '/compvss/advancing',
    '/compvss/advancing/new',
    '/compvss/advancing/requests',
    '/compvss/advancing/requests/[id]',
    '/compvss/advancing/results',
    '/compvss/advancing/access-credentials',
    '/compvss/advancing/site-infrastructure',
    '/compvss/advancing/site-assets',
    '/compvss/advancing/site-utilities',
    '/compvss/advancing/site-vehicles',
    '/compvss/advancing/heavy-equipment',
    '/compvss/advancing/technical-production',
    '/compvss/advancing/hospitality',
    '/compvss/advancing/travel-logistics',
  ],
  compvss_operations: [
    '/compvss/operations/hub',
    '/compvss/operations/checkin',
    '/compvss/operations/tasks',
    '/compvss/operations/schedule',
    '/compvss/operations/map',
    '/compvss/operations/contacts',
  ],
  compvss_qr: [
    '/compvss/qr/hub',
    '/compvss/qr/scan',
    '/compvss/qr/generate',
    '/compvss/qr/history',
    '/compvss/qr/access',
  ],
  compvss_issues: [
    '/compvss/issues',
    '/compvss/issues/new',
    '/compvss/issues/[id]',
    '/compvss/issues/my-issues',
    '/compvss/issues/assigned',
  ],
  compvss_expenses: [
    '/compvss/expenses',
    '/compvss/expenses/new',
    '/compvss/expenses/[id]',
    '/compvss/expenses/submit',
    '/compvss/expenses/history',
    '/compvss/expenses/reimbursements',
  ],
  compvss_affiliates: [
    '/compvss/affiliates',
    '/compvss/affiliates/links',
    '/compvss/affiliates/performance',
    '/compvss/affiliates/commissions',
    '/compvss/affiliates/payouts',
    '/compvss/affiliates/marketing',
  ],
  compvss_referrals: [
    '/compvss/referrals',
    '/compvss/referrals/generate',
    '/compvss/referrals/track',
    '/compvss/referrals/rewards',
    '/compvss/referrals/leaderboard',
  ],
  compvss_credentials: [
    '/compvss/credentials/vault',
    '/compvss/credentials/upload',
    '/compvss/credentials/verify',
    '/compvss/credentials/certifications',
    '/compvss/credentials/background',
  ],
  compvss_settings: [
    '/compvss/settings/account',
    '/compvss/settings/profile',
    '/compvss/settings/notifications',
    '/compvss/settings/security',
  ],
  atlvs_auth: [
    '/atlvs/auth/login',
    '/atlvs/auth/register',
    '/atlvs/auth/invite',
  ],
  atlvs_dashboard: [
    '/atlvs',
    '/atlvs/overview',
    '/atlvs/calendar',
    '/atlvs/analytics',
  ],
  atlvs_projects: [
    '/atlvs/projects',
    '/atlvs/projects/new',
    '/atlvs/projects/[id]',
    '/atlvs/projects/[id]/overview',
    '/atlvs/projects/[id]/timeline',
    '/atlvs/projects/[id]/milestones',
    '/atlvs/projects/[id]/phases',
    '/atlvs/projects/[id]/files',
    '/atlvs/projects/[id]/settings',
  ],
  atlvs_tasks: [
    '/atlvs/tasks/all',
    '/atlvs/tasks/board',
    '/atlvs/tasks/list',
    '/atlvs/tasks/calendar',
    '/atlvs/tasks/[id]',
    '/atlvs/tasks/my-tasks',
    '/atlvs/tasks/assigned',
  ],
  atlvs_teams: [
    '/atlvs/teams',
    '/atlvs/teams/[id]',
    '/atlvs/teams/[id]/members',
    '/atlvs/teams/[id]/roles',
    '/atlvs/teams/[id]/schedule',
    '/atlvs/teams/directory',
    '/atlvs/teams/availability',
    '/atlvs/teams/time-tracking',
  ],
  atlvs_budgets: [
    '/atlvs/budgets',
    '/atlvs/budgets/[id]',
    '/atlvs/budgets/expenses',
    '/atlvs/budgets/forecasting',
    '/atlvs/budgets/variance',
    '/atlvs/budgets/approvals',
    '/atlvs/budgets/reports',
  ],
  atlvs_assets: [
    '/atlvs/assets/inventory',
    '/atlvs/assets/equipment',
    '/atlvs/assets/[id]',
    '/atlvs/assets/bookings',
    '/atlvs/assets/maintenance',
    '/atlvs/assets/vehicles',
    '/atlvs/assets/qr-tracking',
  ],
  atlvs_advancing: [
    '/atlvs/advancing',
    '/atlvs/advancing/requests',
    '/atlvs/advancing/pending',
    '/atlvs/advancing/approved',
    '/atlvs/advancing/[id]',
    '/atlvs/advancing/review',
    '/atlvs/advancing/assign',
    '/atlvs/advancing/results',
    '/atlvs/advancing/analytics',
  ],
  atlvs_documents: [
    '/atlvs/documents/library',
    '/atlvs/documents/contracts',
    '/atlvs/documents/riders',
    '/atlvs/documents/permits',
    '/atlvs/documents/insurance',
    '/atlvs/documents/[id]',
    '/atlvs/documents/templates',
    '/atlvs/documents/versions',
  ],
  atlvs_n8n: [
    '/atlvs/n8n/hub',
    '/atlvs/n8n/workflows',
    '/atlvs/n8n/new',
    '/atlvs/n8n/[id]',
    '/atlvs/n8n/edit/[id]',
    '/atlvs/n8n/executions',
    '/atlvs/n8n/templates',
    '/atlvs/n8n/credentials',
    '/atlvs/n8n/webhooks',
  ],
  atlvs_vendors: [
    '/atlvs/vendors/directory',
    '/atlvs/vendors/[id]',
    '/atlvs/vendors/contracts',
    '/atlvs/vendors/performance',
  ],
  atlvs_analytics: [
    '/atlvs/analytics/hub',
    '/atlvs/analytics/projects',
    '/atlvs/analytics/budgets',
    '/atlvs/analytics/teams',
    '/atlvs/analytics/advancing',
    '/atlvs/analytics/reports',
    '/atlvs/analytics/scheduled',
  ],
  atlvs_settings: [
    '/atlvs/settings/organization',
    '/atlvs/settings/users',
    '/atlvs/settings/roles',
    '/atlvs/settings/permissions',
    '/atlvs/settings/integrations',
    '/atlvs/settings/billing',
    '/atlvs/settings/security',
    '/atlvs/settings/audit-log',
    '/atlvs/settings/api-keys',
  ],
};

function routeToFilePath(route) {
  if (route === '/') return join(REBUILD_DIR, 'page.tsx');
  return join(REBUILD_DIR, route.slice(1), 'page.tsx');
}

function checkPages() {
  const missing = [];
  const existing = [];
  
  for (const [category, routes] of Object.entries(REQUIRED_PAGES)) {
    for (const route of routes) {
      const filePath = routeToFilePath(route);
      if (existsSync(filePath)) {
        existing.push({ category, route, filePath });
      } else {
        missing.push({ category, route, filePath });
      }
    }
  }
  
  return { missing, existing };
}

const { missing, existing } = checkPages();

console.log('\n=== PAGE AUDIT RESULTS ===\n');
console.log(`✅ Existing Pages: ${existing.length}`);
console.log(`❌ Missing Pages: ${missing.length}`);
console.log(`📊 Total Required: ${existing.length + missing.length}`);
console.log(`📈 Completion: ${((existing.length / (existing.length + missing.length)) * 100).toFixed(1)}%\n`);

if (missing.length > 0) {
  console.log('=== MISSING PAGES BY CATEGORY ===\n');
  
  const byCategory = {};
  for (const item of missing) {
    if (!byCategory[item.category]) {
      byCategory[item.category] = [];
    }
    byCategory[item.category].push(item.route);
  }
  
  for (const [category, routes] of Object.entries(byCategory)) {
    console.log(`\n${category.toUpperCase()} (${routes.length} missing):`);
    routes.forEach(route => console.log(`  - ${route}`));
  }
}

console.log('\n');
