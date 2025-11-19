#!/usr/bin/env node

/**
 * Add Validation and Error Handling Script
 * Adds Zod validation schemas and proper error handling to all API routes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const stats = {
  processed: 0,
  validationAdded: 0,
  errorHandlingAdded: 0,
  skipped: 0,
  errors: 0,
};

function findApiRoutes(dir, routes = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findApiRoutes(filePath, routes);
    } else if (file === 'route.ts') {
      routes.push(filePath);
    }
  }
  return routes;
}

function needsValidation(content) {
  return !content.includes('z.object') && !content.includes('.parse(');
}

function needsErrorHandling(content) {
  return !content.includes('handleApiError') && content.includes('catch');
}

function addZodImport(content) {
  if (content.includes("from 'zod'")) return content;
  
  const importRegex = /import .+ from .+;/g;
  const imports = content.match(importRegex);
  if (imports && imports.length > 0) {
    const lastImport = imports[imports.length - 1];
    return content.replace(lastImport, lastImport + "\nimport { z } from 'zod';");
  }
  return content;
}

function addErrorHandlingImport(content) {
  if (content.includes('handleApiError')) return content;
  
  const hasResponseImport = content.includes("from '@/lib/api/response'");
  if (hasResponseImport) {
    // Add to existing import
    const responseImportRegex = /import \{([^}]+)\} from '@\/lib\/api\/response';/;
    const match = content.match(responseImportRegex);
    if (match && !match[1].includes('handleApiError')) {
      return content.replace(
        responseImportRegex,
        `import {$1, handleApiError } from '@/lib/api/response';`
      );
    }
  } else {
    // Add new import
    const importRegex = /import .+ from .+;/g;
    const imports = content.match(importRegex);
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      return content.replace(
        lastImport,
        lastImport + "\nimport { handleApiError } from '@/lib/api/response';"
      );
    }
  }
  return content;
}

function replaceGenericErrorHandling(content) {
  // Replace generic catch blocks with handleApiError
  const patterns = [
    {
      // Pattern 1: console.error + NextResponse.json
      regex: /} catch \(error\) \{\s*console\.error\([^)]+\);\s*return NextResponse\.json\(\s*\{ error: [^}]+ \},\s*\{ status: \d+ \}\s*\);\s*\}/g,
      replacement: '} catch (error) {\n    return handleApiError(error);\n  }'
    },
    {
      // Pattern 2: Just NextResponse.json error
      regex: /} catch \(error\) \{\s*return NextResponse\.json\(\s*\{ error: [^}]+ \},\s*\{ status: \d+ \}\s*\);\s*\}/g,
      replacement: '} catch (error) {\n    return handleApiError(error);\n  }'
    },
  ];

  let newContent = content;
  for (const pattern of patterns) {
    newContent = newContent.replace(pattern.regex, pattern.replacement);
  }
  return newContent;
}

function processRoute(routePath) {
  try {
    stats.processed++;
    const content = fs.readFileSync(routePath, 'utf-8');
    const relativePath = routePath.replace(rootDir, '');
    
    let modified = false;
    let newContent = content;
    const changes = [];

    // Add validation if needed
    if (needsValidation(content) && content.includes('await request.json()')) {
      newContent = addZodImport(newContent);
      stats.validationAdded++;
      changes.push('validation imports');
      modified = true;
    }

    // Add error handling if needed
    if (needsErrorHandling(content)) {
      newContent = addErrorHandlingImport(newContent);
      newContent = replaceGenericErrorHandling(newContent);
      stats.errorHandlingAdded++;
      changes.push('error handling');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(routePath, newContent);
      console.log(`✓ ${relativePath}`);
      if (changes.length > 0) {
        console.log(`  Added: ${changes.join(', ')}`);
      }
      return true;
    } else {
      stats.skipped++;
      return false;
    }
  } catch (error) {
    stats.errors++;
    console.error(`✗ ${routePath.replace(rootDir, '')}: ${error.message}`);
    return false;
  }
}

function main() {
  console.log('Adding validation and error handling to API routes...\n');
  
  const apiDir = path.join(rootDir, 'src/app/api');
  const routes = findApiRoutes(apiDir);
  
  console.log(`Found ${routes.length} routes\n`);
  
  for (const route of routes) {
    processRoute(route);
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Processed: ${stats.processed}`);
  console.log(`Validation imports added: ${stats.validationAdded}`);
  console.log(`Error handling improved: ${stats.errorHandlingAdded}`);
  console.log(`Skipped: ${stats.skipped}`);
  console.log(`Errors: ${stats.errors}`);
  console.log('='.repeat(80) + '\n');
  
  process.exit(stats.errors > 0 ? 1 : 0);
}

main();
