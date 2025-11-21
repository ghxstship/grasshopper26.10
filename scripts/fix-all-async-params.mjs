#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

let fixedCount = 0;
let errorCount = 0;

function findFiles(dir, pattern, exclude = ['node_modules', '.next', 'dist']) {
  const results = [];
  const scan = (d) => {
    try {
      const items = fs.readdirSync(path.join(ROOT, d), { withFileTypes: true });
      for (const item of items) {
        const p = path.join(d, item.name);
        if (item.isDirectory()) {
          if (!exclude.includes(item.name)) scan(p);
        } else if (item.name.match(pattern)) {
          results.push(p);
        }
      }
    } catch {}
  };
  scan(dir);
  return results;
}

function fixAsyncParams(filePath) {
  const fullPath = path.join(ROOT, filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Pattern 1: Fix function signature - params type
  const paramTypeRegex = /\{ params \}: \{ params: \{([^}]+)\} \}/g;
  if (paramTypeRegex.test(content)) {
    content = content.replace(
      /\{ params \}: \{ params: \{([^}]+)\} \}/g,
      '{ params }: { params: Promise<{$1}> }'
    );
    modified = true;
  }

  // Pattern 2: Add await params destructuring at start of function
  // Look for functions that use params but don't await it
  const funcWithParamsRegex = /export async function (GET|POST|PUT|PATCH|DELETE)\([^)]*\{ params \}[^)]*\)[^{]*\{/g;
  const matches = [...content.matchAll(funcWithParamsRegex)];
  
  for (const match of matches) {
    const funcStart = match.index + match[0].length;
    const nextLines = content.substring(funcStart, funcStart + 500);
    
    // Check if we already have await params
    if (!nextLines.includes('await params')) {
      // Find where to insert the await
      const tryMatch = nextLines.match(/^\s*try\s*\{/);
      if (tryMatch) {
        const insertPos = funcStart + tryMatch.index + tryMatch[0].length;
        // Extract param names from the type definition
        const typeMatch = content.substring(match.index - 200, match.index).match(/params: Promise<\{([^}]+)\}>/);
        if (typeMatch) {
          const paramNames = typeMatch[1].split(',').map(p => p.split(':')[0].trim()).filter(Boolean);
          if (paramNames.length > 0) {
            const awaitLine = `\n    const { ${paramNames.join(', ')} } = await params;`;
            content = content.substring(0, insertPos) + awaitLine + content.substring(insertPos);
            modified = true;
          }
        }
      }
    }
  }

  // Pattern 3: Replace direct params.x usage with extracted variables
  // This is more complex and might need manual review, so we'll skip for now

  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Fixed: ${filePath}`);
    fixedCount++;
    return true;
  }
  
  return false;
}

console.log('Fixing async params across the codebase...\n');

// Fix API routes
const apiRoutes = findFiles('src/app/api', /route\.ts$/);
console.log(`Found ${apiRoutes.length} API route files\n`);

for (const file of apiRoutes) {
  try {
    fixAsyncParams(file);
  } catch (error) {
    console.error(`✗ Error fixing ${file}:`, error.message);
    errorCount++;
  }
}

// Fix page routes with dynamic params
const pageRoutes = findFiles('src/app', /page\.tsx$/);
console.log(`\nChecking ${pageRoutes.length} page files\n`);

for (const file of pageRoutes) {
  try {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
    // Only fix pages that have params in their props
    if (content.includes('{ params }') && !content.includes('Promise<{')) {
      fixAsyncParams(file);
    }
  } catch (error) {
    console.error(`✗ Error fixing ${file}:`, error.message);
    errorCount++;
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Fixed: ${fixedCount} files`);
console.log(`Errors: ${errorCount} files`);
console.log(`${'='.repeat(60)}\n`);

process.exit(errorCount > 0 ? 1 : 0);
