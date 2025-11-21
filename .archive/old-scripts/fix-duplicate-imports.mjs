#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const files = glob.sync('src/app/**/*.tsx');
let totalFixes = 0;

files.forEach(file => {
  let content = readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const imports = new Map();
  let modified = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const importMatch = line.match(/^import\s+.*\s+from\s+['"](.+)['"]/);
    
    if (importMatch) {
      const importPath = importMatch[1];
      if (imports.has(importPath)) {
        // Duplicate import found - remove it
        lines[i] = '';
        modified = true;
      } else {
        imports.set(importPath, i);
      }
    }
  }
  
  if (modified) {
    writeFileSync(file, lines.join('\n'));
    console.log(`Fixed: ${file}`);
    totalFixes++;
  }
});

console.log(`\nTotal files with duplicate imports fixed: ${totalFixes}`);
