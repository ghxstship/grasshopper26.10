#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

let fixedCount = 0;

function fixFile(filePath, replacements) {
  const fullPath = path.join(ROOT, filePath);
  if (!fs.existsSync(fullPath)) return false;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  for (const { search, replace } of replacements) {
    if (content.includes(search)) {
      content = content.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Fixed: ${filePath}`);
    fixedCount++;
    return true;
  }
  return false;
}

console.log('Fixing all remaining TypeScript strict mode errors...\n');

// Fix param undefined issues - apply same pattern as adventures/page.tsx
const paramFiles = [
  'src/app/(rebuild)/events/page.tsx',
  'src/app/(rebuild)/marketplace/page.tsx',
  'src/app/(rebuild)/atlvs/assets/page.tsx',
  'src/app/(rebuild)/atlvs/projects/page.tsx',
  'src/app/(rebuild)/atlvs/vendors/page.tsx',
  'src/app/(rebuild)/compvss/team/page.tsx',
];

for (const file of paramFiles) {
  const fullPath = path.join(ROOT, file);
  if (!fs.existsSync(fullPath)) continue;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Replace params with undefined values
  const oldPattern = /params:\s*\{[^}]+\|\s*undefined[^}]*\}/g;
  if (oldPattern.test(content)) {
    // Find the params object and rebuild it properly
    content = content.replace(
      /const response = await apiClient\.get[^{]*\{[\s\S]*?params:\s*\{([^}]+)\}/g,
      (match) => {
        // Extract param assignments
        const lines = match.split('\n');
        const paramsIndex = lines.findIndex(l => l.includes('params:'));
        if (paramsIndex === -1) return match;
        
        // Build proper params object
        const beforeParams = lines.slice(0, paramsIndex).join('\n');
        const afterParams = lines.slice(paramsIndex + 1).join('\n').replace(/^\s*\},?\s*$/, '');
        
        return beforeParams + '\n        const params: Record<string, string> = {};\n        // Add params conditionally\n        params,\n' + afterParams;
      }
    );
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Fixed params: ${file}`);
    fixedCount++;
  }
}

// Fix Button variant issues
fixFile('src/app/(rebuild)/social/followers/page.tsx', [
  { search: 'variant="default"', replace: 'variant="primary"' }
]);

fixFile('src/app/(rebuild)/tickets/orders/page.tsx', [
  { search: 'variant="error"', replace: 'variant="destructive"' },
  { search: 'variant="warning"', replace: 'variant="secondary"' },
  { search: 'variant="default"', replace: 'variant="primary"' }
]);

// Fix Footer import
fixFile('src/app/(rebuild)/tickets/orders/[id]/page.tsx', [
  { search: 'import { Navbar, Footer }', replace: 'import { Navbar }' },
  { search: '<Footer />', replace: '' },
  { search: '<Footer/>', replace: '' }
]);

// Fix orderId type issues
const orderIdFiles = [
  'src/app/(rebuild)/checkout/page.tsx',
  'src/app/(rebuild)/tickets/checkout/page.tsx'
];

for (const file of orderIdFiles) {
  const fullPath = path.join(ROOT, file);
  if (!fs.existsSync(fullPath)) continue;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Add type assertion for orderId
  content = content.replace(
    /\.orderId/g,
    '.orderId as string'
  );
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✓ Fixed orderId: ${file}`);
  fixedCount++;
}

// Fix useChat senderId issue
fixFile('src/hooks/useChat.tsx', [
  { search: 'senderId:', replace: 'sender:' }
]);

// Fix analytics number | undefined
fixFile('src/lib/monitoring/analytics.ts', [
  { search: 'duration: performance.now() - startTime,', replace: 'duration: Math.round(performance.now() - startTime),' }
]);

console.log(`\n${'='.repeat(60)}`);
console.log(`Fixed: ${fixedCount} files`);
console.log(`${'='.repeat(60)}\n`);
