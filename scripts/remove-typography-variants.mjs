#!/usr/bin/env node

/**
 * Remove variant props from Typography components
 * Typography components don't support variant prop
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';

const SRC_DIR = '/Users/julianclarkson/Documents/Grasshopper26.10/src';
const EXCLUDED_DIRS = ['__tests__', 'design-system'];

const TYPOGRAPHY_COMPONENTS = [
  'HeroTitle', 'SectionHeader', 'SubsectionHeader', 'CardTitle', 
  'BodyText', 'BodyTextSmall', 'BodyTextLarge', 'MetadataText'
];

let filesFixed = 0;
let variantsRemoved = 0;

function getAllTsxFiles(dir, files = []) {
  const items = readdirSync(dir);
  
  for (const item of items) {
    if (EXCLUDED_DIRS.includes(item)) continue;
    
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      getAllTsxFiles(fullPath, files);
    } else if (extname(fullPath) === '.tsx') {
      files.push(fullPath);
    }
  }
  
  return files;
}

function fixFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Remove variant props from Typography components
    for (const component of TYPOGRAPHY_COMPONENTS) {
      // Match <Component variant="..." ...>
      const regex = new RegExp(`<${component}\\s+variant="[^"]*"\\s*`, 'g');
      const matches = content.match(regex);
      
      if (matches) {
        variantsRemoved += matches.length;
        content = content.replace(regex, `<${component} `);
      }
      
      // Also match variant prop in middle of props
      const regex2 = new RegExp(`(<${component}[^>]*?)\\s+variant="[^"]*"`, 'g');
      content = content.replace(regex2, '$1');
    }
    
    if (content !== originalContent) {
      writeFileSync(filePath, content, 'utf8');
      filesFixed++;
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error fixing ${relative(SRC_DIR, filePath)}: ${error.message}`);
    return false;
  }
}

console.log('🔧 Removing variant props from Typography components...\n');

const files = getAllTsxFiles(SRC_DIR);
console.log(`📁 Processing ${files.length} files\n`);

for (const file of files) {
  if (fixFile(file)) {
    console.log(`✅ ${relative(SRC_DIR, file)}`);
  }
}

console.log(`\n✨ Fixed ${filesFixed} files`);
console.log(`   Removed ${variantsRemoved} variant props`);
