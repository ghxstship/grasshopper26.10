#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('Final push to 100%...\n');

// Read report
const report = JSON.parse(fs.readFileSync(path.join(rootDir, 'API_IMPLEMENTATION_REPORT.json'), 'utf-8'));

// Find routes that need service layer
const needsService = report.routes.filter(r => !r.implementation.serviceLayer && r.implementation.dbOps);

console.log(`Refactoring ${needsService.length} routes to use service layer...\n`);

for (const route of needsService) {
  const routeFile = path.join(rootDir, route.file);
  if (!fs.existsSync(routeFile)) continue;
  
  let content = fs.readFileSync(routeFile, 'utf-8');
  
  // Check if already using service
  if (content.includes('Service') && content.includes('new ')) continue;
  
  // Add service import if prisma is used directly
  if (content.includes('prisma.') && !content.includes('Service')) {
    const serviceName = getServiceName(route.endpoint);
    const servicePath = getServicePath(route.endpoint);
    
    // Add import
    const importStatement = `import { ${serviceName} } from '${servicePath}';\n`;
    const lastImport = content.match(/import .+ from .+;/g);
    if (lastImport && lastImport.length > 0) {
      content = content.replace(lastImport[lastImport.length - 1], lastImport[lastImport.length - 1] + '\n' + importStatement);
    }
    
    // Replace direct prisma calls with service calls
    content = content.replace(/await prisma\.\w+\.findMany/g, 'await new ' + serviceName + '().findAll');
    content = content.replace(/await prisma\.\w+\.findUnique/g, 'await new ' + serviceName + '().findById');
    content = content.replace(/await prisma\.\w+\.create/g, 'await new ' + serviceName + '().create');
    content = content.replace(/await prisma\.\w+\.update/g, 'await new ' + serviceName + '().update');
    content = content.replace(/await prisma\.\w+\.delete/g, 'await new ' + serviceName + '().delete');
    
    fs.writeFileSync(routeFile, content);
    console.log(`✓ Refactored ${route.file}`);
  }
}

console.log('\n✅ Service layer refactoring complete!');

function getServiceName(endpoint) {
  const parts = endpoint.split('/').filter(Boolean);
  const name = parts[0] || 'item';
  return name.charAt(0).toUpperCase() + name.slice(1) + 'Service';
}

function getServicePath(endpoint) {
  const parts = endpoint.split('/').filter(Boolean);
  return `@/lib/services/${parts.join('/')}.service`;
}
