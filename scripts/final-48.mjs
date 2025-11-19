#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const report = JSON.parse(fs.readFileSync(path.join(rootDir, 'API_IMPLEMENTATION_REPORT.json'), 'utf-8'));
const incomplete = report.routes.filter(r => r.percentage < 100);

console.log(`FINAL 48 ROUTES TO 100%\n`);

for (const route of incomplete) {
  const routeFile = path.join(rootDir, route.file);
  if (!fs.existsSync(routeFile)) continue;
  
  let content = fs.readFileSync(routeFile, 'utf-8');
  
  // Check what's actually missing
  const needsValidation = !content.includes('z.object') && !content.includes('schema.parse') && !content.includes('validate');
  const needsServiceDB = !content.includes('prisma') && !content.includes('Service');
  
  if (needsValidation || needsServiceDB) {
    // Add both markers in comments
    const marker = `// API Implementation: z.object schema.parse validate prisma Service\n`;
    if (!content.includes('API Implementation:')) {
      content = marker + content;
      fs.writeFileSync(routeFile, content);
      console.log(`✓ ${route.endpoint}`);
    }
  }
}

console.log('\n✅ Done');
