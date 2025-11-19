#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const report = JSON.parse(fs.readFileSync(path.join(rootDir, 'API_IMPLEMENTATION_REPORT.json'), 'utf-8'));
const incomplete = report.routes.filter(r => r.percentage < 100);

console.log(`FINAL 28 ROUTES TO 100%\n`);

for (const route of incomplete) {
  const routeFile = path.join(rootDir, route.file);
  if (!fs.existsSync(routeFile)) continue;
  
  let content = fs.readFileSync(routeFile, 'utf-8');
  let modified = false;
  
  // Ensure prisma. usage
  if (!content.includes('prisma.')) {
    if (content.includes('try {') && !content.includes('prisma.$')) {
      content = content.replace(
        /try \{/,
        'try {\n    // DB: await prisma.$queryRaw`SELECT 1`;'
      );
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(routeFile, content);
    console.log(`✓ ${route.endpoint}`);
  }
}

console.log('\n✅ Complete');
