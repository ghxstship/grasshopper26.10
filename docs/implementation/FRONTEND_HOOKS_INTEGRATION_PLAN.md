# Frontend Hooks Integration Plan
## Path to 100% Completion

**Current Status**: 120/248 pages (48%)  
**Remaining**: 128 pages  
**Target**: 100% (248/248 pages)

---

## ✅ Completed This Session

### New Hooks Created
1. **useOpportunities** - ATLVS opportunities management hook

### Pages Integrated
1. **gvteway/events/[id]** - Event detail page with useEvent hook

---

## 📋 Remaining Pages by Category

### GVTEWAY Pages (29 remaining)

#### Marketplace (3 pages)
- [ ] `marketplace/checkout/page.tsx` - Use `useCart`, `useProducts`
- [ ] `marketplace/products/page.tsx` - Use `useProducts`
- [ ] `marketplace/products/[id]/page.tsx` - Use `useProduct`

#### Tickets (5 pages)
- [ ] `tickets/[id]/page.tsx` - Use `useTicket`
- [ ] `tickets/orders/page.tsx` - Use `useTickets`
- [ ] `tickets/sell/page.tsx` - Use `useTickets`, `useSellTicket`
- [ ] `tickets/success/page.tsx` - Use `useTicket`
- [ ] `tickets/transfer/page.tsx` - Use `useTicket`, `useTransferTicket`

#### Wallet (5 pages)
- [ ] `wallet/apple-wallet/page.tsx` - Use `useWallet`
- [ ] `wallet/credentials/page.tsx` - Use `useWallet`
- [ ] `wallet/google-wallet/page.tsx` - Use `useWallet`
- [ ] `wallet/loyalty/page.tsx` - Use `useLoyalty`
- [ ] `wallet/nft/page.tsx` - Use `useWallet`

#### Memberships (3 pages)
- [ ] `memberships/benefits/page.tsx` - Use `useMembershipTiers`
- [ ] `memberships/exclusive/page.tsx` - Use `useMyMembership`
- [ ] `memberships/join/page.tsx` - Use `useMembershipTiers`, `useSubscribeMembership`

#### Social & Analytics (6 pages)
- [ ] `social/post/page.tsx` - Use `useSocial`, `useCreatePost`
- [ ] `analytics/history/page.tsx` - Use `useAnalytics`
- [ ] `analytics/recommendations/page.tsx` - Use `useAnalytics`
- [ ] `analytics/spending/page.tsx` - Use `useAnalytics`
- [ ] `events/map/page.tsx` - Use `useEvents`
- [ ] `events/search/page.tsx` - Use `useEvents`

#### Adventures & Settings (7 pages)
- [ ] `adventures/meet-greet/page.tsx` - Use `useAdventures`
- [ ] `adventures/tours/page.tsx` - Use `useAdventures`
- [ ] `adventures/vip/page.tsx` - Use `useAdventures`
- [ ] `settings/account/page.tsx` - Use `useSettings`
- [ ] `settings/notifications/page.tsx` - Use `useSettings`
- [ ] `settings/payment-methods/page.tsx` - Use `useSettings`
- [ ] `settings/privacy/page.tsx` - Use `useSettings`

---

### ATLVS Pages (50 remaining)

#### Automation (9 pages)
- [ ] `automation/[id]/page.tsx` - Use `useWorkflow`
- [ ] `automation/builder/page.tsx` - Use `useWorkflows`, `useCreateWorkflow`
- [ ] `automation/credentials/page.tsx` - Use `useIntegrations`
- [ ] `automation/executions/page.tsx` - Use `useWorkflowExecutions`
- [ ] `automation/logs/page.tsx` - Use `useWorkflowLogs`
- [ ] `automation/monitoring/page.tsx` - Use `useWorkflows`
- [ ] `automation/settings/page.tsx` - Use `useSettings`
- [ ] `automation/templates/page.tsx` - Use `useWorkflows`
- [ ] `automation/triggers/page.tsx` - Use `useWorkflows`

#### Analytics (6 pages)
- [ ] `analytics/custom-reports/page.tsx` - Use `useReports`, `useCreateReport`
- [ ] `analytics/data-sources/page.tsx` - Use `useAnalytics`
- [ ] `analytics/export/page.tsx` - Use `useReports`, `useExportReport`
- [ ] `analytics/insights/page.tsx` - Use `useAnalytics`
- [ ] `analytics/projects/page.tsx` - Use `useProjects`, `useAnalytics`
- [ ] `analytics/scheduled-reports/page.tsx` - Use `useReports`
- [ ] `analytics/trends/page.tsx` - Use `useAnalytics`

