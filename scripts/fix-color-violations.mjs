#!/usr/bin/env node
/**
 * Color Violation Fixer
 * Removes hardcoded Tailwind color classes and enforces design system usage
 * 
 * TRANSFORMATIONS:
 * - bg-gray-* → Remove (use Card variant or CSS variables)
 * - bg-blue-* → Remove (use Button/Card variant)
 * - text-gray-* → Use semantic text colors
 * - border-gray-* → Use semantic border colors
 */

import fs from 'fs';
import { glob } from 'glob';

const stats = {
  filesScanned: 0,
  filesModified: 0,
  violationsFixed: 0,
  errors: [],
};

// Patterns to remove
const COLOR_PATTERNS = [
  // Background colors
  /\s*bg-gray-\d+\/?\d*\s*/g,
  /\s*bg-blue-\d+\/?\d*\s*/g,
  /\s*bg-red-\d+\/?\d*\s*/g,
  /\s*bg-green-\d+\/?\d*\s*/g,
  /\s*bg-yellow-\d+\/?\d*\s*/g,
  /\s*bg-purple-\d+\/?\d*\s*/g,
  /\s*bg-pink-\d+\/?\d*\s*/g,
  /\s*bg-indigo-\d+\/?\d*\s*/g,
  /\s*bg-cyan-\d+\/?\d*\s*/g,
  /\s*bg-teal-\d+\/?\d*\s*/g,
  /\s*bg-orange-\d+\/?\d*\s*/g,
  
  // Text colors (except platform-specific)
  /\s*text-gray-\d+\s*/g,
  /\s*text-blue-\d+\s*/g,
  /\s*text-red-\d+\s*/g,
  /\s*text-green-\d+\s*/g,
  /\s*text-yellow-\d+\s*/g,
  /\s*text-purple-\d+\s*/g,
  /\s*text-pink-\d+\s*/g,
  /\s*text-indigo-\d+\s*/g,
  
  // Border colors
  /\s*border-gray-\d+\s*/g,
  /\s*border-blue-\d+\s*/g,
  /\s*border-red-\d+\s*/g,
  /\s*border-green-\d+\s*/g,
];

function fixFileColors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    const originalContent = content;
    
    // Remove color class violations
    for (const pattern of COLOR_PATTERNS) {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        content = content.replace(pattern, ' ');
        modified = true;
        stats.violationsFixed += matches.length;
      }
    }
    
    // Clean up className attributes
    content = content.replace(/className=["'](\s+)["']/g, '');
    content = content.replace(/className=["']\s+([^"']+)\s+["']/g, 'className="$1"');
    content = content.replace(/\s+/g, ' ');
    
    if (modified && content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      stats.filesModified++;
      console.log(`✅ Fixed ${filePath}`);
    }
    
    return modified;
  } catch (error) {
    stats.errors.push({ file: filePath, error: error.message });
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 Scanning for color violations...\n');
  
  const files = await glob('src/**/*.{tsx,jsx}', {
    ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
  });
  
  console.log(`📁 Found ${files.length} files to scan\n`);
  
  for (const file of files) {
    stats.filesScanned++;
    fixFileColors(file);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 COLOR VIOLATION FIX SUMMARY');
  console.log('='.repeat(60));
  console.log(`Files Scanned:    ${stats.filesScanned}`);
  console.log(`Files Modified:   ${stats.filesModified}`);
  console.log(`Violations Fixed: ${stats.violationsFixed}`);
  console.log(`Errors:           ${stats.errors.length}`);
  console.log('\n✨ Color violation fix complete!');
  
  process.exit(stats.errors.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
