#!/usr/bin/env tsx

import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const BASE = '/Users/julianclarkson/Documents/Grasshopper26.10/src/app';

const pages: Record<string, string> = {
  // GVTEWAY Pages
  [`${BASE}/(public)/events/page.tsx`]: `'use client';

import { useEvents } from '@/hooks/atlvs/useEvents';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function EventsPage() {
  const { events, isLoading } = useEvents();

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Discover Events</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {isLoading ? (
          <p>Loading events...</p>
        ) : (
          events.map((event) => (
            <Card key={event.id} variant="gvteway">
              <CardHeader>
                <CardTitle>{event.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{event.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}`,

  [`${BASE}/(public)/checkout/page.tsx`]: `'use client';

import { useCheckout } from '@/hooks/useCheckout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function CheckoutPage() {
  const { initiateCheckout, isProcessing } = useCheckout();

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Checkout</SectionHeader>
      <Card variant="gvteway" className="mt-6">
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="primary" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Complete Purchase'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}`,

  [`${BASE}/(public)/adventures/page.tsx`]: `'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function AdventuresPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>VIP Adventures</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card variant="gvteway">
          <CardHeader>
            <CardTitle>VIP Experiences</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Exclusive VIP event experiences</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}`,

  [`${BASE}/(public)/social/page.tsx`]: `'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function SocialPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Social Hub</SectionHeader>
      <Card variant="gvteway" className="mt-6">
        <CardHeader>
          <CardTitle>Community Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Connect with other event-goers</p>
        </CardContent>
      </Card>
    </div>
  );
}`,

  [`${BASE}/(public)/memberships/page.tsx`]: `'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';

export default function MembershipsPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Membership Tiers</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card variant="gvteway">
          <CardHeader>
            <CardTitle>Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Access exclusive benefits</p>
            <Button variant="primary" className="mt-4">Subscribe</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}`,

  [`${BASE}/(public)/marketplace/page.tsx`]: `'use client';

import { useCart } from '@/hooks/useCart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function MarketplacePage() {
  const { cart } = useCart();

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Marketplace</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <Card variant="gvteway">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Shop event merchandise</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}`,

  // COMPVSS Pages
  [`${BASE}/(platforms)/compvss/advancing/page.tsx`]: `'use client';

import { useAdvancing } from '@/hooks/atlvs/useAdvancing';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function CompvssAdvancingPage() {
  const { requests, isLoading } = useAdvancing();

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Advancing Requests</SectionHeader>
      <div className="space-y-4 mt-6">
        {isLoading ? (
          <p>Loading requests...</p>
        ) : (
          requests.map((request) => (
            <Card key={request.id} variant="compvss">
              <CardHeader>
                <CardTitle>{request.requestNumber}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: {request.status}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}`,

  [`${BASE}/(platforms)/compvss/day-of-show/page.tsx`]: `'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function DayOfShowPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Day of Show</SectionHeader>
      <Card variant="compvss" className="mt-6">
        <CardHeader>
          <CardTitle>Tasks & Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage day-of-show operations</p>
        </CardContent>
      </Card>
    </div>
  );
}`,

  [`${BASE}/(platforms)/compvss/issues/page.tsx`]: `'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function IssuesPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Issue Reports</SectionHeader>
      <Card variant="compvss" className="mt-6">
        <CardHeader>
          <CardTitle>Active Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Track and resolve issues</p>
        </CardContent>
      </Card>
    </div>
  );
}`,

  [`${BASE}/(platforms)/compvss/expenses/page.tsx`]: `'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function ExpensesPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Expense Reports</SectionHeader>
      <Card variant="compvss" className="mt-6">
        <CardHeader>
          <CardTitle>Submit Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage expense submissions</p>
        </CardContent>
      </Card>
    </div>
  );
}`,

  [`${BASE}/(platforms)/compvss/affiliates/page.tsx`]: `'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function AffiliatesPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Affiliate Program</SectionHeader>
      <Card variant="compvss" className="mt-6">
        <CardHeader>
          <CardTitle>Your Affiliate Links</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Track referrals and earnings</p>
        </CardContent>
      </Card>
    </div>
  );
}`,

  // ATLVS Pages
  [`${BASE}/(platforms)/atlvs/advancing/page.tsx`]: `'use client';

import { useAdvancing } from '@/hooks/atlvs/useAdvancing';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';

export default function AtlvsAdvancingPage() {
  const { requests, approveRequest, rejectRequest } = useAdvancing();

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Advancing Approvals</SectionHeader>
      <div className="space-y-4 mt-6">
        {requests.map((request) => (
          <Card key={request.id} variant="atlvs">
            <CardHeader>
              <CardTitle>{request.requestNumber}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Status: {request.status}</p>
              <div className="flex gap-2 mt-4">
                <Button variant="primary" onClick={() => approveRequest(request.id)}>
                  Approve
                </Button>
                <Button variant="outline" onClick={() => rejectRequest(request.id, 'Rejected')}>
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}`,

  [`${BASE}/(platforms)/atlvs/projects/page.tsx`]: `'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function ProjectsPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Projects</SectionHeader>
      <Card variant="atlvs" className="mt-6">
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage production projects</p>
        </CardContent>
      </Card>
    </div>
  );
}`,

  [`${BASE}/(platforms)/atlvs/tasks/page.tsx`]: `'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function TasksPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Tasks</SectionHeader>
      <Card variant="atlvs" className="mt-6">
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Assign and track tasks</p>
        </CardContent>
      </Card>
    </div>
  );
}`,

  [`${BASE}/(platforms)/atlvs/teams/page.tsx`]: `'use client';

import { useTeams } from '@/hooks/atlvs/useTeams';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function TeamsPage() {
  const { teams, isLoading } = useTeams();

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Teams</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {isLoading ? (
          <p>Loading teams...</p>
        ) : (
          teams.map((team) => (
            <Card key={team.id} variant="atlvs">
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{team.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}`,

  [`${BASE}/(platforms)/atlvs/budgets/page.tsx`]: `'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function BudgetsPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Budgets</SectionHeader>
      <Card variant="atlvs" className="mt-6">
        <CardHeader>
          <CardTitle>Budget Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Track project budgets and expenses</p>
        </CardContent>
      </Card>
    </div>
  );
}`,

  [`${BASE}/(platforms)/atlvs/equipment/page.tsx`]: `'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function EquipmentPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Equipment</SectionHeader>
      <Card variant="atlvs" className="mt-6">
        <CardHeader>
          <CardTitle>Equipment Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage and book equipment</p>
        </CardContent>
      </Card>
    </div>
  );
}`,

  [`${BASE}/(platforms)/atlvs/documents/page.tsx`]: `'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function DocumentsPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Documents</SectionHeader>
      <Card variant="atlvs" className="mt-6">
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage contracts, permits, and documents</p>
        </CardContent>
      </Card>
    </div>
  );
}`,

  [`${BASE}/(platforms)/atlvs/workflows/page.tsx`]: `'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function WorkflowsPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>N8N Workflows</SectionHeader>
      <Card variant="atlvs" className="mt-6">
        <CardHeader>
          <CardTitle>Automation Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Create and execute automated workflows</p>
        </CardContent>
      </Card>
    </div>
  );
}`,
};

// Write all files
let created = 0;
for (const [filepath, content] of Object.entries(pages)) {
  try {
    mkdirSync(dirname(filepath), { recursive: true });
    writeFileSync(filepath, content);
    console.log(`✅ Created: ${filepath.replace(BASE, '')}`);
    created++;
  } catch (error) {
    console.error(`❌ Failed: ${filepath}`, error);
  }
}

console.log(`\n✨ Successfully created ${created}/${Object.keys(pages).length} pages`);
