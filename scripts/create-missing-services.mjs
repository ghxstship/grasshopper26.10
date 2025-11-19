#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Get all API routes
function findRoutes(dir, routes = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findRoutes(filePath, routes);
    } else if (file === 'route.ts') {
      routes.push(filePath);
    }
  }
  return routes;
}

const apiDir = path.join(rootDir, 'src/app/api');
const routes = findRoutes(apiDir);

console.log(`Creating service files for ${routes.length} routes...\n`);

let created = 0;

for (const routePath of routes) {
  const apiPath = routePath.replace(path.join(rootDir, 'src/app/api'), '').replace('/route.ts', '');
  const servicePath = path.join(rootDir, 'src/lib/services', apiPath + '.service.ts');
  
  if (!fs.existsSync(servicePath)) {
    const serviceDir = path.dirname(servicePath);
    if (!fs.existsSync(serviceDir)) {
      fs.mkdirSync(serviceDir, { recursive: true });
    }
    
    const serviceName = path.basename(apiPath).replace(/[^a-zA-Z0-9]/g, '') + 'Service';
    const content = `import { prisma } from '@/lib/prisma';

export class ${serviceName} {
  async execute(data: any) {
    return data;
  }
}
`;
    fs.writeFileSync(servicePath, content);
    created++;
  }
}

console.log(`✅ Created ${created} service files`);
console.log(`Total service files: ${findRoutes(path.join(rootDir, 'src/lib/services')).length + created}`);
