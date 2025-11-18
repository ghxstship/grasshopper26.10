#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

console.log('🔧 Fixing incorrect underscore prefixes...\n');

function getAllTsxFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      getAllTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

const files = getAllTsxFiles('src');
let totalFixed = 0;

for (const file of files) {
  try {
    let content = readFileSync(file, 'utf-8');
    const original = content;
    
    // Fix import statements with incorrect underscores
    content = content.replace(/import\s+{\s*([^}]+)\s*}\s+from/g, (match, imports) => {
      const fixed = imports.split(',').map(imp => {
        // Remove underscore prefix from import names
        return imp.trim().replace(/^_(\w+)/, '$1');
      }).join(', ');
      return `import { ${fixed} } from`;
    });
    
    // Fix destructuring with incorrect underscores from hooks
    content = content.replace(/const\s+{\s*([^}]+)\s*}\s*=\s*use/g, (match, vars) => {
      const fixed = vars.split(',').map(v => {
        const trimmed = v.trim();
        // Remove underscore prefix but keep renamed variables
        if (trimmed.includes(':')) {
          return trimmed.replace(/^_(\w+):/, '$1:');
        }
        return trimmed.replace(/^_(\w+)$/, '$1');
      }).join(', ');
      return `const { ${fixed} } = use`;
    });
    
    if (content !== original) {
      writeFileSync(file, content, 'utf-8');
      totalFixed++;
      console.log(`✅ ${file.replace(process.cwd() + '/', '')}`);
    }
  } catch (error) {
    console.error(`❌ ${file}: ${error.message}`);
  }
}

console.log(`\n✅ Fixed ${totalFixed} files\n`);
