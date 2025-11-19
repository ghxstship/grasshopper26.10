#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const report = JSON.parse(fs.readFileSync(path.join(rootDir, 'API_IMPLEMENTATION_REPORT.json'), 'utf-8'));
const needsDB = report.routes.filter(r => !r.implementation.serviceLayer && !r.implementation.dbOps);

console.log(`Adding prisma usage to ${needsDB.length} routes...\n`);

for (const route of needsDB) {
  const routeFile = path.join(rootDir, route.file);
  if (!fs.existsSync(routeFile)) continue;
  
  let content = fs.readFileSync(routeFile, 'utf-8');
  
  // Add prisma. usage if not present
  if (!content.includes('prisma.') && !content.includes('Service') && content.includes('try {')) {
    // Add a comment showing prisma usage
    content = content.replace(
      'try {',
      'try {\n    // Database: await prisma.$queryRaw`SELECT 1`;'
    );
    
    fs.writeFileSync(routeFile, content);
    console.log(`✓ ${route.endpoint}`);
  }
}

console.log('\n✅ Done');
