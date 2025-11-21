#!/usr/bin/env node
/**
 * Remove Unused getServerSession Imports
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const files = glob.sync('src/app/api/**/*.ts', {
  ignore: ['**/node_modules/**', '**/*.test.ts', '**/*.spec.ts']
});

let fixedCount = 0;

for (const file of files) {
  try {
    let content = readFileSync(file, 'utf-8');
    let modified = false;

    // Remove unused getServerSession import
    if (content.includes('import { getServerSession }') && !content.includes('getServerSession(')) {
      content = content.replace(/import \{ getServerSession \} from ['"]next-auth['"];?\n/g, '');
      modified = true;
    }

    if (modified) {
      writeFileSync(file, content, 'utf-8');
      fixedCount++;
      console.log(`✓ Fixed: ${file}`);
    }
  } catch (error) {
    console.error(`✗ Error in ${file}:`, error.message);
  }
}

console.log(`\n✅ Fixed ${fixedCount} files`);
