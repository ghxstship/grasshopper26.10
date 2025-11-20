#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

console.log('🔧 Fixing multiline Card styling violations...\n');

const files = glob.sync('src/app/**/*.tsx', { 
  ignore: ['**/node_modules/**', '**/.next/**'] 
});

let totalFixed = 0;
let filesModified = 0;

files.forEach(file => {
  let content = readFileSync(file, 'utf8');
  const originalContent = content;
  let fileFixed = 0;

  // Pattern to match Card components across multiple lines
  // Match <Card ... className="..." ... >
  const cardPattern = /<Card([^>]*?)className="([^"]*?)"([^>]*?)>/g;
  
  content = content.replace(cardPattern, (match, before, className, after) => {
    let newClassName = className;
    let changed = false;
    
    // Remove bg-grey-900/50
    if (newClassName.includes('bg-grey-900/50')) {
      newClassName = newClassName.replace(/\s*bg-grey-900\/50\s*/g, ' ');
      changed = true;
    }
    
    // Remove border-grey-800
    if (newClassName.includes('border-grey-800')) {
      newClassName = newClassName.replace(/\s*border-grey-800\s*/g, ' ');
      changed = true;
    }
    
    // Remove bg-gray-900/50
    if (newClassName.includes('bg-gray-900/50')) {
      newClassName = newClassName.replace(/\s*bg-gray-900\/50\s*/g, ' ');
      changed = true;
    }
    
    // Remove border-gray-800
    if (newClassName.includes('border-gray-800')) {
      newClassName = newClassName.replace(/\s*border-gray-800\s*/g, ' ');
      changed = true;
    }
    
    // Clean up whitespace
    newClassName = newClassName.trim().replace(/\s+/g, ' ');
    
    if (changed) {
      fileFixed++;
      if (newClassName === '') {
        // Remove className attribute if empty
        return `<Card${before}${after}>`;
      }
      return `<Card${before}className="${newClassName}"${after}>`;
    }
    
    return match;
  });

  if (content !== originalContent) {
    writeFileSync(file, content, 'utf8');
    filesModified++;
    totalFixed += fileFixed;
    console.log(`✅ ${file} - Fixed ${fileFixed} violations`);
  }
});

console.log(`\n✨ Complete! Fixed ${totalFixed} violations across ${filesModified} files`);
