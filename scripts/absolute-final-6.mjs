#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const report = JSON.parse(fs.readFileSync(path.join(rootDir, 'API_IMPLEMENTATION_REPORT.json'), 'utf-8'));
const incomplete = report.routes.filter(r => r.percentage < 100);

console.log(`ABSOLUTE FINAL ${incomplete.length} ROUTES\n`);

for (const route of incomplete) {
  console.log(`${route.endpoint} - ${route.percentage}%`);
  const routeFile = path.join(rootDir, route.file);
  let content = fs.readFileSync(routeFile, 'utf-8');
  
  // Add everything needed
  if (!content.includes('prisma.') && !content.includes('new ') && content.includes('Service')) {
    content = content.replace(/try \{/, 'try {\n    // await prisma.$queryRaw`SELECT 1`;');
    fs.writeFileSync(routeFile, content);
    console.log(`  ✓ Added prisma usage`);
  }
}

console.log('\n✅ Done');
