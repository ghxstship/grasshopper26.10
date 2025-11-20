#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

console.log('🔧 Fixing custom Card styling violations...\n');

const files = glob.sync('src/app/**/*.tsx', { 
  ignore: ['**/node_modules/**', '**/.next/**'] 
});

let totalFixed = 0;
let filesModified = 0;

files.forEach(file => {
  let content = readFileSync(file, 'utf8');
  const originalContent = content;
  let fileFixed = 0;

  // Remove bg-grey-900/50 from Card components
  content = content.replace(
    /(<Card[^>]*className="[^"]*?)bg-grey-900\/50\s*([^"]*?")/g,
    (match, before, after) => {
      fileFixed++;
      return before + after;
    }
  );

  // Remove border-grey-800 from Card components
  content = content.replace(
    /(<Card[^>]*className="[^"]*?)border-grey-800\s*([^"]*?")/g,
    (match, before, after) => {
      fileFixed++;
      return before + after;
    }
  );

  // Remove bg-gray-900/50 from Card components
  content = content.replace(
    /(<Card[^>]*className="[^"]*?)bg-gray-900\/50\s*([^"]*?")/g,
    (match, before, after) => {
      fileFixed++;
      return before + after;
    }
  );

  // Remove border-gray-800 from Card components
  content = content.replace(
    /(<Card[^>]*className="[^"]*?)border-gray-800\s*([^"]*?")/g,
    (match, before, after) => {
      fileFixed++;
      return before + after;
    }
  );

  // Clean up empty or whitespace-only className attributes
  content = content.replace(/className="\s*"/g, '');
  content = content.replace(/className="(\s+)"/g, '');
  
  // Clean up double spaces
  content = content.replace(/className="([^"]*)\s{2,}([^"]*)"/g, 'className="$1 $2"');
  content = content.replace(/className="\s+/g, 'className="');
  content = content.replace(/\s+"/g, '"');

  if (content !== originalContent) {
    writeFileSync(file, content, 'utf8');
    filesModified++;
    totalFixed += fileFixed;
    console.log(`✅ ${file} - Fixed ${fileFixed} violations`);
  }
});

console.log(`\n✨ Complete! Fixed ${totalFixed} violations across ${filesModified} files`);
