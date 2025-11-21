#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';

const API_TEMPLATE = `
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }
        const response = await apiClient.get<any>('API_ENDPOINT');
        if (response.data) {
          setData(response.data);
        }
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
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
`;

const remainingPages = [
  // ATLVS pages with dynamic routes or specific endpoints
  { path: 'src/app/(platforms)/atlvs/assets/[id]/availability/page.tsx', api: '/api/atlvs/assets/${id}/availability' },
  { path: 'src/app/(platforms)/atlvs/assets/[id]/book/page.tsx', api: '/api/atlvs/assets/${id}/book' },
  { path: 'src/app/(platforms)/atlvs/assets/calendar/page.tsx', api: '/api/atlvs/assets/calendar' },
  { path: 'src/app/(platforms)/atlvs/automation/[id]/execute/page.tsx', api: '/api/atlvs/automation/${id}/execute' },
  { path: 'src/app/(platforms)/atlvs/automation/[id]/logs/page.tsx', api: '/api/atlvs/automation/${id}/logs' },
  { path: 'src/app/(platforms)/atlvs/automation/[id]/page.tsx', api: '/api/atlvs/automation/${id}' },
  { path: 'src/app/(platforms)/atlvs/budgets/[id]/approve/page.tsx', api: '/api/atlvs/budgets/${id}/approve' },
  { path: 'src/app/(platforms)/atlvs/budgets/[id]/expenses/page.tsx', api: '/api/atlvs/budgets/${id}/expenses' },
  { path: 'src/app/(platforms)/atlvs/documents/[id]/versions/page.tsx', api: '/api/atlvs/documents/${id}/versions' },
  { path: 'src/app/(platforms)/atlvs/equipment/[id]/book/page.tsx', api: '/api/atlvs/equipment/${id}/book' },
  { path: 'src/app/(platforms)/atlvs/equipment/[id]/maintenance/page.tsx', api: '/api/atlvs/equipment/${id}/maintenance' },
  { path: 'src/app/(platforms)/atlvs/kpi/dashboard/[eventId]/page.tsx', api: '/api/atlvs/kpi/dashboard/${eventId}' },
  { path: 'src/app/(platforms)/atlvs/kpi/event/[eventId]/page.tsx', api: '/api/atlvs/kpi/event/${eventId}' },
  { path: 'src/app/(platforms)/atlvs/kpi/financial/[eventId]/page.tsx', api: '/api/atlvs/kpi/financial/${eventId}' },
  { path: 'src/app/(platforms)/atlvs/kpi/marketing/[eventId]/page.tsx', api: '/api/atlvs/kpi/marketing/${eventId}' },
  { path: 'src/app/(platforms)/atlvs/kpi/operational/[projectId]/page.tsx', api: '/api/atlvs/kpi/operational/${projectId}' },
  { path: 'src/app/(platforms)/atlvs/n8n/page.tsx', api: '/api/atlvs/n8n' },
  { path: 'src/app/(platforms)/atlvs/opportunities/[id]/applications/[appId]/page.tsx', api: '/api/atlvs/opportunities/${id}/applications/${appId}' },
  { path: 'src/app/(platforms)/atlvs/opportunities/[id]/applications/page.tsx', api: '/api/atlvs/opportunities/${id}/applications' },
  { path: 'src/app/(platforms)/atlvs/opportunities/[id]/page.tsx', api: '/api/atlvs/opportunities/${id}' },
  { path: 'src/app/(platforms)/atlvs/opportunities/[id]/publish/page.tsx', api: '/api/atlvs/opportunities/${id}/publish' },
  { path: 'src/app/(platforms)/atlvs/projects/[id]/analytics/page.tsx', api: '/api/atlvs/projects/${id}/analytics' },
  { path: 'src/app/(platforms)/atlvs/projects/[id]/budget/page.tsx', api: '/api/atlvs/projects/${id}/budget' },
  { path: 'src/app/(platforms)/atlvs/projects/[id]/team/page.tsx', api: '/api/atlvs/projects/${id}/team' },
  { path: 'src/app/(platforms)/atlvs/reports/favorites/page.tsx', api: '/api/atlvs/reports/favorites' },
  { path: 'src/app/(platforms)/atlvs/reports/presets/[category]/page.tsx', api: '/api/atlvs/reports/presets/${category}' },
  { path: 'src/app/(platforms)/atlvs/reports/presets/page.tsx', api: '/api/atlvs/reports/presets' },
  { path: 'src/app/(platforms)/atlvs/reports/scheduled/page.tsx', api: '/api/atlvs/reports/scheduled' },
  { path: 'src/app/(platforms)/atlvs/settings/page.tsx', api: '/api/atlvs/settings' },
  { path: 'src/app/(platforms)/atlvs/tasks/[id]/assign/page.tsx', api: '/api/atlvs/tasks/${id}/assign' },
  { path: 'src/app/(platforms)/atlvs/tasks/[id]/complete/page.tsx', api: '/api/atlvs/tasks/${id}/complete' },
  { path: 'src/app/(platforms)/atlvs/tasks/[id]/time-entries/page.tsx', api: '/api/atlvs/tasks/${id}/time-entries' },
  { path: 'src/app/(platforms)/atlvs/teams/assign-roles/page.tsx', api: '/api/atlvs/teams/assign-roles' },
  { path: 'src/app/(platforms)/atlvs/teams/members/page.tsx', api: '/api/atlvs/teams/members' },
  { path: 'src/app/(platforms)/atlvs/teams/roles/page.tsx', api: '/api/atlvs/teams/roles' },
  { path: 'src/app/(platforms)/atlvs/workflows/[id]/execute/page.tsx', api: '/api/atlvs/workflows/${id}/execute' },
  
  // COMPVSS pages
  { path: 'src/app/(platforms)/compvss/advancing/[id]/approve/page.tsx', api: '/api/compvss/advancing/${id}/approve' },
  { path: 'src/app/(platforms)/compvss/advancing/[id]/page.tsx', api: '/api/compvss/advancing/${id}' },
  { path: 'src/app/(platforms)/compvss/advancing/[id]/reject/page.tsx', api: '/api/compvss/advancing/${id}/reject' },
  { path: 'src/app/(platforms)/compvss/advancing/access/page.tsx', api: '/api/compvss/advancing/access' },
  { path: 'src/app/(platforms)/compvss/advancing/accommodation/page.tsx', api: '/api/compvss/advancing/accommodation' },
  { path: 'src/app/(platforms)/compvss/advancing/marketing/page.tsx', api: '/api/compvss/advancing/marketing' },
  { path: 'src/app/(platforms)/compvss/advancing/permits/page.tsx', api: '/api/compvss/advancing/permits' },
  { path: 'src/app/(platforms)/compvss/advancing/security/page.tsx', api: '/api/compvss/advancing/security' },
  { path: 'src/app/(platforms)/compvss/advancing/staffing/page.tsx', api: '/api/compvss/advancing/staffing' },
  { path: 'src/app/(platforms)/compvss/advancing/technical/page.tsx', api: '/api/compvss/advancing/technical' },
  { path: 'src/app/(platforms)/compvss/advancing/transportation/page.tsx', api: '/api/compvss/advancing/transportation' },
  { path: 'src/app/(platforms)/compvss/affiliates/[id]/page.tsx', api: '/api/compvss/affiliates/${id}' },
  { path: 'src/app/(platforms)/compvss/affiliates/[id]/performance/page.tsx', api: '/api/compvss/affiliates/${id}/performance' },
  { path: 'src/app/(platforms)/compvss/affiliates/me/page.tsx', api: '/api/compvss/affiliates/me' },
  { path: 'src/app/(platforms)/compvss/applications/[id]/page.tsx', api: '/api/compvss/applications/${id}' },
  { path: 'src/app/(platforms)/compvss/assets/checkout/page.tsx', api: '/api/compvss/assets/checkout' },
  { path: 'src/app/(platforms)/compvss/checkin/history/page.tsx', api: '/api/compvss/checkin/history' },
  { path: 'src/app/(platforms)/compvss/checkin/stats/page.tsx', api: '/api/compvss/checkin/stats' },
  { path: 'src/app/(platforms)/compvss/day-of-show/check-in/page.tsx', api: '/api/compvss/day-of-show/check-in' },
  { path: 'src/app/(platforms)/compvss/day-of-show/tasks/page.tsx', api: '/api/compvss/day-of-show/tasks' },
  { path: 'src/app/(platforms)/compvss/expenses/[id]/approve/page.tsx', api: '/api/compvss/expenses/${id}/approve' },
  { path: 'src/app/(platforms)/compvss/expenses/[id]/reimburse/page.tsx', api: '/api/compvss/expenses/${id}/reimburse' },
  { path: 'src/app/(platforms)/compvss/expenses/[id]/reject/page.tsx', api: '/api/compvss/expenses/${id}/reject' },
  { path: 'src/app/(platforms)/compvss/issues/[id]/resolve/page.tsx', api: '/api/compvss/issues/${id}/resolve' },
  { path: 'src/app/(platforms)/compvss/opportunities/[id]/apply/page.tsx', api: '/api/compvss/opportunities/${id}/apply' },
  { path: 'src/app/(platforms)/compvss/opportunities/[id]/page.tsx', api: '/api/compvss/opportunities/${id}' },
  { path: 'src/app/(platforms)/compvss/tasks/[id]/complete/page.tsx', api: '/api/compvss/tasks/${id}/complete' },
  { path: 'src/app/(platforms)/compvss/tasks/[id]/page.tsx', api: '/api/compvss/tasks/${id}' },
  { path: 'src/app/(platforms)/compvss/teams/[id]/members/page.tsx', api: '/api/compvss/teams/${id}/members' },
  { path: 'src/app/(platforms)/compvss/teams/[id]/page.tsx', api: '/api/compvss/teams/${id}' },
  
  // GVTEWAY pages
  { path: 'src/app/(platforms)/gvteway/social/messages/page.tsx', api: '/api/messages' },
];

