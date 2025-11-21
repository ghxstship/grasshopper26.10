#!/usr/bin/env tsx

/**
 * Implement Missing API Calls in Pages
 * Adds API integration to pages that are missing it
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface PageApiMapping {
  pagePath: string;
  apiEndpoint: string;
  dataType: string;
}

// Define mappings for pages that need API calls
const mappings: PageApiMapping[] = [
  // ATLVS Platform
  { pagePath: 'src/app/(platforms)/atlvs/advancing/page.tsx', apiEndpoint: '/api/atlvs/advancing', dataType: 'requests' },
  { pagePath: 'src/app/(platforms)/atlvs/analytics/page.tsx', apiEndpoint: '/api/atlvs/analytics/hub', dataType: 'analytics' },
  { pagePath: 'src/app/(platforms)/atlvs/analytics/dashboards/page.tsx', apiEndpoint: '/api/atlvs/analytics/dashboards', dataType: 'dashboards' },
  { pagePath: 'src/app/(platforms)/atlvs/analytics/export/page.tsx', apiEndpoint: '/api/atlvs/analytics/export', dataType: 'exports' },
  { pagePath: 'src/app/(platforms)/atlvs/analytics/insights/page.tsx', apiEndpoint: '/api/atlvs/analytics/insights', dataType: 'insights' },
  { pagePath: 'src/app/(platforms)/atlvs/api-keys/page.tsx', apiEndpoint: '/api/atlvs/api-keys', dataType: 'apiKeys' },
  { pagePath: 'src/app/(platforms)/atlvs/audit-log/page.tsx', apiEndpoint: '/api/atlvs/audit-log', dataType: 'logs' },
  { pagePath: 'src/app/(platforms)/atlvs/automation/page.tsx', apiEndpoint: '/api/atlvs/automation', dataType: 'automations' },
  { pagePath: 'src/app/(platforms)/atlvs/integrations/page.tsx', apiEndpoint: '/api/atlvs/integrations', dataType: 'integrations' },
  { pagePath: 'src/app/(platforms)/atlvs/inventory/page.tsx', apiEndpoint: '/api/atlvs/inventory', dataType: 'inventory' },
  { pagePath: 'src/app/(platforms)/atlvs/maintenance/page.tsx', apiEndpoint: '/api/atlvs/maintenance', dataType: 'maintenance' },
  { pagePath: 'src/app/(platforms)/atlvs/opportunities/page.tsx', apiEndpoint: '/api/atlvs/opportunities', dataType: 'opportunities' },
  
  // COMPVSS Platform
  { pagePath: 'src/app/(platforms)/compvss/operations/page.tsx', apiEndpoint: '/api/compvss/operations', dataType: 'operations' },
  { pagePath: 'src/app/(platforms)/compvss/page.tsx', apiEndpoint: '/api/compvss/dashboard', dataType: 'dashboard' },
  { pagePath: 'src/app/(platforms)/compvss/qr/page.tsx', apiEndpoint: '/api/compvss/qr/hub', dataType: 'qrData' },
  { pagePath: 'src/app/(platforms)/compvss/referrals/page.tsx', apiEndpoint: '/api/compvss/referrals', dataType: 'referrals' },
  { pagePath: 'src/app/(platforms)/compvss/applications/page.tsx', apiEndpoint: '/api/compvss/applications', dataType: 'applications' },
  { pagePath: 'src/app/(platforms)/compvss/assets/page.tsx', apiEndpoint: '/api/compvss/assets', dataType: 'assets' },
  { pagePath: 'src/app/(platforms)/compvss/checkin/page.tsx', apiEndpoint: '/api/compvss/checkin', dataType: 'checkins' },
  { pagePath: 'src/app/(platforms)/compvss/documents/page.tsx', apiEndpoint: '/api/compvss/documents', dataType: 'documents' },
  { pagePath: 'src/app/(platforms)/compvss/opportunities/page.tsx', apiEndpoint: '/api/compvss/opportunities', dataType: 'opportunities' },
  { pagePath: 'src/app/(platforms)/compvss/teams/page.tsx', apiEndpoint: '/api/compvss/teams', dataType: 'teams' },
];

function addApiCallToPage(filePath: string, apiEndpoint: string, dataType: string): boolean {
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    // Skip if already has API calls
    if (content.includes('apiClient') || content.includes('/api/')) {
      console.log(`✓ ${filePath} already has API integration`);
      return false;
    }
    
    // Check if it's a client component
    if (!content.includes("'use client'")) {
      console.log(`⚠ ${filePath} is not a client component, skipping`);
      return false;
    }
    
    let modified = content;
    
    // Add imports if not present
    if (!modified.includes('import { apiClient }')) {
      const importMatch = modified.match(/^(import.*\n)+/m);
      if (importMatch) {
        const lastImportIndex = importMatch[0].lastIndexOf('\n');
        modified = modified.slice(0, importMatch.index! + lastImportIndex + 1) +
          "import { apiClient } from '@/lib/api/client';\n" +
          modified.slice(importMatch.index! + lastImportIndex + 1);
      }
    }
    
    if (!modified.includes('import { Spinner }')) {
      const importMatch = modified.match(/^(import.*\n)+/m);
      if (importMatch) {
        const lastImportIndex = importMatch[0].lastIndexOf('\n');
        modified = modified.slice(0, importMatch.index! + lastImportIndex + 1) +
          "import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';\n" +
          modified.slice(importMatch.index! + lastImportIndex + 1);
      }
    }
    
    // Add state and effect
    const functionMatch = modified.match(/export default function \w+\(\) \{/);
    if (functionMatch) {
      const insertIndex = functionMatch.index! + functionMatch[0].length;
      const stateCode = `
  const [${dataType}, set${dataType.charAt(0).toUpperCase() + dataType.slice(1)}] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetch${dataType.charAt(0).toUpperCase() + dataType.slice(1)} = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ ${dataType}: any[] }>('${apiEndpoint}');
        if (response.data?.${dataType}) {
          set${dataType.charAt(0).toUpperCase() + dataType.slice(1)}(response.data.${dataType});
        }
      } catch (error) {
        console.error('Failed to fetch ${dataType}:', error);
      } finally {
        setLoading(false);
      }
    };

    fetch${dataType.charAt(0).toUpperCase() + dataType.slice(1)}();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
`;
      modified = modified.slice(0, insertIndex) + stateCode + modified.slice(insertIndex);
    }
    
    writeFileSync(filePath, modified, 'utf-8');
    console.log(`✅ Added API integration to ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to process ${filePath}:`, error);
    return false;
  }
}

function main() {
  console.log('🚀 Implementing missing API calls in pages...\n');
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  for (const mapping of mappings) {
    const result = addApiCallToPage(mapping.pagePath, mapping.apiEndpoint, mapping.dataType);
    if (result) {
      successCount++;
    } else {
      skipCount++;
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Successfully added: ${successCount}`);
  console.log(`   ⏭️  Skipped: ${skipCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
}

main();
