#!/usr/bin/env node
/**
 * Fix All Params Await Issues
 * Adds const { id } = await params; to all dynamic route handlers
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const files = glob.sync('src/app/api/**/[*]/**.ts', {
  ignore: ['**/node_modules/**', '**/*.test.ts', '**/*.spec.ts']
});

let fixedCount = 0;

for (const file of files) {
  try {
    let content = readFileSync(file, 'utf-8');
    let modified = false;

    // Check if file has params.id or params.slug usage
    if ((content.includes('params.id') || content.includes('params.slug')) && 
        content.includes('{ params }: { params: Promise<{')) {
      
      // Find all function declarations with params
      const functionRegex = /(export async function \w+\([^)]*\{ params \}[^)]*\) \{\s*\n\s*try \{\s*\n)/g;
      
      let match;
      while ((match = functionRegex.exec(content)) !== null) {
        const insertPoint = match.index + match[0].length;
        
        // Check if we already have await params
        const nextLines = content.slice(insertPoint, insertPoint + 200);
        if (!nextLines.includes('await params')) {
          // Determine if we need id or slug
          const needsId = content.includes('params.id');
          const needsSlug = content.includes('params.slug');
          
          let destructure = '';
          if (needsId && needsSlug) {
            destructure = '    const { id, slug } = await params;\n';
          } else if (needsId) {
            destructure = '    const { id } = await params;\n';
          } else if (needsSlug) {
            destructure = '    const { slug } = await params;\n';
          }
          
          if (destructure) {
            content = content.slice(0, insertPoint) + destructure + content.slice(insertPoint);
            modified = true;
          }
        }
      }
      
      // Replace params.id with id and params.slug with slug
      if (modified) {
        content = content.replace(/params\.id/g, 'id');
        content = content.replace(/params\.slug/g, 'slug');
      }
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
