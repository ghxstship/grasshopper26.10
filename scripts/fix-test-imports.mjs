#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const importMap = {
  '@/components/atoms/': '@/components/ui-rebuild/atoms/',
  '@/components/molecules/': '@/components/ui-rebuild/molecules/',
  '@/components/organisms/': '@/components/ui-rebuild/organisms/',
  '@/components/atlvs/': '@/components/ui-rebuild/organisms/',
};

function fixImports(filePath) {
  const fullPath = path.join(ROOT, filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  for (const [oldPath, newPath] of Object.entries(importMap)) {
    const regex = new RegExp(oldPath.replace(/\//g, '\\/'), 'g');
    if (regex.test(content)) {
      content = content.replace(regex, newPath);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Fixed: ${filePath}`);
    return true;
  }
  return false;
}

function findFiles(dir, pattern, exclude = ['node_modules', '.next', 'dist']) {
  const results = [];
  const scan = (d) => {
    try {
      const items = fs.readdirSync(path.join(ROOT, d), { withFileTypes: true });
      for (const item of items) {
        const p = path.join(d, item.name);
        if (item.isDirectory()) {
          if (!exclude.includes(item.name)) scan(p);
        } else if (item.name.match(pattern)) {
          results.push(p);
        }
      }
    } catch {}
  };
  scan(dir);
  return results;
}

console.log('Fixing test imports...\n');

const testFiles = findFiles('src/__tests__', /\.(test|spec)\.(ts|tsx)$/);
let fixedCount = 0;

for (const file of testFiles) {
  if (fixImports(file)) {
    fixedCount++;
  }
}

console.log(`\nFixed ${fixedCount} test files`);
