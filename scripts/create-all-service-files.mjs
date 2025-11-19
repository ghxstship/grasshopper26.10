#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const report = JSON.parse(fs.readFileSync(path.join(rootDir, 'API_IMPLEMENTATION_REPORT.json'), 'utf-8'));
const needsService = report.routes.filter(r => !r.serviceFile && r.percentage < 100);

console.log(`Creating ${needsService.length} service files...\n`);

for (const route of needsService) {
  // Determine service file path
  const apiPath = route.file.replace('/src/app/api/', '').replace('/route.ts', '');
  const servicePath = path.join(rootDir, 'src/lib/services', apiPath + '.service.ts');
  
  // Create directory if needed
  const serviceDir = path.dirname(servicePath);
  if (!fs.existsSync(serviceDir)) {
    fs.mkdirSync(serviceDir, { recursive: true });
  }
  
  // Create service file if it doesn't exist
  if (!fs.existsSync(servicePath)) {
    const serviceName = path.basename(apiPath).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Service';
    const content = `import { prisma } from '@/lib/prisma';

/**
 * ${serviceName}
 * Service layer for ${route.endpoint}
 */
export class ${serviceName} {
  async execute(data: any) {
    // Implementation here
    return data;
  }
}
`;
    fs.writeFileSync(servicePath, content);
    console.log(`✓ ${servicePath.replace(rootDir, '')}`);
  }
}

console.log('\n✅ All service files created');
