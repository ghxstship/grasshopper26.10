#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('ABSOLUTE 100% - ZERO TOLERANCE\n');

const report = JSON.parse(fs.readFileSync(path.join(rootDir, 'API_IMPLEMENTATION_REPORT.json'), 'utf-8'));
const incomplete = report.routes.filter(r => r.percentage < 100);

console.log(`${incomplete.length} routes need to reach 100%\n`);

for (const route of incomplete) {
  console.log(`\n${route.endpoint} (${route.percentage}%)`);
  console.log(`  Missing:`);
  if (!route.implementation.auth) console.log(`    - Authentication`);
  if (!route.implementation.validation) console.log(`    - Validation`);
  if (!route.implementation.errorHandling) console.log(`    - Error Handling`);
  if (!route.implementation.rateLimiting) console.log(`    - Rate Limiting`);
  if (!route.implementation.serviceLayer && !route.implementation.dbOps) console.log(`    - Service/DB Layer`);
  if (route.uiConsumers.length === 0) console.log(`    - UI Consumers`);
  if (!route.serviceFile) console.log(`    - Service File`);
}

console.log(`\n\nTO REACH 100%:`);
console.log(`Every route must have ALL of:`);
console.log(`1. Authentication (validateRequest/requireAuth)`);
console.log(`2. Validation (z.object or schema.parse)`);
console.log(`3. Error Handling (try/catch with handleApiError)`);
console.log(`4. Rate Limiting (rateLimit call)`);
console.log(`5. Service Layer OR Database Operations (Service class or prisma.)`);
console.log(`6. UI Consumers (files that reference the API endpoint)`);
console.log(`7. Service File (dedicated service file exists)`);

console.log(`\n\nCurrent gaps prevent 100% completion.`);
console.log(`System is production-ready at 94% but NOT 100% complete.`);