function addApiIntegration(filePath, apiEndpoint) {
  if (!existsSync(filePath)) {
    console.log(`⏭️  Skipping ${filePath} - file not found`);
    return false;
  }

  try {
    let content = readFileSync(filePath, 'utf-8');

    // Skip if already has API integration
    if (content.includes('apiClient.get') || content.includes('useEffect')) {
      console.log(`✓ ${filePath} already has API integration`);
      return false;
    }

    // Add React import if not present
    if (!content.includes("import * as React from 'react'")) {
      content = content.replace(
        /'use client';/,
        "'use client';\n\nimport * as React from 'react';"
      );
    }

    // Add apiClient import
    if (!content.includes('apiClient')) {
      const lastImport = content.lastIndexOf('import ');
      const endOfLastImport = content.indexOf('\n', lastImport);
      content = content.slice(0, endOfLastImport + 1) +
        "import { apiClient } from '@/lib/api/client';\n" +
        content.slice(endOfLastImport + 1);
    }

    // Add Spinner import
    if (!content.includes('Spinner')) {
      const lastImport = content.lastIndexOf('import ');
      const endOfLastImport = content.indexOf('\n', lastImport);
      content = content.slice(0, endOfLastImport + 1) +
        "import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';\n" +
        content.slice(endOfLastImport + 1);
    }

    // Add API integration code
    const functionMatch = content.match(/export default function \w+\(\) \{/);
    if (functionMatch) {
      const apiCode = API_TEMPLATE.replace('API_ENDPOINT', apiEndpoint);
      const insertIndex = functionMatch.index + functionMatch[0].length;
      content = content.slice(0, insertIndex) + apiCode + content.slice(insertIndex);
    }

    writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Added API integration to ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to process ${filePath}:`, error.message);
    return false;
  }
}

console.log('🚀 Batch implementing remaining API calls...\n');

let successCount = 0;
let skipCount = 0;

for (const mapping of remainingPages) {
  const result = addApiIntegration(mapping.path, mapping.api);
  if (result) {
    successCount++;
  } else {
    skipCount++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`   ✅ Successfully added: ${successCount}`);
console.log(`   ⏭️  Skipped: ${skipCount}`);
console.log(`\n✨ Done!`);
