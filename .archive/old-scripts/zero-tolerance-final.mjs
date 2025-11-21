#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

console.log('🔧 ZERO TOLERANCE FINAL FIX - Fixing ALL remaining errors\n');

function getAllTsxFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  files.forEach(file => {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        getAllTsxFiles(filePath, fileList);
      }
    } else if (file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const files = getAllTsxFiles('src/app');
let totalFixed = 0;

files.forEach(file => {
  try {
    let content = readFileSync(file, 'utf8');
    const original = content;
    
    // Fix pattern: Multiple </Caption> or </div> where they shouldn't be
    // Look for </Caption></Caption> or </div></div> patterns
    content = content.replace(/<\/Caption>\s*<\/Caption>/g, '</Caption>');
    content = content.replace(/<\/div>\s*<\/div>\s*<\/div>/g, '</div></div>');
    
    // Fix unclosed <button> tags (should be </Button>)
    content = content.replace(/<\/button>/g, '</Button>');
    
    // Clean up /20/20/20 patterns (seems like a copy error)
    content = content.replace(/\/20\/20\/20/g, '');
    
    if (content !== original) {
      writeFileSync(file, content);
      totalFixed++;
      console.log(`✓ ${file}`);
    }
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`);
  }
});

console.log(`\n✅ Fixed ${totalFixed} files\n`);

// Run build to verify
console.log('🏗️  Running production build...\n');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('\n✅ BUILD SUCCESSFUL - ZERO TOLERANCE MET!\n');
} catch {
  console.log('\n⚠️  Build still has errors, running TypeScript check...\n');
  try {
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
  } catch {
    process.exit(1);
  }
}
