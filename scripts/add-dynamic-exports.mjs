#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

console.log('🔍 Finding all client pages that use hooks...\n');

// Find all page.tsx files that import from hooks
const pagesWithHooks = execSync(
  `find src/app -name "page.tsx" -type f -exec grep -l "from '@/lib/hooks\\|from '@/hooks" {} \\;`,
  { encoding: 'utf-8' }
)
  .trim()
  .split('\n')
  .filter(Boolean);

console.log(`Found ${pagesWithHooks.length} pages with hooks\n`);

let modified = 0;
let skipped = 0;

for (const filePath of pagesWithHooks) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    // Check if already has dynamic export
    if (content.includes("export const dynamic = 'force-dynamic'")) {
      skipped++;
      continue;
    }
    
    // Check if it's a client component
    if (!content.includes("'use client'")) {
      skipped++;
      continue;
    }
    
    // Add dynamic export after 'use client'
    const lines = content.split('\n');
    const useClientIndex = lines.findIndex(line => line.includes("'use client'"));
    
    if (useClientIndex !== -1) {
      // Insert after 'use client' and any blank lines
      let insertIndex = useClientIndex + 1;
      while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
        insertIndex++;
      }
      
      lines.splice(insertIndex, 0, '', "export const dynamic = 'force-dynamic';");
      
      const newContent = lines.join('\n');
      writeFileSync(filePath, newContent, 'utf-8');
      
      modified++;
      console.log(`✅ ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Modified: ${modified}`);
console.log(`   Skipped: ${skipped}`);
console.log(`   Total: ${pagesWithHooks.length}`);
