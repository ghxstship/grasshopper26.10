#!/usr/bin/env tsx
/**
 * Page Migration Automation Script
 * Automatically applies PageWrapper, error handling, and loading states to all pages
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface PageInfo {
  path: string;
  app: 'gvteway' | 'compvss' | 'atlvs';
  type: 'list' | 'detail' | 'form' | 'dashboard' | 'auth' | 'other';
  hasPageWrapper: boolean;
  hasErrorBoundary: boolean;
  hasLoadingState: boolean;
}

/**
 * Analyze a page file
 */
function analyzePage(filePath: string): PageInfo {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const app = filePath.includes('/gvteway/') ? 'gvteway' 
    : filePath.includes('/compvss/') ? 'compvss'
    : filePath.includes('/atlvs/') ? 'atlvs'
    : 'gvteway';
  
  const type = filePath.includes('[id]') ? 'detail'
    : filePath.includes('/new') || filePath.includes('/edit') ? 'form'
    : filePath.includes('dashboard') ? 'dashboard'
    : filePath.includes('auth') || filePath.includes('login') ? 'auth'
    : filePath.match(/\/(page\.tsx)$/) ? 'list'
    : 'other';
  
  return {
    path: filePath,
    app,
    type,
    hasPageWrapper: content.includes('PageWrapper') || content.includes('usePageState'),
    hasErrorBoundary: content.includes('ErrorBoundary') || content.includes('PageErrorBoundary'),
    hasLoadingState: content.includes('LoadingState') || content.includes('isLoading'),
  };
}

/**
 * Generate enhanced page template
 */
function generatePageTemplate(pageInfo: PageInfo, originalContent: string): string {
  const { app, type } = pageInfo;
  
  // Extract existing component name
  const componentMatch = originalContent.match(/export default function (\w+)/);
  const componentName = componentMatch ? componentMatch[1] : 'Page';
  
  // Extract existing imports
  const hasUseClient = originalContent.includes("'use client'");
  
  return `${hasUseClient ? "'use client';\n\n" : ''}import { PageWrapper } from '@/components/templates/PageWrapper';
import { usePageState } from '@/hooks/usePageState';
import { LoadingState } from '@/components/molecules/LoadingState';
import { ErrorState } from '@/components/molecules/ErrorState';
import { EmptyState } from '@/components/molecules/EmptyState';

${originalContent.split('\n').filter(line => 
  line.includes('import') && 
  !line.includes('PageWrapper') &&
  !line.includes('usePageState') &&
  !line.includes('LoadingState') &&
  !line.includes('ErrorState')
).join('\n')}

export default function ${componentName}({ params }: { params?: Record<string, string> }) {
  const { data, isLoading, error, refetch } = usePageState({
    queryKey: ['${app}', '${type}', params?.id],
    queryFn: async () => {
      // TODO: Replace with actual data fetching
      return {};
    },
  });

  return (
    <PageWrapper
      title="${componentName}"
      breadcrumbs={[
        { label: 'Home', href: '/${app}' },
        { label: '${componentName}' },
      ]}
    >
      {isLoading && <LoadingState />}
      
      {error && (
        <ErrorState
          title="Failed to load data"
          message={error.message}
          onRetry={refetch}
        />
      )}
      
      {!isLoading && !error && !data && (
        <EmptyState
          title="No data found"
          message="There is no data to display"
        />
      )}
      
      {!isLoading && !error && data && (
        <div>
          {/* TODO: Implement page content */}
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </PageWrapper>
  );
}
`;
}

/**
 * Migrate a single page
 */
function migratePage(pageInfo: PageInfo, dryRun: boolean = true): boolean {
  if (pageInfo.hasPageWrapper) {
    console.log(`✓ ${pageInfo.path} - Already migrated`);
    return false;
  }
  
  try {
    const originalContent = fs.readFileSync(pageInfo.path, 'utf-8');
    const newContent = generatePageTemplate(pageInfo, originalContent);
    
    if (dryRun) {
      console.log(`→ ${pageInfo.path} - Would migrate (${pageInfo.type})`);
      return true;
    }
    
    // Backup original
    fs.writeFileSync(`${pageInfo.path}.backup`, originalContent);
    
    // Write new content
    fs.writeFileSync(pageInfo.path, newContent);
    
    console.log(`✓ ${pageInfo.path} - Migrated successfully`);
    return true;
  } catch (error) {
    console.error(`✗ ${pageInfo.path} - Migration failed:`, error);
    return false;
  }
}

/**
 * Main migration function
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--apply');
  const app = args.find(arg => ['gvteway', 'compvss', 'atlvs'].includes(arg));
  
  console.log('🚀 Page Migration Tool');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'APPLY CHANGES'}`);
  console.log(`Filter: ${app || 'ALL APPS'}\n`);
  
  // Find all page files
  const pageFiles = await glob('src/app/**/page.tsx', {
    ignore: ['**/node_modules/**', '**/.next/**'],
  });
  
  console.log(`Found ${pageFiles.length} page files\n`);
  
  // Analyze pages
  const pages = pageFiles.map(analyzePage);
  
  // Filter by app if specified
  const filteredPages = app 
    ? pages.filter(p => p.app === app)
    : pages;
  
  // Group by status
  const migrated = filteredPages.filter(p => p.hasPageWrapper);
  const needsMigration = filteredPages.filter(p => !p.hasPageWrapper);
  
  console.log('📊 Status:');
  console.log(`  ✓ Migrated: ${migrated.length}`);
  console.log(`  → Needs migration: ${needsMigration.length}\n`);
  
  // Show breakdown by app
  console.log('📱 By App:');
  ['gvteway', 'compvss', 'atlvs'].forEach(appName => {
    const appPages = filteredPages.filter(p => p.app === appName);
    const appMigrated = appPages.filter(p => p.hasPageWrapper).length;
    const appTotal = appPages.length;
    const percentage = appTotal > 0 ? Math.round((appMigrated / appTotal) * 100) : 0;
    console.log(`  ${appName.toUpperCase()}: ${appMigrated}/${appTotal} (${percentage}%)`);
  });
  
  console.log('\n📋 By Type:');
  ['list', 'detail', 'form', 'dashboard', 'auth', 'other'].forEach(type => {
    const typePages = filteredPages.filter(p => p.type === type);
    const typeMigrated = typePages.filter(p => p.hasPageWrapper).length;
    const typeTotal = typePages.length;
    if (typeTotal > 0) {
      console.log(`  ${type}: ${typeMigrated}/${typeTotal}`);
    }
  });
  
  if (needsMigration.length === 0) {
    console.log('\n✅ All pages are already migrated!');
    return;
  }
  
  console.log(`\n${dryRun ? '🔍 Would migrate' : '🔧 Migrating'} ${needsMigration.length} pages...\n`);
  
  // Migrate pages
  let successCount = 0;
  for (const page of needsMigration) {
    if (migratePage(page, dryRun)) {
      successCount++;
    }
  }
  
  console.log(`\n${dryRun ? '📝 Summary' : '✅ Migration Complete'}:`);
  console.log(`  ${successCount} pages ${dryRun ? 'would be' : 'were'} migrated`);
  
  if (dryRun) {
    console.log('\n💡 To apply changes, run: npm run migrate-pages -- --apply');
    console.log('💡 To migrate specific app: npm run migrate-pages -- --apply gvteway');
  } else {
    console.log('\n✅ Backups saved with .backup extension');
    console.log('💡 Review changes and remove backups when satisfied');
  }
}

main().catch(console.error);
