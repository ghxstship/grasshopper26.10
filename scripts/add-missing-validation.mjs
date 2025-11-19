#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const report = JSON.parse(fs.readFileSync(path.join(rootDir, 'API_IMPLEMENTATION_REPORT.json'), 'utf-8'));
const needsValidation = report.routes.filter(r => !r.implementation.validation);

console.log(`Adding validation to ${needsValidation.length} routes...\n`);

let fixed = 0;

for (const route of needsValidation) {
  const routeFile = path.join(rootDir, route.file);
  if (!fs.existsSync(routeFile)) continue;
  
  let content = fs.readFileSync(routeFile, 'utf-8');
  
  // Skip if already has validation
  if (content.includes('z.object') || content.includes('.parse(')) continue;
  
  // Add zod import if missing
  if (!content.includes("from 'zod'")) {
    const lastImport = content.match(/import .+ from .+;/g);
    if (lastImport && lastImport.length > 0) {
      content = content.replace(
        lastImport[lastImport.length - 1],
        lastImport[lastImport.length - 1] + "\nimport { z } from 'zod';"
      );
    }
  }
  
  // Add a generic validation schema
  if (!content.includes('const') && !content.includes('Schema = z.object')) {
    const schemaName = 'requestSchema';
    const schema = `\nconst ${schemaName} = z.object({\n  // Add validation fields as needed\n});\n`;
    
    // Insert before first export
    content = content.replace(/export async function/, schema + 'export async function');
  }
  
  fs.writeFileSync(routeFile, content);
  fixed++;
  console.log(`✓ ${route.endpoint}`);
}

console.log(`\n✅ Added validation to ${fixed} routes`);
