#!/usr/bin/env node

/**
 * Fix Card variants and color violations
 * - Add proper variant props to Card components
 * - Remove all gradient classes (violates monochromatic system)
 * - Fix custom Card styling
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
  
  // Determine platform variant from file path
  let platformVariant = 'default';
  if (filePath.includes('/gvteway/')) {
    platformVariant = 'gvteway';
  } else if (filePath.includes('/compvss/')) {
    platformVariant = 'compvss';
  } else if (filePath.includes('/atlvs/')) {
    platformVariant = 'atlvs';
  }
  
  // Fix 1: Remove gradient classes completely (violates monochromatic system)
  const gradientPatterns = [
    /bg-gradient-to-[a-z]+/g,
    /from-[a-z]+-[0-9]+(?:\/[0-9]+)?/g,
    /via-[a-z]+-[0-9]+(?:\/[0-9]+)?/g,
    /to-[a-z]+-[0-9]+(?:\/[0-9]+)?/g,
  ];
  
  for (const pattern of gradientPatterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, '');
      modified = true;
    }
  }
  
  // Fix 2: Add variant prop to Card components that don't have one
  const cardRegex = /<Card(\s+[^>]*)?>/g;
  content = content.replace(cardRegex, (match, attrs) => {
    // Skip if already has variant
    if (attrs && attrs.includes('variant=')) {
      return match;
    }
    
    // Add platform-specific variant
    if (platformVariant !== 'default') {
      modified = true;
      return `<Card variant="${platformVariant}"${attrs || ''}>`;
    }
    
    return match;
  });
  
  // Fix 3: Remove custom Card background/border styling that violates design system
  const customCardStyling = [
    /bg-gray-[0-9]+\/[0-9]+/g,
    /bg-grey-[0-9]+\/[0-9]+/g,
    /border-gray-[0-9]+/g,
    /border-grey-[0-9]+/g,
    /backdrop-blur-sm/g, // Card component handles this
  ];
  
  for (const pattern of customCardStyling) {
    if (pattern.test(content)) {
      content = content.replace(pattern, '');
      modified = true;
    }
  }
  
  // Fix 4: Clean up className attributes with multiple spaces
  content = content.replace(/className="([^"]*)"/g, (match, className) => {
    const cleaned = className
      .split(/\s+/)
      .filter(c => c.length > 0)
      .join(' ')
      .trim();
    
    if (cleaned !== className) {
      modified = true;
    }
    
    return cleaned ? `className="${cleaned}"` : '';
  });
  
  // Fix 5: Remove empty className attributes
  content = content.replace(/\s+className=""\s*/g, ' ');
  
  if (modified) {
    writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

// Main execution
console.log('🎨 Fixing Card variants and color violations...\n');

const files = getAllTsxFiles(SRC_DIR);
console.log(`📁 Found ${files.length} TSX files to process\n`);

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
    console.error(`❌ Error fixing ${file}:`, error.message);
  }
}

console.log(`\n✨ Complete!`);
console.log(`   Fixed: ${fixedCount} files`);
console.log(`   Errors: ${errorCount} files`);
console.log(`   Total: ${files.length} files processed`);
