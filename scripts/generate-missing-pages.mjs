#!/usr/bin/env node
/**
 * Generate Missing Pages Script
 * Creates all missing page files with proper UI structure
 */

import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');
const REBUILD_DIR = join(ROOT_DIR, 'src/app/(rebuild)');

const MISSING_PAGES = [
  // Public & Auth
  { route: '/blog/[slug]', title: 'Blog Post', variant: 'default' },
  { route: '/auth/connect-wallet', title: 'Connect Wallet', variant: 'gvteway' },
  
  // GVTEWAY Events
  { route: '/events/search', title: 'Search Events', variant: 'gvteway' },
  
  // GVTEWAY Tickets
  { route: '/tickets/sell/[id]', title: 'Sell Ticket', variant: 'gvteway' },
  { route: '/tickets/checkout', title: 'Checkout', variant: 'gvteway' },
  { route: '/tickets/success', title: 'Purchase Successful', variant: 'gvteway' },
  { route: '/tickets/orders', title: 'Order History', variant: 'gvteway' },
  { route: '/tickets/orders/[id]', title: 'Order Details', variant: 'gvteway' },
  
  // GVTEWAY Wallet
  { route: '/wallet/passes', title: 'Digital Passes', variant: 'gvteway' },
  { route: '/wallet/nft', title: 'NFT Collection', variant: 'gvteway' },
  { route: '/wallet/credentials', title: 'Credentials', variant: 'gvteway' },
  { route: '/wallet/loyalty', title: 'Loyalty Points', variant: 'gvteway' },
  { route: '/wallet/apple', title: 'Apple Wallet', variant: 'gvteway' },
  { route: '/wallet/google', title: 'Google Wallet', variant: 'gvteway' },
  
  // GVTEWAY Marketplace
  { route: '/marketplace/products', title: 'Products', variant: 'gvteway' },
  { route: '/marketplace/products/[id]', title: 'Product Details', variant: 'gvteway' },
  { route: '/marketplace/cart', title: 'Shopping Cart', variant: 'gvteway' },
  { route: '/marketplace/checkout', title: 'Checkout', variant: 'gvteway' },
  { route: '/marketplace/orders', title: 'Orders', variant: 'gvteway' },
  
  // GVTEWAY Social
  { route: '/social/feed', title: 'Social Feed', variant: 'gvteway' },
  { route: '/social/profile/[username]', title: 'User Profile', variant: 'gvteway' },
  { route: '/social/profile/edit', title: 'Edit Profile', variant: 'gvteway' },
  { route: '/social/post/[id]', title: 'Post Details', variant: 'gvteway' },
  { route: '/social/notifications', title: 'Notifications', variant: 'gvteway' },
  
  // GVTEWAY Adventures
  { route: '/adventures/vip', title: 'VIP Experiences', variant: 'gvteway' },
  { route: '/adventures/meet-greet', title: 'Meet & Greets', variant: 'gvteway' },
  { route: '/adventures/tours', title: 'Tours', variant: 'gvteway' },
  { route: '/adventures/bookings', title: 'My Bookings', variant: 'gvteway' },
  
  // GVTEWAY Memberships
  { route: '/memberships/tiers', title: 'Membership Tiers', variant: 'gvteway' },
  { route: '/memberships/join', title: 'Join Membership', variant: 'gvteway' },
  { route: '/memberships/dashboard', title: 'Member Dashboard', variant: 'gvteway' },
  { route: '/memberships/benefits', title: 'Benefits', variant: 'gvteway' },
  { route: '/memberships/exclusive', title: 'Exclusive Content', variant: 'gvteway' },
  
  // GVTEWAY Analytics
  { route: '/analytics/events', title: 'Event History', variant: 'gvteway' },
  { route: '/analytics/spending', title: 'Spending Insights', variant: 'gvteway' },
  { route: '/analytics/recommendations', title: 'Recommendations', variant: 'gvteway' },
  
  // GVTEWAY Wishlist
  { route: '/wishlist/saved', title: 'Saved Events', variant: 'gvteway' },
  { route: '/wishlist/alerts', title: 'Price Alerts', variant: 'gvteway' },
  
  // GVTEWAY Settings
  { route: '/settings/profile', title: 'Profile Settings', variant: 'default' },
  { route: '/settings/notifications', title: 'Notification Settings', variant: 'default' },
  { route: '/settings/security', title: 'Security Settings', variant: 'default' },
  
  // COMPVSS Auth
  { route: '/compvss/auth/login', title: 'Login', variant: 'compvss' },
  { route: '/compvss/auth/register', title: 'Register', variant: 'compvss' },
  { route: '/compvss/auth/invite', title: 'Accept Invite', variant: 'compvss' },
  { route: '/compvss/auth/onboarding', title: 'Onboarding', variant: 'compvss' },
  { route: '/compvss/auth/verify', title: 'Verify Account', variant: 'compvss' },
  
  // COMPVSS Dashboard
  { route: '/compvss/day-of-show', title: 'Day of Show', variant: 'compvss' },
  
  // COMPVSS Team
  { route: '/compvss/team/directory', title: 'Team Directory', variant: 'compvss' },
  { route: '/compvss/team/profile/[id]', title: 'Team Member Profile', variant: 'compvss' },
  { route: '/compvss/team/members', title: 'Team Members', variant: 'compvss' },
  { route: '/compvss/team/roles', title: 'Roles', variant: 'compvss' },
  { route: '/compvss/team/availability', title: 'Availability', variant: 'compvss' },
  
  // COMPVSS Advancing
  { route: '/compvss/advancing/new', title: 'New Request', variant: 'compvss' },
  { route: '/compvss/advancing/requests', title: 'My Requests', variant: 'compvss' },
  { route: '/compvss/advancing/requests/[id]', title: 'Request Details', variant: 'compvss' },
  { route: '/compvss/advancing/results', title: 'Results', variant: 'compvss' },
  { route: '/compvss/advancing/access-credentials', title: 'Access & Credentials', variant: 'compvss' },
  { route: '/compvss/advancing/site-infrastructure', title: 'Site Infrastructure', variant: 'compvss' },
  { route: '/compvss/advancing/site-assets', title: 'Site Assets', variant: 'compvss' },
  { route: '/compvss/advancing/site-utilities', title: 'Site Utilities', variant: 'compvss' },
  { route: '/compvss/advancing/site-vehicles', title: 'Site Vehicles', variant: 'compvss' },
  { route: '/compvss/advancing/heavy-equipment', title: 'Heavy Equipment', variant: 'compvss' },
  { route: '/compvss/advancing/technical-production', title: 'Technical Production', variant: 'compvss' },
  { route: '/compvss/advancing/hospitality', title: 'Hospitality', variant: 'compvss' },
  { route: '/compvss/advancing/travel-logistics', title: 'Travel & Logistics', variant: 'compvss' },
  
  // COMPVSS Operations
  { route: '/compvss/operations/hub', title: 'Operations Hub', variant: 'compvss' },
  { route: '/compvss/operations/checkin', title: 'Check-In', variant: 'compvss' },
  { route: '/compvss/operations/tasks', title: 'Tasks', variant: 'compvss' },
  { route: '/compvss/operations/schedule', title: 'Schedule', variant: 'compvss' },
  { route: '/compvss/operations/map', title: 'Site Map', variant: 'compvss' },
  { route: '/compvss/operations/contacts', title: 'Contacts', variant: 'compvss' },
  
  // COMPVSS QR
  { route: '/compvss/qr/hub', title: 'QR Hub', variant: 'compvss' },
  { route: '/compvss/qr/scan', title: 'Scan QR Code', variant: 'compvss' },
  { route: '/compvss/qr/generate', title: 'Generate QR Code', variant: 'compvss' },
  { route: '/compvss/qr/history', title: 'Scan History', variant: 'compvss' },
  { route: '/compvss/qr/access', title: 'Access Control', variant: 'compvss' },
  
  // COMPVSS Issues
  { route: '/compvss/issues/new', title: 'Report Issue', variant: 'compvss' },
  { route: '/compvss/issues/[id]', title: 'Issue Details', variant: 'compvss' },
  { route: '/compvss/issues/my-issues', title: 'My Issues', variant: 'compvss' },
  { route: '/compvss/issues/assigned', title: 'Assigned Issues', variant: 'compvss' },
  
  // COMPVSS Expenses
  { route: '/compvss/expenses/new', title: 'New Expense', variant: 'compvss' },
  { route: '/compvss/expenses/[id]', title: 'Expense Details', variant: 'compvss' },
  { route: '/compvss/expenses/submit', title: 'Submit Expenses', variant: 'compvss' },
  { route: '/compvss/expenses/history', title: 'Expense History', variant: 'compvss' },
  { route: '/compvss/expenses/reimbursements', title: 'Reimbursements', variant: 'compvss' },
  
  // COMPVSS Affiliates
  { route: '/compvss/affiliates/links', title: 'Affiliate Links', variant: 'compvss' },
  { route: '/compvss/affiliates/performance', title: 'Performance', variant: 'compvss' },
  { route: '/compvss/affiliates/commissions', title: 'Commissions', variant: 'compvss' },
  { route: '/compvss/affiliates/payouts', title: 'Payouts', variant: 'compvss' },
  { route: '/compvss/affiliates/marketing', title: 'Marketing Materials', variant: 'compvss' },
  
  // COMPVSS Referrals
  { route: '/compvss/referrals/generate', title: 'Generate Referral', variant: 'compvss' },
  { route: '/compvss/referrals/track', title: 'Track Referrals', variant: 'compvss' },
  { route: '/compvss/referrals/rewards', title: 'Rewards', variant: 'compvss' },
  { route: '/compvss/referrals/leaderboard', title: 'Leaderboard', variant: 'compvss' },
  
  // COMPVSS Credentials
  { route: '/compvss/credentials/vault', title: 'Credential Vault', variant: 'compvss' },
  { route: '/compvss/credentials/upload', title: 'Upload Credentials', variant: 'compvss' },
  { route: '/compvss/credentials/verify', title: 'Verify Credentials', variant: 'compvss' },
  { route: '/compvss/credentials/certifications', title: 'Certifications', variant: 'compvss' },
  { route: '/compvss/credentials/background', title: 'Background Checks', variant: 'compvss' },
  
  // COMPVSS Settings
  { route: '/compvss/settings/account', title: 'Account Settings', variant: 'compvss' },
  { route: '/compvss/settings/profile', title: 'Profile Settings', variant: 'compvss' },
  { route: '/compvss/settings/notifications', title: 'Notifications', variant: 'compvss' },
  { route: '/compvss/settings/security', title: 'Security', variant: 'compvss' },
  
  // ATLVS Auth
  { route: '/atlvs/auth/login', title: 'Login', variant: 'atlvs' },
  { route: '/atlvs/auth/register', title: 'Register', variant: 'atlvs' },
  { route: '/atlvs/auth/invite', title: 'Accept Invite', variant: 'atlvs' },
  
  // ATLVS Dashboard
  { route: '/atlvs/overview', title: 'Overview', variant: 'atlvs' },
  { route: '/atlvs/calendar', title: 'Calendar', variant: 'atlvs' },
  
  // ATLVS Projects
  { route: '/atlvs/projects/new', title: 'New Project', variant: 'atlvs' },
  { route: '/atlvs/projects/[id]', title: 'Project Details', variant: 'atlvs' },
  { route: '/atlvs/projects/[id]/overview', title: 'Project Overview', variant: 'atlvs' },
  { route: '/atlvs/projects/[id]/timeline', title: 'Timeline', variant: 'atlvs' },
  { route: '/atlvs/projects/[id]/milestones', title: 'Milestones', variant: 'atlvs' },
  { route: '/atlvs/projects/[id]/phases', title: 'Phases', variant: 'atlvs' },
  { route: '/atlvs/projects/[id]/files', title: 'Files', variant: 'atlvs' },
  { route: '/atlvs/projects/[id]/settings', title: 'Project Settings', variant: 'atlvs' },
  
  // ATLVS Tasks
  { route: '/atlvs/tasks/all', title: 'All Tasks', variant: 'atlvs' },
  { route: '/atlvs/tasks/board', title: 'Task Board', variant: 'atlvs' },
  { route: '/atlvs/tasks/list', title: 'Task List', variant: 'atlvs' },
  { route: '/atlvs/tasks/calendar', title: 'Task Calendar', variant: 'atlvs' },
  { route: '/atlvs/tasks/[id]', title: 'Task Details', variant: 'atlvs' },
  { route: '/atlvs/tasks/my-tasks', title: 'My Tasks', variant: 'atlvs' },
  { route: '/atlvs/tasks/assigned', title: 'Assigned Tasks', variant: 'atlvs' },
  
  // ATLVS Teams
  { route: '/atlvs/teams/[id]', title: 'Team Details', variant: 'atlvs' },
  { route: '/atlvs/teams/[id]/members', title: 'Team Members', variant: 'atlvs' },
  { route: '/atlvs/teams/[id]/roles', title: 'Team Roles', variant: 'atlvs' },
  { route: '/atlvs/teams/[id]/schedule', title: 'Team Schedule', variant: 'atlvs' },
  { route: '/atlvs/teams/directory', title: 'Team Directory', variant: 'atlvs' },
  { route: '/atlvs/teams/availability', title: 'Availability', variant: 'atlvs' },
  { route: '/atlvs/teams/time-tracking', title: 'Time Tracking', variant: 'atlvs' },
  
  // ATLVS Budgets
  { route: '/atlvs/budgets/[id]', title: 'Budget Details', variant: 'atlvs' },
  { route: '/atlvs/budgets/expenses', title: 'Expenses', variant: 'atlvs' },
  { route: '/atlvs/budgets/forecasting', title: 'Forecasting', variant: 'atlvs' },
  { route: '/atlvs/budgets/variance', title: 'Variance Analysis', variant: 'atlvs' },
  { route: '/atlvs/budgets/approvals', title: 'Approvals', variant: 'atlvs' },
  { route: '/atlvs/budgets/reports', title: 'Budget Reports', variant: 'atlvs' },
  
  // ATLVS Assets
  { route: '/atlvs/assets/inventory', title: 'Asset Inventory', variant: 'atlvs' },
  { route: '/atlvs/assets/equipment', title: 'Equipment', variant: 'atlvs' },
  { route: '/atlvs/assets/[id]', title: 'Asset Details', variant: 'atlvs' },
  { route: '/atlvs/assets/bookings', title: 'Bookings', variant: 'atlvs' },
  { route: '/atlvs/assets/maintenance', title: 'Maintenance', variant: 'atlvs' },
  { route: '/atlvs/assets/vehicles', title: 'Vehicles', variant: 'atlvs' },
  { route: '/atlvs/assets/qr-tracking', title: 'QR Tracking', variant: 'atlvs' },
  
  // ATLVS Advancing
  { route: '/atlvs/advancing/requests', title: 'All Requests', variant: 'atlvs' },
  { route: '/atlvs/advancing/pending', title: 'Pending Approvals', variant: 'atlvs' },
  { route: '/atlvs/advancing/approved', title: 'Approved Requests', variant: 'atlvs' },
  { route: '/atlvs/advancing/[id]', title: 'Request Details', variant: 'atlvs' },
  { route: '/atlvs/advancing/review', title: 'Review Request', variant: 'atlvs' },
  { route: '/atlvs/advancing/assign', title: 'Assign Resources', variant: 'atlvs' },
  { route: '/atlvs/advancing/results', title: 'Results', variant: 'atlvs' },
  { route: '/atlvs/advancing/analytics', title: 'Analytics', variant: 'atlvs' },
  
  // ATLVS Documents
  { route: '/atlvs/documents/library', title: 'Document Library', variant: 'atlvs' },
  { route: '/atlvs/documents/contracts', title: 'Contracts', variant: 'atlvs' },
  { route: '/atlvs/documents/riders', title: 'Riders', variant: 'atlvs' },
  { route: '/atlvs/documents/permits', title: 'Permits', variant: 'atlvs' },
  { route: '/atlvs/documents/insurance', title: 'Insurance', variant: 'atlvs' },
  { route: '/atlvs/documents/[id]', title: 'Document Details', variant: 'atlvs' },
  { route: '/atlvs/documents/templates', title: 'Templates', variant: 'atlvs' },
  { route: '/atlvs/documents/versions', title: 'Version History', variant: 'atlvs' },
  
  // ATLVS N8N
  { route: '/atlvs/n8n/hub', title: 'Automation Hub', variant: 'atlvs' },
  { route: '/atlvs/n8n/workflows', title: 'Workflows', variant: 'atlvs' },
  { route: '/atlvs/n8n/new', title: 'New Workflow', variant: 'atlvs' },
  { route: '/atlvs/n8n/[id]', title: 'Workflow Details', variant: 'atlvs' },
  { route: '/atlvs/n8n/edit/[id]', title: 'Edit Workflow', variant: 'atlvs' },
  { route: '/atlvs/n8n/executions', title: 'Executions', variant: 'atlvs' },
  { route: '/atlvs/n8n/templates', title: 'Templates', variant: 'atlvs' },
  { route: '/atlvs/n8n/credentials', title: 'Credentials', variant: 'atlvs' },
  { route: '/atlvs/n8n/webhooks', title: 'Webhooks', variant: 'atlvs' },
  
  // ATLVS Vendors
  { route: '/atlvs/vendors/directory', title: 'Vendor Directory', variant: 'atlvs' },
  { route: '/atlvs/vendors/[id]', title: 'Vendor Profile', variant: 'atlvs' },
  { route: '/atlvs/vendors/contracts', title: 'Contracts', variant: 'atlvs' },
  { route: '/atlvs/vendors/performance', title: 'Performance', variant: 'atlvs' },
  
  // ATLVS Analytics
  { route: '/atlvs/analytics/hub', title: 'Analytics Hub', variant: 'atlvs' },
  { route: '/atlvs/analytics/projects', title: 'Project Analytics', variant: 'atlvs' },
  { route: '/atlvs/analytics/budgets', title: 'Budget Analytics', variant: 'atlvs' },
  { route: '/atlvs/analytics/teams', title: 'Team Analytics', variant: 'atlvs' },
  { route: '/atlvs/analytics/advancing', title: 'Advancing Analytics', variant: 'atlvs' },
  { route: '/atlvs/analytics/reports', title: 'Reports', variant: 'atlvs' },
  { route: '/atlvs/analytics/scheduled', title: 'Scheduled Reports', variant: 'atlvs' },
  
  // ATLVS Settings
  { route: '/atlvs/settings/organization', title: 'Organization', variant: 'atlvs' },
  { route: '/atlvs/settings/users', title: 'User Management', variant: 'atlvs' },
  { route: '/atlvs/settings/roles', title: 'Role Management', variant: 'atlvs' },
  { route: '/atlvs/settings/permissions', title: 'Permissions', variant: 'atlvs' },
  { route: '/atlvs/settings/integrations', title: 'Integrations', variant: 'atlvs' },
  { route: '/atlvs/settings/billing', title: 'Billing', variant: 'atlvs' },
  { route: '/atlvs/settings/security', title: 'Security', variant: 'atlvs' },
  { route: '/atlvs/settings/audit-log', title: 'Audit Log', variant: 'atlvs' },
  { route: '/atlvs/settings/api-keys', title: 'API Keys', variant: 'atlvs' },
];

