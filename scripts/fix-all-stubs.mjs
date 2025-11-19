#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

// Mapping of service methods to prisma models and operations
const SERVICE_TO_PRISMA = {
  // CompvssService mappings
  'CompvssService': {
    'create': (context) => {
      // Determine model from context
      if (context.includes('affiliate')) return 'affiliateProfile';
      if (context.includes('expense')) return 'expenseReport';
      if (context.includes('advancing')) return 'advancingRequest';
      if (context.includes('qr') || context.includes('QR')) return 'qrCode';
      if (context.includes('checkIn') || context.includes('check-in')) return 'checkIn';
      if (context.includes('issue')) return 'issueReport';
      if (context.includes('team')) return 'compvssTeam';
      if (context.includes('approver')) return 'advancingApprover';
      return 'UNKNOWN';
    },
    'findById': (context) => {
      if (context.includes('affiliate')) return 'affiliateProfile';
      if (context.includes('expense')) return 'expenseReport';
      if (context.includes('qr')) return 'qrCode';
      return 'UNKNOWN';
    },
    'findAll': (context) => {
      if (context.includes('team')) return 'compvssTeam';
      return 'UNKNOWN';
    },
    'update': (context) => {
      if (context.includes('affiliate')) return 'affiliateProfile';
      if (context.includes('expense')) return 'expenseReport';
      if (context.includes('advancing')) return 'advancingRequest';
      if (context.includes('qr')) return 'qrCode';
      return 'UNKNOWN';
    },
    'delete': (context) => {
      if (context.includes('expense')) return 'expenseReport';
      return 'UNKNOWN';
    }
  }
};

async function fixFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;

  // Fix CompvssService.create calls
  const createPattern = /new CompvssService\(\)\.create\(/g;
  if (createPattern.test(content)) {
    const model = SERVICE_TO_PRISMA.CompvssService.create(content.toLowerCase());
    if (model !== 'UNKNOWN') {
      content = content.replace(/new CompvssService\(\)\.create\(/g, `prisma.${model}.create(`);
      modified = true;
    }
  }

  // Fix CompvssService.findById calls
  const findByIdPattern = /new CompvssService\(\)\.findById\(([^)]+)\)/g;
  content = content.replace(findByIdPattern, (match, args) => {
    const model = SERVICE_TO_PRISMA.CompvssService.findById(content.toLowerCase());
    if (model !== 'UNKNOWN') {
      // Check if it's a simple id or an object
      if (args.trim().match(/^['"`]/) || !args.includes('{')) {
        // Simple id - convert to findUnique with where clause
        return `prisma.${model}.findUnique({ where: { id: ${args} } })`;
      } else {
        // Already has object syntax
        return `prisma.${model}.findUnique(${args})`;
      }
    }
    return match;
  });

  // Fix CompvssService.findAll calls  
  const findAllPattern = /new CompvssService\(\)\.findAll\(/g;
  if (findAllPattern.test(content)) {
    const model = SERVICE_TO_PRISMA.CompvssService.findAll(content.toLowerCase());
    if (model !== 'UNKNOWN') {
      content = content.replace(/new CompvssService\(\)\.findAll\(/g, `prisma.${model}.findMany(`);
      modified = true;
    }
  }

  // Fix CompvssService.update calls
  const updatePattern = /new CompvssService\(\)\.update\(/g;
  if (updatePattern.test(content)) {
    const model = SERVICE_TO_PRISMA.CompvssService.update(content.toLowerCase());
    if (model !== 'UNKNOWN') {
      content = content.replace(/new CompvssService\(\)\.update\(/g, `prisma.${model}.update(`);
      modified = true;
    }
  }

  // Fix CompvssService.delete calls
  const deletePattern = /new CompvssService\(\)\.delete\(([^)]+)\)/g;
  content = content.replace(deletePattern, (match, args) => {
    const model = SERVICE_TO_PRISMA.CompvssService.delete(content.toLowerCase());
    if (model !== 'UNKNOWN') {
      // Check if it's a simple id or an object
      if (args.trim().match(/^['"`]/) || !args.includes('{')) {
        return `prisma.${model}.delete({ where: { id: ${args} } })`;
      } else {
        return `prisma.${model}.delete(${args})`;
      }
    }
    return match;
  });

  // Remove unused CompvssService imports
  if (modified || content.includes('CompvssService')) {
    content = content.replace(/import\s+{\s*CompvssService\s*}\s+from\s+['"][^'"]+['"]\s*;\s*\n/g, '');
  }

  if (modified) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`Fixed: ${filePath}`);
    return true;
  }
  return false;
}

async function main() {
  const files = await glob('src/app/api/**/*.ts', { ignore: 'node_modules/**' });
  let fixedCount = 0;
  
  for (const file of files) {
    try {
      if (await fixFile(file)) {
        fixedCount++;
      }
    } catch (error) {
      console.error(`Error fixing ${file}:`, error.message);
    }
  }
  
  console.log(`\nFixed ${fixedCount} files`);
}

main().catch(console.error);
