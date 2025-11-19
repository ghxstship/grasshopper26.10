#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const report = JSON.parse(fs.readFileSync(path.join(rootDir, 'API_IMPLEMENTATION_REPORT.json'), 'utf-8'));
const incomplete = report.routes.filter(r => r.percentage < 100);

console.log('Checking service file detection for incomplete routes:\n');

for (const route of incomplete.slice(0, 5)) {
  console.log(`\n${route.endpoint} (${route.percentage}%)`);
  console.log(`  API File: ${route.file}`);
  console.log(`  Service File Found: ${route.serviceFile || 'NONE'}`);
  
  // Check what should exist
  const apiPath = route.file.replace('/src/app/api', '').replace('/route.ts', '');
  const expectedPath = path.join(rootDir, 'src/lib/services', apiPath + '.service.ts');
  console.log(`  Expected: ${expectedPath.replace(rootDir, '')}`);
  console.log(`  Exists: ${fs.existsSync(expectedPath)}`);
}
