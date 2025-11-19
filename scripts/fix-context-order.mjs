#!/usr/bin/env node
/**
 * Fix context declaration order in API routes
 * Moves context declaration before rate limiting checks
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_DIR = path.join(__dirname, '../src/app/api');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  
  // Add errors import if missing but errors.rateLimitExceeded() is used
  if (content.includes('errors.rateLimitExceeded()') && !content.includes("from '@/lib/api/errors'")) {
    // Find the last import statement
    const importMatch = content.match(/(import[\s\S]*?from ['"][^'"]+['"];?\n)/g);
    if (importMatch) {
      const lastImport = importMatch[importMatch.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport);
      const insertPosition = lastImportIndex + lastImport.length;
      content = content.slice(0, insertPosition) + 
                "import { errors } from '@/lib/api/errors';\n" +
                content.slice(insertPosition);
      changed = true;
    }
  }
  
  // Pattern: rate limit check using context.userId before context is declared
  // Match the entire function body to find and reorder
  const functionPattern = /(export async function \w+\([^)]*\)\s*\{[\s\S]*?)(try \{\s*)(\/\/ Rate limiting[\s\S]*?RateLimitIdentifiers\.byUserId\(context\.userId\)[\s\S]*?\}\s*\}\s*\n\s*)(const context = await validateRequest\(request\);[\s\S]*?requireAuth\(context\);)/g;
  
  const fixed = content.replace(functionPattern, (match, fnStart, tryBlock, rateLimitBlock, contextDeclaration) => {
    // Swap order: context first, then rate limiting
    return fnStart + tryBlock + contextDeclaration + '\n\n    ' + rateLimitBlock;
  });
  
  if (fixed !== content) {
    fs.writeFileSync(filePath, fixed, 'utf-8');
    return true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  
  return false;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixedCount += walkDir(filePath);
    } else if (file === 'route.ts') {
      if (fixFile(filePath)) {
        console.log(`✓ Fixed: ${path.relative(process.cwd(), filePath)}`);
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

console.log('🔧 Fixing context declaration order in API routes...\n');
const fixedCount = walkDir(API_DIR);
console.log(`\n✅ Fixed ${fixedCount} files`);
