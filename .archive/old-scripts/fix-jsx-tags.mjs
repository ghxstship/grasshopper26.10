#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

// Find all TSX files
const files = glob.sync('src/app/**/*.tsx');

let totalFixes = 0;

files.forEach(file => {
  let content = readFileSync(file, 'utf8');
  let modified = false;
  
  // Fix Button tags: <Button ... </button> -> <Button ... </Button>
  const buttonRegex = /(<Button[^>]*>[\s\S]*?)<\/button>/g;
  if (buttonRegex.test(content)) {
    content = content.replace(buttonRegex, '$1</Button>');
    modified = true;
    totalFixes++;
  }
  
  // Fix Caption tags: <Caption ... </p> -> <Caption ... </Caption>
  const captionRegex = /(<Caption[^>]*>[\s\S]*?)<\/p>/g;
  if (captionRegex.test(content)) {
    content = content.replace(captionRegex, '$1</Caption>');
    modified = true;
    totalFixes++;
  }
  
  if (modified) {
    writeFileSync(file, content);
    console.log(`Fixed: ${file}`);
  }
});

console.log(`\nTotal files fixed: ${totalFixes}`);
