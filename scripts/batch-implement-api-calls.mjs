#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const API_TEMPLATE = `
  const [data, setData] = React.useState<any[]>([]);
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
          setData(response.data.DATA_KEY || response.data);
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

const pageMappings = [
  { path: 'src/app/(platforms)/atlvs/analytics/export/page.tsx', api: '/api/atlvs/analytics/export', key: 'exports' },
  { path: 'src/app/(platforms)/atlvs/analytics/insights/page.tsx', api: '/api/atlvs/analytics/insights', key: 'insights' },
  { path: 'src/app/(platforms)/atlvs/api-keys/page.tsx', api: '/api/atlvs/api-keys', key: 'apiKeys' },
  { path: 'src/app/(platforms)/atlvs/audit-log/page.tsx', api: '/api/atlvs/audit-log', key: 'logs' },
  { path: 'src/app/(platforms)/atlvs/automation/page.tsx', api: '/api/atlvs/automation', key: 'automations' },
  { path: 'src/app/(platforms)/atlvs/automation/templates/page.tsx', api: '/api/atlvs/automation/templates', key: 'templates' },
  { path: 'src/app/(platforms)/atlvs/integrations/page.tsx', api: '/api/atlvs/integrations', key: 'integrations' },
  { path: 'src/app/(platforms)/atlvs/inventory/page.tsx', api: '/api/atlvs/inventory', key: 'inventory' },
  { path: 'src/app/(platforms)/atlvs/maintenance/page.tsx', api: '/api/atlvs/maintenance', key: 'maintenance' },
  { path: 'src/app/(platforms)/atlvs/opportunities/page.tsx', api: '/api/atlvs/opportunities', key: 'opportunities' },
  { path: 'src/app/(platforms)/compvss/applications/page.tsx', api: '/api/compvss/applications', key: 'applications' },
  { path: 'src/app/(platforms)/compvss/assets/page.tsx', api: '/api/compvss/assets', key: 'assets' },
  { path: 'src/app/(platforms)/compvss/checkin/page.tsx', api: '/api/compvss/checkin', key: 'checkins' },
  { path: 'src/app/(platforms)/compvss/documents/page.tsx', api: '/api/compvss/documents', key: 'documents' },
  { path: 'src/app/(platforms)/compvss/operations/page.tsx', api: '/api/compvss/operations', key: 'operations' },
  { path: 'src/app/(platforms)/compvss/opportunities/page.tsx', api: '/api/compvss/opportunities', key: 'opportunities' },
  { path: 'src/app/(platforms)/compvss/qr/page.tsx', api: '/api/compvss/qr/hub', key: 'qrData' },
  { path: 'src/app/(platforms)/compvss/referrals/page.tsx', api: '/api/compvss/referrals', key: 'referrals' },
  { path: 'src/app/(platforms)/compvss/teams/page.tsx', api: '/api/compvss/teams', key: 'teams' },
];

function addApiIntegration(filePath, apiEndpoint, dataKey) {
  if (!existsSync(filePath)) {
    console.log(`⏭️  Skipping ${filePath} - file not found`);
    return false;
  }

  try {
    let content = readFileSync(filePath, 'utf-8');

    // Skip if already has API integration
    if (content.includes('apiClient') || content.includes('useEffect')) {
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
      const apiCode = API_TEMPLATE
        .replace('API_ENDPOINT', apiEndpoint)
        .replace('DATA_KEY', dataKey);
      
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

console.log('🚀 Batch implementing API calls...\n');

let successCount = 0;
let skipCount = 0;

for (const mapping of pageMappings) {
  const result = addApiIntegration(mapping.path, mapping.api, mapping.key);
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
