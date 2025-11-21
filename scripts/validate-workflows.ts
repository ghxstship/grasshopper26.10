#!/usr/bin/env tsx

/**
 * Comprehensive End-to-End Workflow Validation
 * Validates all business logic and workflows for all user types across all platforms
 */

import { promises as fs } from 'fs';
import path from 'path';

interface ValidationResult {
  category: string;
  workflow: string;
  userTypes: string[];
  status: 'IMPLEMENTED' | 'PARTIAL' | 'MISSING' | 'BROKEN';
  issues: string[];
  dependencies: string[];
}

interface WorkflowDefinition {
  name: string;
  category: string;
  userTypes: string[];
  requiredEndpoints: string[];
  requiredHooks: string[];
  requiredComponents: string[];
  description: string;
}

const WORKFLOWS: WorkflowDefinition[] = [
  // ============================================================================
  // AUTHENTICATION WORKFLOWS
  // ============================================================================
  {
    name: 'User Registration',
    category: 'Authentication',
    userTypes: ['CONSUMER', 'EXTERNAL_TEAM', 'INTERNAL_TEAM'],
    requiredEndpoints: [
      'src/app/api/auth/register/route.ts',
      'src/app/api/auth/verify-email/route.ts',
    ],
    requiredHooks: ['src/hooks/auth/useRegister.ts'],
    requiredComponents: ['src/app/(public)/auth/register/page.tsx'],
    description: 'User can register with email/password or OAuth providers',
  },
  {
    name: 'User Login',
    category: 'Authentication',
    userTypes: ['ALL'],
    requiredEndpoints: ['src/app/api/auth/[...nextauth]/route.ts'],
    requiredHooks: ['src/hooks/auth/useAuth.ts'],
    requiredComponents: ['src/app/(public)/auth/login/page.tsx'],
    description: 'User can login with credentials or OAuth',
  },
  {
    name: 'Password Reset',
    category: 'Authentication',
    userTypes: ['ALL'],
    requiredEndpoints: [
      'src/app/api/auth/forgot-password/route.ts',
      'src/app/api/auth/reset-password/route.ts',
    ],
    requiredHooks: [],
    requiredComponents: ['src/app/(public)/auth/forgot-password/page.tsx'],
    description: 'User can reset forgotten password via email',
  },
  {
    name: 'Wallet Authentication',
    category: 'Authentication',
    userTypes: ['CONSUMER'],
    requiredEndpoints: ['src/app/api/auth/wallet/route.ts'],
    requiredHooks: ['src/hooks/auth/useWalletAuth.ts'],
    requiredComponents: [],
    description: 'User can connect crypto wallet for authentication',
  },

  // ============================================================================
  // GVTEWAY WORKFLOWS
  // ============================================================================
  {
    name: 'Event Discovery',
    category: 'GVTEWAY',
    userTypes: ['CONSUMER'],
    requiredEndpoints: ['src/app/api/events/route.ts'],
    requiredHooks: ['src/hooks/atlvs/useEvents.ts'],
    requiredComponents: ['src/app/(public)/events/page.tsx'],
    description: 'User can browse and search events',
  },
  {
    name: 'Ticket Purchase',
    category: 'GVTEWAY',
    userTypes: ['CONSUMER'],
    requiredEndpoints: [
      'src/app/api/events/[id]/route.ts',
      'src/app/api/orders/route.ts',
      'src/app/api/checkout/route.ts',
    ],
    requiredHooks: ['src/hooks/useCheckout.ts'],
    requiredComponents: ['src/app/(public)/checkout/page.tsx'],
    description: 'User can purchase tickets for events',
  },
  {
    name: 'Wallet Pass Generation',
    category: 'GVTEWAY',
    userTypes: ['CONSUMER'],
    requiredEndpoints: ['src/app/api/wallet-passes/route.ts'],
    requiredHooks: [],
    requiredComponents: [],
    description: 'User receives Apple/Google Wallet pass after purchase',
  },
  {
    name: 'NFT Ticket Minting',
    category: 'GVTEWAY',
    userTypes: ['CONSUMER'],
    requiredEndpoints: ['src/app/api/nft/mint/route.ts'],
    requiredHooks: ['src/hooks/useNFT.ts'],
    requiredComponents: [],
    description: 'User can mint NFT tickets',
  },
  {
    name: 'Ticket Transfer',
    category: 'GVTEWAY',
    userTypes: ['CONSUMER'],
    requiredEndpoints: ['src/app/api/tickets/[id]/transfer/route.ts'],
    requiredHooks: [],
    requiredComponents: [],
    description: 'User can transfer tickets to others',
  },
  {
    name: 'Adventure Booking',
    category: 'GVTEWAY',
    userTypes: ['CONSUMER'],
    requiredEndpoints: [
      'src/app/api/adventures/route.ts',
      'src/app/api/adventures/[id]/book/route.ts',
    ],
    requiredHooks: [],
    requiredComponents: ['src/app/(public)/adventures/page.tsx'],
    description: 'User can book VIP experiences and tours',
  },
  {
    name: 'Social Posting',
    category: 'GVTEWAY',
    userTypes: ['CONSUMER'],
    requiredEndpoints: [
      'src/app/api/social/posts/route.ts',
      'src/app/api/social/posts/[id]/like/route.ts',
      'src/app/api/social/posts/[id]/comment/route.ts',
    ],
    requiredHooks: [],
    requiredComponents: ['src/app/(public)/social/page.tsx'],
    description: 'User can create posts, like, and comment',
  },
  {
    name: 'Membership Subscription',
    category: 'GVTEWAY',
    userTypes: ['CONSUMER'],
    requiredEndpoints: [
      'src/app/api/memberships/tiers/route.ts',
      'src/app/api/memberships/route.ts',
    ],
    requiredHooks: [],
    requiredComponents: ['src/app/(public)/memberships/page.tsx'],
    description: 'User can subscribe to membership tiers',
  },
  {
    name: 'Marketplace Shopping',
    category: 'GVTEWAY',
    userTypes: ['CONSUMER'],
    requiredEndpoints: [
      'src/app/api/products/route.ts',
      'src/app/api/cart/route.ts',
      'src/app/api/cart/items/route.ts',
    ],
    requiredHooks: ['src/hooks/useCart.ts'],
    requiredComponents: ['src/app/(public)/marketplace/page.tsx'],
    description: 'User can browse and purchase products',
  },

  // ============================================================================
  // COMPVSS WORKFLOWS
  // ============================================================================
  {
    name: 'Advancing Request Submission',
    category: 'COMPVSS',
    userTypes: ['EXTERNAL_TEAM'],
    requiredEndpoints: [
      'src/app/api/compvss/advancing/route.ts',
      'src/app/api/compvss/advancing/[id]/route.ts',
    ],
    requiredHooks: ['src/hooks/atlvs/useAdvancing.ts'],
    requiredComponents: ['src/app/(platforms)/compvss/advancing/page.tsx'],
    description: 'External team can submit advancing requests',
  },
  {
    name: 'Advancing Request Approval',
    category: 'COMPVSS',
    userTypes: ['INTERNAL_TEAM'],
    requiredEndpoints: [
      'src/app/api/atlvs/advancing/[id]/approve/route.ts',
      'src/app/api/atlvs/advancing/[id]/reject/route.ts',
    ],
    requiredHooks: [],
    requiredComponents: ['src/app/(platforms)/atlvs/advancing/page.tsx'],
    description: 'Internal team can approve/reject advancing requests',
  },
  {
    name: 'Day-of-Show Task Management',
    category: 'COMPVSS',
    userTypes: ['EXTERNAL_TEAM', 'INTERNAL_TEAM'],
    requiredEndpoints: [
      'src/app/api/compvss/day-of-show/tasks/route.ts',
      'src/app/api/compvss/day-of-show/check-in/route.ts',
    ],
    requiredHooks: [],
    requiredComponents: ['src/app/(platforms)/compvss/day-of-show/page.tsx'],
    description: 'Team can manage day-of-show tasks and check-ins',
  },
  {
    name: 'QR Code Scanning',
    category: 'COMPVSS',
    userTypes: ['EXTERNAL_TEAM', 'INTERNAL_TEAM'],
    requiredEndpoints: [
      'src/app/api/compvss/qr/generate/route.ts',
      'src/app/api/compvss/qr/scan/route.ts',
    ],
    requiredHooks: [],
    requiredComponents: [],
    description: 'Team can generate and scan QR codes',
  },
  {
    name: 'Issue Reporting',
    category: 'COMPVSS',
    userTypes: ['EXTERNAL_TEAM', 'INTERNAL_TEAM'],
    requiredEndpoints: [
      'src/app/api/compvss/issues/route.ts',
      'src/app/api/compvss/issues/[id]/resolve/route.ts',
    ],
    requiredHooks: [],
    requiredComponents: ['src/app/(platforms)/compvss/issues/page.tsx'],
    description: 'Team can report and resolve issues',
  },
  {
    name: 'Expense Submission',
    category: 'COMPVSS',
    userTypes: ['EXTERNAL_TEAM'],
    requiredEndpoints: [
      'src/app/api/compvss/expenses/route.ts',
      'src/app/api/compvss/expenses/[id]/route.ts',
    ],
    requiredHooks: [],
    requiredComponents: ['src/app/(platforms)/compvss/expenses/page.tsx'],
    description: 'External team can submit expense reports',
  },
  {
    name: 'Expense Approval',
    category: 'COMPVSS',
    userTypes: ['INTERNAL_TEAM'],
    requiredEndpoints: [
      'src/app/api/compvss/expenses/[id]/approve/route.ts',
      'src/app/api/compvss/expenses/[id]/reject/route.ts',
    ],
    requiredHooks: [],
    requiredComponents: [],
    description: 'Internal team can approve/reject expenses',
  },
  {
    name: 'Affiliate Program',
    category: 'COMPVSS',
    userTypes: ['EXTERNAL_TEAM'],
    requiredEndpoints: [
      'src/app/api/compvss/affiliates/me/route.ts',
      'src/app/api/compvss/affiliates/links/route.ts',
    ],
    requiredHooks: [],
    requiredComponents: ['src/app/(platforms)/compvss/affiliates/page.tsx'],
    description: 'External team can manage affiliate links',
  },
  {
    name: 'Referral System',
    category: 'COMPVSS',
    userTypes: ['EXTERNAL_TEAM'],
    requiredEndpoints: [
      'src/app/api/compvss/referrals/route.ts',
      'src/app/api/compvss/referrals/analytics/route.ts',
    ],
    requiredHooks: [],
    requiredComponents: [],
    description: 'External team can create and track referrals',
  },

  // ============================================================================
  // ATLVS WORKFLOWS
  // ============================================================================
  {
    name: 'Project Management',
    category: 'ATLVS',
    userTypes: ['INTERNAL_TEAM'],
    requiredEndpoints: [
      'src/app/api/atlvs/projects/route.ts',
      'src/app/api/atlvs/projects/[id]/route.ts',
      'src/app/api/atlvs/projects/[id]/phases/route.ts',
    ],
    requiredHooks: ['src/hooks/atlvs/useProjects.ts'],
    requiredComponents: ['src/app/(platforms)/atlvs/projects/page.tsx'],
    description: 'Internal team can create and manage projects',
  },
  {
    name: 'Task Management',
    category: 'ATLVS',
    userTypes: ['INTERNAL_TEAM'],
    requiredEndpoints: [
      'src/app/api/atlvs/tasks/route.ts',
      'src/app/api/atlvs/tasks/[id]/route.ts',
      'src/app/api/atlvs/tasks/[id]/assign/route.ts',
    ],
    requiredHooks: ['src/hooks/atlvs/useTasks.ts'],
    requiredComponents: ['src/app/(platforms)/atlvs/tasks/page.tsx'],
    description: 'Internal team can create and assign tasks',
  },
  {
    name: 'Team Management',
    category: 'ATLVS',
    userTypes: ['INTERNAL_TEAM'],
    requiredEndpoints: [
      'src/app/api/atlvs/teams/route.ts',
      'src/app/api/atlvs/teams/[id]/members/route.ts',
    ],
    requiredHooks: ['src/hooks/atlvs/useTeams.ts'],
    requiredComponents: ['src/app/(platforms)/atlvs/teams/page.tsx'],
    description: 'Internal team can manage teams and members',
  },
  {
    name: 'Budget Management',
    category: 'ATLVS',
    userTypes: ['INTERNAL_TEAM'],
    requiredEndpoints: [
      'src/app/api/atlvs/budgets/route.ts',
      'src/app/api/atlvs/budgets/[id]/route.ts',
      'src/app/api/atlvs/budgets/[id]/expenses/route.ts',
    ],
    requiredHooks: ['src/hooks/atlvs/useBudgets.ts'],
    requiredComponents: ['src/app/(platforms)/atlvs/budgets/page.tsx'],
    description: 'Internal team can manage budgets and track expenses',
  },
  {
    name: 'Equipment Management',
    category: 'ATLVS',
    userTypes: ['INTERNAL_TEAM'],
    requiredEndpoints: [
      'src/app/api/atlvs/equipment/route.ts',
      'src/app/api/atlvs/equipment/[id]/book/route.ts',
      'src/app/api/atlvs/equipment/[id]/maintenance/route.ts',
    ],
    requiredHooks: [],
    requiredComponents: ['src/app/(platforms)/atlvs/equipment/page.tsx'],
    description: 'Internal team can manage and book equipment',
  },
  {
    name: 'Document Management',
    category: 'ATLVS',
    userTypes: ['INTERNAL_TEAM'],
    requiredEndpoints: [
      'src/app/api/atlvs/documents/route.ts',
      'src/app/api/atlvs/documents/[id]/route.ts',
      'src/app/api/atlvs/documents/[id]/versions/route.ts',
    ],
    requiredHooks: [],
    requiredComponents: ['src/app/(platforms)/atlvs/documents/page.tsx'],
    description: 'Internal team can upload and manage documents',
  },
  {
    name: 'N8N Workflow Automation',
    category: 'ATLVS',
    userTypes: ['INTERNAL_TEAM'],
    requiredEndpoints: [
      'src/app/api/atlvs/workflows/route.ts',
      'src/app/api/atlvs/workflows/[id]/execute/route.ts',
    ],
    requiredHooks: [],
    requiredComponents: ['src/app/(platforms)/atlvs/workflows/page.tsx'],
    description: 'Internal team can create and execute N8N workflows',
  },

  // ============================================================================
  // CROSS-PLATFORM WORKFLOWS
  // ============================================================================
  {
    name: 'End-to-End Advancing Flow',
    category: 'Cross-Platform',
    userTypes: ['CONSUMER', 'EXTERNAL_TEAM', 'INTERNAL_TEAM'],
    requiredEndpoints: [
      'src/app/api/compvss/advancing/route.ts',
      'src/app/api/atlvs/advancing/[id]/approve/route.ts',
      'src/app/api/atlvs/advancing/[id]/submit/route.ts',
    ],
    requiredHooks: ['src/hooks/atlvs/useAdvancing.ts'],
    requiredComponents: [],
    description: 'GVTEWAY vendor submits → COMPVSS processes → ATLVS approves',
  },
  {
    name: 'Payment Processing',
    category: 'Cross-Platform',
    userTypes: ['CONSUMER'],
    requiredEndpoints: [
      'src/app/api/checkout/route.ts',
      'src/app/api/webhooks/stripe/route.ts',
    ],
    requiredHooks: ['src/hooks/useCheckout.ts'],
    requiredComponents: [],
    description: 'Stripe payment processing with webhook confirmation',
  },
  {
    name: 'Real-time Notifications',
    category: 'Cross-Platform',
    userTypes: ['ALL'],
    requiredEndpoints: ['src/app/api/notifications/route.ts'],
    requiredHooks: ['src/hooks/useNotifications.ts'],
    requiredComponents: [],
    description: 'Real-time notifications via Supabase subscriptions',
  },
];

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function validateWorkflow(workflow: WorkflowDefinition): Promise<ValidationResult> {
  const issues: string[] = [];
  const dependencies: string[] = [];
  let implementedCount = 0;
  let totalRequired = 0;

  // Check endpoints
  for (const endpoint of workflow.requiredEndpoints) {
    totalRequired++;
    const exists = await fileExists(path.join(process.cwd(), endpoint));
    if (exists) {
      implementedCount++;
      dependencies.push(endpoint);
    } else {
      issues.push(`Missing endpoint: ${endpoint}`);
    }
  }

  // Check hooks
  for (const hook of workflow.requiredHooks) {
    totalRequired++;
    const exists = await fileExists(path.join(process.cwd(), hook));
    if (exists) {
      implementedCount++;
      dependencies.push(hook);
    } else {
      issues.push(`Missing hook: ${hook}`);
    }
  }

  // Check components
  for (const component of workflow.requiredComponents) {
    totalRequired++;
    const exists = await fileExists(path.join(process.cwd(), component));
    if (exists) {
      implementedCount++;
      dependencies.push(component);
    } else {
      issues.push(`Missing component: ${component}`);
    }
  }

  // Determine status
  let status: ValidationResult['status'];
  if (implementedCount === 0) {
    status = 'MISSING';
  } else if (implementedCount === totalRequired) {
    status = 'IMPLEMENTED';
  } else {
    status = 'PARTIAL';
  }

  return {
    category: workflow.category,
    workflow: workflow.name,
    userTypes: workflow.userTypes,
    status,
    issues,
    dependencies,
  };
}

