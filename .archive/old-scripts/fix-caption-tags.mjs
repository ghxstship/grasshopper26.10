#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const files = glob.sync('src/app/**/*.tsx');
let totalFixes = 0;

files.forEach(file => {
  let content = readFileSync(file, 'utf8');
  let modified = false;
  
  // Fix all Caption tags ending with </div>
  const captionDivRegex = /(<Caption[^>]*>[\s\S]*?)<\/div>/g;
  const divMatches = content.match(captionDivRegex);
  if (divMatches) {
    content = content.replace(captionDivRegex, '$1</Caption>');
    modified = true;
  }
  
  // Fix all Caption tags ending with </span>
  const captionSpanRegex = /(<Caption[^>]*>[\s\S]*?)<\/span>/g;
  const spanMatches = content.match(captionSpanRegex);
  if (spanMatches) {
    content = content.replace(captionSpanRegex, '$1</Caption>');
    modified = true;
  }
  
  if (modified) {
    writeFileSync(file, content);
    console.log(`Fixed: ${file}`);
    totalFixes++;
  }
});

console.log(`\nTotal files fixed: ${totalFixes}`);
