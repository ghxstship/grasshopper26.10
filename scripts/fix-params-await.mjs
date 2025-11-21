#!/usr/bin/env node
/**
 * Fix Params Await Script
 * Adds await params destructuring for Next.js 15 dynamic routes
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const files = glob.sync('src/app/api/**/*.ts', {
  ignore: ['**/node_modules/**', '**/*.test.ts', '**/*.spec.ts']
});

let fixedCount = 0;
const errors = [];

for (const file of files) {
  try {
    let content = readFileSync(file, 'utf-8');
    let modified = false;

    // Pattern: Fix params.id access without await
    // Look for: where: { id: params.id }
    if (content.includes('params.id') && !content.includes('const { id } = await params')) {
      // Check if this is a dynamic route handler
      if (content.match(/\{ params \}: \{ params: Promise<\{ id: string \}> \}/)) {
        // Find the function and add await params at the start
        const functionPattern = /(export async function \w+\([^)]+\{ params \}[^)]+\) \{[\s\n]+)(try \{)?/;
        const match = content.match(functionPattern);
        
        if (match) {
          const replacement = match[0] + '\n    const { id } = await params;';
          content = content.replace(functionPattern, replacement);
          
          // Now replace all params.id with just id
          content = content.replace(/params\.id/g, 'id');
          modified = true;
        }
      }
    }

    if (modified) {
      writeFileSync(file, content, 'utf-8');
      fixedCount++;
      console.log(`✓ Fixed: ${file}`);
    }
  } catch (error) {
    errors.push({ file, error: error.message });
    console.error(`✗ Error in ${file}:`, error.message);
  }
}

console.log(`\n✅ Fixed ${fixedCount} files`);
if (errors.length > 0) {
  console.log(`\n❌ Errors in ${errors.length} files:`);
  errors.forEach(({ file, error }) => console.log(`  - ${file}: ${error}`));
}