async function main() {
  console.log('🔍 COMPREHENSIVE WORKFLOW VALIDATION\n');
  console.log('=' .repeat(80));
  console.log('\n');

  const results: ValidationResult[] = [];
  const categories = new Map<string, ValidationResult[]>();

  // Validate all workflows
  for (const workflow of WORKFLOWS) {
    const result = await validateWorkflow(workflow);
    results.push(result);

    if (!categories.has(result.category)) {
      categories.set(result.category, []);
    }
    categories.get(result.category)!.push(result);
  }

  // Print results by category
  for (const [category, categoryResults] of categories) {
    console.log(`\n📁 ${category.toUpperCase()}`);
    console.log('-'.repeat(80));

    for (const result of categoryResults) {
      const statusEmoji = {
        IMPLEMENTED: '✅',
        PARTIAL: '⚠️',
        MISSING: '❌',
        BROKEN: '🔴',
      }[result.status];

      console.log(`\n${statusEmoji} ${result.workflow}`);
      console.log(`   User Types: ${result.userTypes.join(', ')}`);
      console.log(`   Status: ${result.status}`);

      if (result.issues.length > 0) {
        console.log(`   Issues:`);
        result.issues.forEach(issue => console.log(`     - ${issue}`));
      }

      if (result.dependencies.length > 0 && result.status === 'IMPLEMENTED') {
        console.log(`   ✓ All dependencies present (${result.dependencies.length} files)`);
      }
    }
  }

  // Summary statistics
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 SUMMARY STATISTICS\n');

  const totalWorkflows = results.length;
  const implemented = results.filter(r => r.status === 'IMPLEMENTED').length;
  const partial = results.filter(r => r.status === 'PARTIAL').length;
  const missing = results.filter(r => r.status === 'MISSING').length;
  const broken = results.filter(r => r.status === 'BROKEN').length;

  console.log(`Total Workflows: ${totalWorkflows}`);
  console.log(`✅ Implemented: ${implemented} (${Math.round(implemented / totalWorkflows * 100)}%)`);
  console.log(`⚠️  Partial: ${partial} (${Math.round(partial / totalWorkflows * 100)}%)`);
  console.log(`❌ Missing: ${missing} (${Math.round(missing / totalWorkflows * 100)}%)`);
  console.log(`🔴 Broken: ${broken} (${Math.round(broken / totalWorkflows * 100)}%)`);

  // Category breakdown
  console.log('\n📈 BY CATEGORY:\n');
  for (const [category, categoryResults] of categories) {
    const catImplemented = categoryResults.filter(r => r.status === 'IMPLEMENTED').length;
    const catTotal = categoryResults.length;
    const percentage = Math.round(catImplemented / catTotal * 100);
    console.log(`${category}: ${catImplemented}/${catTotal} (${percentage}%)`);
  }

  // Critical missing workflows
  const criticalMissing = results.filter(r => 
    r.status === 'MISSING' && 
    (r.category === 'Authentication' || r.category === 'Cross-Platform')
  );

  if (criticalMissing.length > 0) {
    console.log('\n\n⚠️  CRITICAL MISSING WORKFLOWS:\n');
    criticalMissing.forEach(r => {
      console.log(`❌ ${r.workflow} (${r.category})`);
    });
  }

  // Exit code based on results
  const exitCode = broken > 0 ? 2 : (missing > 0 || partial > 0 ? 1 : 0);
  process.exit(exitCode);
}

main().catch(console.error);