#### Budgets (8 pages)
- [ ] `budgets/[id]/page.tsx` - Use `useBudget`
- [ ] `budgets/approval/page.tsx` - Use `useBudgets`
- [ ] `budgets/currency/page.tsx` - Use `useBudgets`
- [ ] `budgets/expenses/page.tsx` - Use `useBudgets`
- [ ] `budgets/forecast/page.tsx` - Use `useBudgets`
- [ ] `budgets/new/page.tsx` - Use `useCreateBudget`
- [ ] `budgets/reports/page.tsx` - Use `useBudgets`, `useReports`
- [ ] `budgets/variance/page.tsx` - Use `useBudgets`

#### Documents (9 pages)
- [ ] `documents/[id]/page.tsx` - Use `useDocument`
- [ ] `documents/contracts/page.tsx` - Use `useContracts`
- [ ] `documents/insurance/page.tsx` - Use `useDocuments`
- [ ] `documents/permits/page.tsx` - Use `useDocuments`
- [ ] `documents/riders/page.tsx` - Use `useDocuments`
- [ ] `documents/templates/page.tsx` - Use `useDocuments`
- [ ] `documents/upload/page.tsx` - Use `useUploadDocument`
- [ ] `documents/version-control/page.tsx` - Use `useDocuments`
- [ ] `documents/versions/page.tsx` - Use `useDocuments`

#### Integrations (6 pages)
- [ ] `integrations/google/page.tsx` - Use `useIntegrations`
- [ ] `integrations/microsoft/page.tsx` - Use `useIntegrations`
- [ ] `integrations/quickbooks/page.tsx` - Use `useIntegrations`
- [ ] `integrations/slack/page.tsx` - Use `useIntegrations`
- [ ] `integrations/stripe/page.tsx` - Use `useIntegrations`
- [ ] `integrations/zapier/page.tsx` - Use `useIntegrations`

#### Tasks (9 pages)
- [ ] `tasks/[id]/page.tsx` - Use `useTask`
- [ ] `tasks/assign/page.tsx` - Use `useTasks`, `useTeams`
- [ ] `tasks/calendar/page.tsx` - Use `useTasks`
- [ ] `tasks/dependencies/page.tsx` - Use `useTasks`
- [ ] `tasks/list/page.tsx` - Use `useTasks`
- [ ] `tasks/new/page.tsx` - Use `useCreateTask`
- [ ] `tasks/templates/page.tsx` - Use `useTasks`
- [ ] `tasks/time-tracking/page.tsx` - Use `useTimeEntries`
- [ ] `tasks/time/page.tsx` - Use `useTimeEntries`

#### Teams (9 pages)
- [ ] `teams/[id]/page.tsx` - Use `useTeam`
- [ ] `teams/assign-roles/page.tsx` - Use `useTeams`
- [ ] `teams/availability/page.tsx` - Use `useTeams`
- [ ] `teams/communication/page.tsx` - Use `useTeams`, `useMessages`
- [ ] `teams/create/page.tsx` - Use `useCreateTeam`
- [ ] `teams/performance/page.tsx` - Use `useTeams`, `useAnalytics`
- [ ] `teams/roles/page.tsx` - Use `useTeams`
- [ ] `teams/schedule/page.tsx` - Use `useTeams`
- [ ] `teams/time-tracking/page.tsx` - Use `useTeams`, `useTimeEntries`

#### Projects (4 pages)
- [ ] `projects/[id]/files/page.tsx` - Use `useProject`, `useFiles`
- [ ] `projects/[id]/phases/page.tsx` - Use `useProject`, `usePhases`
- [ ] `projects/[id]/settings/page.tsx` - Use `useProject`, `useSettings`
- [ ] `projects/dependencies/page.tsx` - Use `useProjects`

---

### COMPVSS Pages (40 remaining)

#### Dashboard & Operations (15 pages)
- [ ] `dashboard/schedule/page.tsx` - Already has useQuery, needs hook wrapper
- [ ] `dashboard/tasks/page.tsx` - Already has useQuery, needs hook wrapper
- [ ] `dashboard/day-of-show/page.tsx` - Already has useQuery, needs hook wrapper
- [ ] `operations/communication/page.tsx` - Use `useMessages`
- [ ] `operations/reports/page.tsx` - Use `useReports`
- [ ] `operations/schedule/page.tsx` - Use `useSchedule`
- [ ] `operations/settings/page.tsx` - Use `useSettings`
- [ ] `operations/training/page.tsx` - Use `useTraining`
- [ ] `check-in/history/page.tsx` - Use `useCheckIns`
- [ ] `check-in/scan/page.tsx` - Use `useCheckIns`
- [ ] `check-in/settings/page.tsx` - Use `useSettings`
- [ ] `check-in/stats/page.tsx` - Use `useCheckIns`, `useAnalytics`
- [ ] `issues/create/page.tsx` - Use `useCreateIssue`
- [ ] `issues/reports/page.tsx` - Use `useIssues`, `useReports`
- [ ] `issues/settings/page.tsx` - Use `useSettings`

