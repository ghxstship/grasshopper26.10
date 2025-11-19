#!/usr/bin/env node

/**
 * Final comprehensive violation fixer
 * - Fix all malformed rounded classes
 * - Add Button variants where missing
 * - Remove any remaining color violations
 * - Clean up all styling issues
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
  
  // Determine platform variant
  let platformVariant = 'default';
  if (filePath.includes('/gvteway/')) {
    platformVariant = 'gvteway';
  } else if (filePath.includes('/compvss/')) {
    platformVariant = 'compvss';
  } else if (filePath.includes('/atlvs/')) {
    platformVariant = 'atlvs';
  }
  
  // Fix 1: Fix all malformed rounded classes
  const roundedFixes = [
    { from: /rounded-none-none-none/g, to: 'rounded-none' },
    { from: /rounded-none-none-full/g, to: 'rounded-full' },
    { from: /rounded-none-none/g, to: 'rounded-none' },
  ];
  
  for (const { from, to } of roundedFixes) {
    if (from.test(content)) {
      content = content.replace(from, to);
      modified = true;
    }
  }
  
  // Fix 2: Replace gray- with grey- for consistency with design system
  if (/\bgray-/.test(content)) {
    content = content.replace(/\bgray-/g, 'grey-');
    modified = true;
  }
  
  // Fix 3: Remove any remaining gradient classes
  const gradientClasses = [
    /bg-gradient-to-[a-z]+/g,
    /from-[a-z]+-[0-9]+(?:\/[0-9]+)?/g,
    /via-[a-z]+-[0-9]+(?:\/[0-9]+)?/g,
    /to-[a-z]+-[0-9]+(?:\/[0-9]+)?/g,
  ];
  
  for (const pattern of gradientClasses) {
    if (pattern.test(content)) {
      content = content.replace(pattern, '');
      modified = true;
    }
  }
  
  // Fix 4: Add Button variants where missing (only for platform-specific pages)
  if (platformVariant !== 'default') {
    const buttonRegex = /<Button(\s+[^>]*)?>/g;
    content = content.replace(buttonRegex, (match, attrs) => {
      // Skip if already has variant or is ghost/outline
      if (attrs && (attrs.includes('variant=') || attrs.includes('ghost') || attrs.includes('outline'))) {
        return match;
      }
      
      // Add platform-specific variant
      modified = true;
      return `<Button variant="${platformVariant}"${attrs || ''}>`;
    });
  }
  
  // Fix 5: Remove custom background/border overrides that violate design system
  const customStyling = [
    /bg-gray-[0-9]+\/[0-9]+/g,
    /bg-grey-[0-9]+\/[0-9]+/g,
    /border-gray-[0-9]+\/[0-9]+/g,
    /border-grey-[0-9]+\/[0-9]+/g,
  ];
  
  for (const pattern of customStyling) {
    if (pattern.test(content)) {
      content = content.replace(pattern, '');
      modified = true;
    }
  }
  
  // Fix 6: Clean up className attributes
  content = content.replace(/className="([^"]*)"/g, (match, className) => {
    const cleaned = className
      .split(/\s+/)
      .filter(c => c.length > 0 && c !== 'undefined')
      .join(' ')
      .trim();
    
    if (cleaned !== className) {
      modified = true;
    }
    
    return cleaned ? `className="${cleaned}"` : '';
  });
  
  // Fix 7: Remove empty className attributes
  if (/\s+className=""\s*/.test(content)) {
    content = content.replace(/\s+className=""\s*/g, ' ');
    modified = true;
  }
  
  // Fix 8: Fix spacing issues in JSX
  content = content.replace(/\s{2,}/g, ' ');
  
  if (modified) {
    writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

// Main execution
console.log('🔧 Running final violation fixes...\n');

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
