#!/usr/bin/env node

/**
 * Final cleanup - remove remaining gradient violations
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const SRC_DIR = '/Users/julianclarkson/Documents/Grasshopper26.10/src/app';

function getAllTsxFiles(dir, files = []) {
  const items = readdirSync(dir);
  
  for (const item of items) {
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
  let content = readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Remove gradient classes in className attributes
  const classNameRegex = /className="([^"]*)"/g;
  content = content.replace(classNameRegex, (match, className) => {
    const original = className;
    
    // Remove all gradient-related classes
    className = className
      .replace(/\s*bg-gradient-to-[a-z]+\s*/g, ' ')
      .replace(/\s*from-[a-z]+-[0-9]+(?:\/[0-9]+)?\s*/g, ' ')
      .replace(/\s*via-[a-z]+-[0-9]+(?:\/[0-9]+)?\s*/g, ' ')
      .replace(/\s*to-[a-z]+-[0-9]+(?:\/[0-9]+)?\s*/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (className !== original) {
      modified = true;
    }
    
    return className ? `className="${className}"` : '';
  });
  
  // Remove empty className attributes
  content = content.replace(/\s+className=""\s*/g, ' ');
  
  if (modified) {
    writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

// Main execution
console.log('🧹 Final cleanup - removing gradient violations...\n');

const files = getAllTsxFiles(SRC_DIR);
let fixedCount = 0;

for (const file of files) {
  try {
    if (fixFile(file)) {
      fixedCount++;
      const relativePath = file.replace(SRC_DIR, '');
      console.log(`✅ Cleaned: ${relativePath}`);
    }
  } catch (error) {
    console.error(`❌ Error: ${file}`, error.message);
  }
}

console.log(`\n✨ Cleanup complete! Fixed ${fixedCount} files`);
