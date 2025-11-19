#!/usr/bin/env node

/**
 * Remove ALL rounded edges from the entire repository
 * Enforces brutalist geometric design with sharp edges only
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const SRC_DIR = '/Users/julianclarkson/Documents/Grasshopper26.10/src';

function getAllFiles(dir, files = []) {
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (['.tsx', '.ts', '.css', '.scss'].includes(extname(fullPath))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function fixFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Remove ALL rounded classes
  const roundedPatterns = [
    // Specific rounded classes
    /\brounded-full\b/g,
    /\brounded-lg\b/g,
    /\brounded-md\b/g,
    /\brounded-sm\b/g,
    /\brounded-xl\b/g,
    /\brounded-2xl\b/g,
    /\brounded-3xl\b/g,
    /\brounded\b(?!-none)/g, // rounded but not rounded-none
    
    // Corner-specific rounded classes
    /\brounded-t-\w+\b/g,
    /\brounded-b-\w+\b/g,
    /\brounded-l-\w+\b/g,
    /\brounded-r-\w+\b/g,
    /\brounded-tl-\w+\b/g,
    /\brounded-tr-\w+\b/g,
    /\brounded-bl-\w+\b/g,
    /\brounded-br-\w+\b/g,
  ];
  
  for (const pattern of roundedPatterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, 'rounded-none');
      modified = true;
    }
  }
  
  // Clean up duplicate rounded-none
  content = content.replace(/(\brounded-none\s+)+rounded-none\b/g, 'rounded-none');
  
  // Clean up className attributes
  content = content.replace(/className="([^"]*)"/g, (match, className) => {
    const cleaned = className
      .split(/\s+/)
      .filter((c, i, arr) => c.length > 0 && arr.indexOf(c) === i) // Remove duplicates
      .join(' ')
      .trim();
    
    if (cleaned !== className) {
      modified = true;
    }
    
    return cleaned ? `className="${cleaned}"` : '';
  });
  
  // Remove empty className
  content = content.replace(/\s+className=""\s*/g, ' ');
  
  if (modified) {
    writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

// Main execution
console.log('🔪 Removing ALL rounded edges - enforcing brutalist sharp edges...\n');

const files = getAllFiles(SRC_DIR);
console.log(`📁 Found ${files.length} files to process\n`);

let fixedCount = 0;
let errorCount = 0;

for (const file of files) {
  try {
    const relativePath = file.replace(SRC_DIR, '');
    if (fixFile(file)) {
      fixedCount++;
      console.log(`✅ Fixed: ${relativePath}`);
    }
  } catch (error) {
    errorCount++;
    console.error(`❌ Error: ${file}`, error.message);
  }
}

console.log(`\n✨ Complete!`);
console.log(`   Fixed: ${fixedCount} files`);
console.log(`   Errors: ${errorCount} files`);
console.log(`   Total: ${files.length} files processed`);
console.log(`\n🔪 All rounded edges removed - brutalist sharp edges enforced!`);
