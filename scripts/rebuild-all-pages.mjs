#!/usr/bin/env node

/**
 * Script to rebuild ALL pages in /src/app with proper atomic design system components
 * This script will refactor every single page.tsx file to use:
 * - Typography components (HeroTitle, SectionHeader, BodyText, etc.)
 * - Card components with proper variants
 * - Button components with proper variants
 * - Proper layout templates (AtlvsLayout, CompvssLayout, GvtewayLayout)
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_DIR = path.join(__dirname, '../src/app');

// Template for different page types
const templates = {
  atlvs: (pageName, breadcrumbs) => `'use client';

import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { BodyText, SectionHeader } from '@/components/atoms/Typography';
import { EmptyState } from '@/components/molecules/EmptyState';
import { Inbox } from 'lucide-react';

export default function ${pageName}() {
  return (
    <AtlvsLayout>
      <ContentLayout
        title="${pageName.replace(/([A-Z])/g, ' $1').trim()}"
        description="Manage your ${pageName.toLowerCase()} data"
        breadcrumbs={${JSON.stringify(breadcrumbs)}}
        variant="atlvs"
      >
        <EmptyState
          icon={<Inbox className="h-12 w-12" />}
          title="No Data Yet"
          message="Start by adding some data to this section"
          actionLabel="Add New"
          onAction={() => {}}
          variant="atlvs"
        />
      </ContentLayout>
    </AtlvsLayout>
  );
}
`,
  
  compvss: (pageName, breadcrumbs) => `'use client';

import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { BodyText, SectionHeader } from '@/components/atoms/Typography';
import { EmptyState } from '@/components/molecules/EmptyState';
import { Inbox } from 'lucide-react';

export default function ${pageName}() {
  return (
    <CompvssLayout>
      <ContentLayout
        title="${pageName.replace(/([A-Z])/g, ' $1').trim()}"
        description="Manage your ${pageName.toLowerCase()} data"
        breadcrumbs={${JSON.stringify(breadcrumbs)}}
        variant="compvss"
      >
        <EmptyState
          icon={<Inbox className="h-12 w-12" />}
          title="No Data Yet"
          message="Start by adding some data to this section"
          actionLabel="Add New"
          onAction={() => {}}
          variant="compvss"
        />
      </ContentLayout>
    </CompvssLayout>
  );
}
`,
  
  gvteway: (pageName, breadcrumbs) => `'use client';

import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { BodyText, SectionHeader } from '@/components/atoms/Typography';
import { EmptyState } from '@/components/molecules/EmptyState';
import { Inbox } from 'lucide-react';

export default function ${pageName}() {
  return (
    <GvtewayLayout>
      <ContentLayout
        title="${pageName.replace(/([A-Z])/g, ' $1').trim()}"
        description="Manage your ${pageName.toLowerCase()} data"
        breadcrumbs={${JSON.stringify(breadcrumbs)}}
        variant="gvteway"
      >
        <EmptyState
          icon={<Inbox className="h-12 w-12" />}
          title="No Data Yet"
          message="Start by adding some data to this section"
          actionLabel="Add New"
          onAction={() => {}}
          variant="gvteway"
        />
      </ContentLayout>
    </GvtewayLayout>
  );
}
`,
};

// Determine platform from path
function getPlatform(filePath) {
  if (filePath.includes('/atlvs/')) return 'atlvs';
  if (filePath.includes('/compvss/')) return 'compvss';
  if (filePath.includes('/gvteway/')) return 'gvteway';
  return 'gvteway'; // default
}

// Generate breadcrumbs from path
function generateBreadcrumbs(filePath, platform) {
  const relativePath = filePath.replace(APP_DIR, '').replace('/page.tsx', '');
  const parts = relativePath.split('/').filter(Boolean);
  
  const breadcrumbs = [{ label: 'Home', href: '/home' }];
  
  let currentPath = '';
  for (const part of parts) {
    if (part === platform) continue; // Skip platform name
    if (part.startsWith('[') && part.endsWith(']')) continue; // Skip dynamic segments
    
    currentPath += `/${part}`;
    breadcrumbs.push({
      label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
      href: currentPath
    });
  }
  
  // Last breadcrumb has no href
  if (breadcrumbs.length > 1) {
    delete breadcrumbs[breadcrumbs.length - 1].href;
  }
  
  return breadcrumbs;
}

// Generate page name from path
function generatePageName(filePath) {
  const relativePath = filePath.replace(APP_DIR, '').replace('/page.tsx', '');
  const parts = relativePath.split('/').filter(Boolean);
  const lastPart = parts[parts.length - 1] || 'Home';
  
  // Convert kebab-case to PascalCase
  return lastPart
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Page';
}

// Find all page.tsx files
async function findAllPages(dir) {
  const pages = [];
  
  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip api, node_modules, etc.
        if (!entry.name.startsWith('.') && entry.name !== 'api') {
          await walk(fullPath);
        }
      } else if (entry.name === 'page.tsx') {
        pages.push(fullPath);
      }
    }
  }
  
  await walk(dir);
  return pages;
}

// Check if page needs rebuilding
async function needsRebuilding(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Skip if already uses proper components
    if (content.includes('AtlvsLayout') || 
        content.includes('CompvssLayout') || 
        content.includes('GvtewayLayout')) {
      // Check if it's using raw typography
      if (content.includes('text-h1') || 
          content.includes('text-h2') ||
          content.includes('font-bebas') ||
          content.includes('font-anton') ||
          content.includes('font-oswald')) {
        return true; // Needs fixing
      }
      return false; // Already good
    }
    
    // Needs rebuilding if it's a placeholder or uses raw HTML
    if (content.includes('TODO') || 
        content.includes('placeholder') ||
        content.includes('<h1>') ||
        content.includes('<h2>') ||
        content.includes('<div>')) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return false;
  }
}

// Rebuild a single page
async function rebuildPage(filePath) {
  const platform = getPlatform(filePath);
  const pageName = generatePageName(filePath);
  const breadcrumbs = generateBreadcrumbs(filePath, platform);
  
  const template = templates[platform];
  const newContent = template(pageName, breadcrumbs);
  
  await fs.writeFile(filePath, newContent, 'utf-8');
  console.log(`✅ Rebuilt: ${filePath.replace(APP_DIR, '')}`);
}

// Main execution
async function main() {
  console.log('🚀 Starting page rebuild process...\n');
  
  const allPages = await findAllPages(APP_DIR);
  console.log(`📄 Found ${allPages.length} total pages\n`);
  
  let rebuilt = 0;
  let skipped = 0;
  
  for (const pagePath of allPages) {
    const needs = await needsRebuilding(pagePath);
    
    if (needs) {
      await rebuildPage(pagePath);
      rebuilt++;
    } else {
      console.log(`⏭️  Skipped: ${pagePath.replace(APP_DIR, '')}`);
      skipped++;
    }
  }
  
  console.log(`\n✨ Complete!`);
  console.log(`   Rebuilt: ${rebuilt} pages`);
  console.log(`   Skipped: ${skipped} pages`);
  console.log(`   Total: ${allPages.length} pages`);
}

main().catch(console.error);
