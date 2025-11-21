#!/usr/bin/env node
/**
 * Fix Auth Imports Script
 * Replaces incorrect getServerSession imports with correct auth() from @/lib/auth
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

    // Pattern 1: Fix getServerSession import
    if (content.includes('import getServerSession from \'next-auth\'')) {
      content = content.replace(
        /import getServerSession from ['"]next-auth['"];?\n/g,
        ''
      );
      modified = true;
    }

    // Pattern 2: Remove authConfig import if it exists
    if (content.includes('import { authConfig }')) {
      content = content.replace(
        /import \{ authConfig \} from ['"]@\/app\/api\/auth\/\[\.\.\.nextauth\]\/route['"];?\n/g,
        ''
      );
      modified = true;
    }

    // Pattern 3: Add auth import if session is used but auth not imported
    if (content.includes('getServerSession(authConfig)') || content.includes('await getServerSession')) {
      if (!content.includes('import { auth }') && !content.includes("import { auth,")) {
        // Find the first import statement
        const firstImportMatch = content.match(/^import .+;$/m);
        if (firstImportMatch) {
          const insertPosition = content.indexOf(firstImportMatch[0]) + firstImportMatch[0].length;
          content = content.slice(0, insertPosition) + "\nimport { auth } from '@/lib/auth';" + content.slice(insertPosition);
          modified = true;
        }
      }
    }

    // Pattern 4: Replace getServerSession(authConfig) with auth()
    if (content.includes('getServerSession(authConfig)')) {
      content = content.replace(/getServerSession\(authConfig\)/g, 'auth()');
      modified = true;
    }

    // Pattern 5: Replace await getServerSession() with auth()
    if (content.includes('await getServerSession()')) {
      content = content.replace(/await getServerSession\(\)/g, 'await auth()');
      modified = true;
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
