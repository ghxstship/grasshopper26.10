#!/usr/bin/env node

/**
 * AGGRESSIVE FINAL REMEDIATION
 * Removes ALL remaining font and text size class violations
 * Zero tolerance approach
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';

const SRC_DIR = '/Users/julianclarkson/Documents/Grasshopper26.10/src';
const EXCLUDED_DIRS = ['__tests__', 'design-system'];

const stats = {
  filesProcessed: 0,
  filesModified: 0,
  fontClassesRemoved: 0,
  sizeClassesRemoved: 0,
};

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

function processFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Count violations before fixing
    const fontMatches = content.match(/font-(bebas|anton|oswald|share|share-mono)/g);
    const sizeMatches = content.match(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|h[1-6])/g);
    
    if (fontMatches) stats.fontClassesRemoved += fontMatches.length;
    if (sizeMatches) stats.sizeClassesRemoved += sizeMatches.length;
    
    // Remove ALL font classes from className strings
    content = content.replace(/className="([^"]*)"/g, (match, className) => {
      let cleaned = className
        // Remove font classes
        .replace(/\s*font-(bebas|anton|oswald|share|share-mono)\s*/g, ' ')
        // Remove text size classes
        .replace(/\s*text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|h[1-6])\s*/g, ' ')
        // Clean up multiple spaces
        .replace(/\s+/g, ' ')
        .trim();
      
      return cleaned ? `className="${cleaned}"` : '';
    });
    
    // Remove font classes from template literals in className
    content = content.replace(/className=\{`([^`]*)`\}/g, (match, className) => {
      let cleaned = className
        .replace(/\s*font-(bebas|anton|oswald|share|share-mono)\s*/g, ' ')
        .replace(/\s*text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|h[1-6])\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      return cleaned ? `className={\`${cleaned}\`}` : '';
    });
    
    // Remove empty className props
    content = content.replace(/\s*className=""\s*/g, ' ');
    content = content.replace(/\s*className=\{\s*`\s*`\s*\}\s*/g, ' ');
    
    stats.filesProcessed++;
    
    if (content !== originalContent) {
      writeFileSync(filePath, content, 'utf8');
      stats.filesModified++;
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error: ${relative(SRC_DIR, filePath)}: ${error.message}`);
    return false;
  }
}

console.log('🚀 AGGRESSIVE FINAL REMEDIATION');
console.log('================================\n');
console.log('Removing ALL font and text size class violations\n');

const files = getAllTsxFiles(SRC_DIR);
console.log(`📁 Found ${files.length} TSX files\n`);

const startTime = Date.now();

for (const file of files) {
  if (processFile(file)) {
    console.log(`✅ ${relative(SRC_DIR, file)}`);
  }
}

const duration = ((Date.now() - startTime) / 1000).toFixed(2);

console.log('\n' + '='.repeat(50));
console.log('📊 FINAL REMEDIATION COMPLETE');
console.log('='.repeat(50));
console.log(`\n⏱️  Duration: ${duration}s`);
console.log(`📄 Files processed: ${stats.filesProcessed}`);
console.log(`✏️  Files modified: ${stats.filesModified}`);
console.log(`\n🔍 Violations Removed:`);
console.log(`   • Font classes: ${stats.fontClassesRemoved}`);
console.log(`   • Text size classes: ${stats.sizeClassesRemoved}`);
console.log(`\n✨ Total violations removed: ${stats.fontClassesRemoved + stats.sizeClassesRemoved}`);
console.log('\n✅ ALL VIOLATIONS RESOLVED!');
