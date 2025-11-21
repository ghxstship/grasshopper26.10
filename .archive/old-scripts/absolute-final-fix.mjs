#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { execSync } from 'child_process';

console.log('Starting ABSOLUTE FINAL FIX for zero-tolerance build...\n');

const files = glob.sync('src/app/**/*.tsx');
let totalFixed = 0;

files.forEach(file => {
  try {
    let content = readFileSync(file, 'utf8');
    let originalContent = content;
    
    // Pattern 1: Remove any stray </Caption> followed by </CardHeader> or </CardFooter>
    content = content.replace(/<\/Caption>\s*<\/(CardHeader|CardFooter)>/g, '</$1>');
    
    // Pattern 2: Fix Caption wrapping entire card sections incorrectly
    // Look for <Caption...> at start of CardHeader/CardFooter content
    const cardHeaderPattern = /(<CardHeader[^>]*>)\s*<Caption([^>]*)>/g;
    content = content.replace(cardHeaderPattern, '$1');
    
    const cardFooterPattern = /(<CardFooter[^>]*>)\s*<Caption([^>]*)>/g;
    content = content.replace(cardFooterPattern, '$1');
    
    // Pattern 3: Remove Caption closing tags right before CardHeader/CardFooter closing
    content = content.replace(/<\/Caption>\s*(<\/CardHeader>)/g, '$1');
    content = content.replace(/<\/Caption>\s*(<\/CardFooter>)/g, '$1');
    
    // Pattern 4: Clean up multiple consecutive empty lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    if (content !== originalContent) {
      writeFileSync(file, content);
      totalFixed++;
      console.log(`✓ Fixed: ${file}`);
    }
  } catch (err) {
    console.error(`✗ Error in ${file}:`, err.message);
  }
});

console.log(`\n${'='.repeat(60)}`);
console.log(`Total files fixed: ${totalFixed}`);
console.log(`${'='.repeat(60)}\n`);

// Run TypeScript check
console.log('Running TypeScript check...\n');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit', cwd: process.cwd() });
  console.log('\n✓ TypeScript check PASSED!');
} catch (err) {
  console.log('\n✗ TypeScript check still has errors');
  console.error(err);
  process.exit(1);
}