function generatePageTemplate(title, variant) {
  const isDynamic = title.includes('Details') || title.includes('Profile');
  const hasParams = isDynamic;
  
  return `/**
 * ${title} Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
${hasParams ? `import { useParams } from 'next/navigation';` : ''}

export default function ${title.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any>(null);
${hasParams ? `  const params = useParams();` : ''}

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        // TODO: Implement API call
        // const response = await apiClient.get('/api/...');
        // setData(response.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar variant="${variant}" />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="${variant}" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">${title}</H1>
          <Body className="text-gray-600">
            ${title} page content
          </Body>
        </div>

        <Card variant="${variant}">
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Page content goes here</CardDescription>
          </CardHeader>
          <CardContent>
            <Body>
              This page is ready for implementation.
            </Body>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
`;
}

function createPage(route, title, variant) {
  const filePath = join(REBUILD_DIR, route.slice(1), 'page.tsx');
  const dirPath = dirname(filePath);
  
  if (existsSync(filePath)) {
    console.log(`⏭️  Skipping ${route} (already exists)`);
    return false;
  }
  
  mkdirSync(dirPath, { recursive: true });
  const content = generatePageTemplate(title, variant);
  writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Created ${route}`);
  return true;
}

console.log('\n=== GENERATING MISSING PAGES ===\n');

let created = 0;
let skipped = 0;

for (const page of MISSING_PAGES) {
  if (createPage(page.route, page.title, page.variant)) {
    created++;
  } else {
    skipped++;
  }
}

console.log(`\n=== GENERATION COMPLETE ===`);
console.log(`✅ Created: ${created} pages`);
console.log(`⏭️  Skipped: ${skipped} pages`);
console.log(`📊 Total: ${created + skipped} pages\n`);