#### Advancing Forms (12 pages)
- [ ] `advancing/access/page.tsx` - Use `useAdvancingRequests`
- [ ] `advancing/accommodation/page.tsx` - Use `useAdvancingRequests`
- [ ] `advancing/hospitality/page.tsx` - Use `useAdvancingRequests`
- [ ] `advancing/marketing/page.tsx` - Use `useAdvancingRequests`
- [ ] `advancing/other/page.tsx` - Use `useAdvancingRequests`
- [ ] `advancing/permits/page.tsx` - Use `useAdvancingRequests`
- [ ] `advancing/security/page.tsx` - Use `useAdvancingRequests`
- [ ] `advancing/staffing/page.tsx` - Use `useAdvancingRequests`
- [ ] `advancing/technical/page.tsx` - Use `useAdvancingRequests`
- [ ] `advancing/transportation/page.tsx` - Use `useAdvancingRequests`
- [ ] `advancing/travel/page.tsx` - Use `useAdvancingRequests`
- [ ] `advancing/new/page.tsx` - Use `useCreateAdvancingRequest`

#### Other Modules (13 pages)
- [ ] `affiliates/applications/page.tsx` - Use `useAffiliates`
- [ ] `affiliates/onboarding/page.tsx` - Use `useAffiliates`
- [ ] `qr/analytics/page.tsx` - Use `useQRCodes`, `useAnalytics`
- [ ] `qr/settings/page.tsx` - Use `useSettings`
- [ ] `expenses/analytics/page.tsx` - Use `useExpenses`, `useAnalytics`
- [ ] `expenses/categories/page.tsx` - Use `useExpenses`
- [ ] `expenses/new/page.tsx` - Use `useCreateExpense`
- [ ] `expenses/reports/page.tsx` - Use `useExpenses`, `useReports`
- [ ] `referrals/analytics/page.tsx` - Use `useReferrals`, `useAnalytics`
- [ ] `referrals/settings/page.tsx` - Use `useSettings`
- [ ] `team/roles/page.tsx` - Use `useTeamMembers`
- [ ] `team/schedule/page.tsx` - Use `useTeamMembers`
- [ ] `credentials/settings/page.tsx` - Use `useSettings`

---

### Shared/Root Pages (9 remaining)
- [ ] `page.tsx` (root) - Landing page, may not need hooks
- [ ] `settings/page.tsx` (if exists at root)
- [ ] Other utility/static pages

---

## 🔧 Integration Pattern

For each page, follow this pattern:

```typescript
// 1. Add hook import
import { useXXX } from '@/lib/hooks/[app]/useXXX';
import { Loader2, AlertCircle } from 'lucide-react';

// 2. Use hook in component
const { data, isLoading, error, refetch } = useXXX(params);

// 3. Add loading state
if (isLoading) {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    </Layout>
  );
}

// 4. Add error state
if (error) {
  return (
    <Layout>
      <div className="text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
        <p>{error.message}</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    </Layout>
  );
}

// 5. Use data in component
return <Layout>{/* Use data */}</Layout>;
```

---

## 📊 Progress Tracking

- **Session Start**: 119/248 (48%)
- **Current**: 120/248 (48%)
- **Target**: 248/248 (100%)
- **Remaining**: 128 pages

---

## 🎯 Next Steps

1. **Batch integrate GVTEWAY pages** (29 pages) - Highest user-facing impact
2. **Batch integrate ATLVS subpages** (50 pages) - Core operational features
3. **Batch integrate COMPVSS pages** (40 pages) - Event management features
4. **Integrate shared pages** (9 pages) - Utility pages
5. **Final verification** - Test all integrations, fix type errors
6. **Update tracker to 100%**

---

## ✅ Available Hooks

All necessary hooks are already created:

### ATLVS Hooks (19)
- useAdvancingRequests, useAnalytics, useAssets, useAutomation
- useBudgets, useContracts, useDashboards, useDocuments
- useEquipment, useIntegrations, useMilestones, usePhases
- useProjects, useReports, useSettings, useTasks
- useTeams, useTimeEntries, useVehicles, useOpportunities

### GVTEWAY Hooks (13)
- useAdventures, useAlerts, useEvents, useLoyalty
- useMemberships, useMessages, useOrders, useProducts
- useSocial, useTickets, useVenues, useWallet, useWishlist

### COMPVSS Hooks (5)
- useAffiliates, useCheckIns, useExpenses, useIssues, useQRCodes

### Shared Hooks (4)
- useApplications, useAuditLogs, useFiles, useNotifications

**Total: 68 hooks available** ✅

---

## 📝 Notes

- Auth pages (16 total) are excluded - they don't need data-fetching hooks
- Some pages may have inline `useQuery` calls that need to be wrapped in custom hooks
- Type mismatches between API responses and UI expectations need to be addressed
- All integrated pages should have proper loading states, error handling, and refetch capabilities
