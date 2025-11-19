#!/usr/bin/env node
/**
 * Text Size Class Fixer
 * Removes ALL raw text size classes (text-h1, text-h2, text-hero, text-body, etc.)
 * These should ONLY be used within Typography components, never directly in className
 */

import fs from 'fs';
import { glob } from 'glob';

const stats = {
  filesScanned: 0,
  filesModified: 0,
  violationsFixed: 0,
  errors: [],
};

// Text size classes to remove
const TEXT_SIZE_PATTERNS = [
  /\s*text-hero\s*/g,
  /\s*text-display\s*/g,
  /\s*text-h1\s*/g,
  /\s*text-h2\s*/g,
  /\s*text-h3\s*/g,
  /\s*text-h4\s*/g,
  /\s*text-h5\s*/g,
  /\s*text-h6\s*/g,
  /\s*text-subtitle\s*/g,
  /\s*text-body-lg\s*/g,
  /\s*text-body-sm\s*/g,
  /\s*text-body\s*/g,
  /\s*text-caption\s*/g,
  /\s*text-meta-lg\s*/g,
  /\s*text-meta-sm\s*/g,
  /\s*text-meta\s*/g,
  /\s*text-overline\s*/g,
];

function fixFileTextSizes(filePath) {
  // Skip Typography component itself
  if (filePath.includes('/components/atoms/Typography') || 
      filePath.includes('/components/atoms/Text')) {
    return false;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    
    // Remove text size class violations
    for (const pattern of TEXT_SIZE_PATTERNS) {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        content = content.replace(pattern, ' ');
        modified = true;
        stats.violationsFixed += matches.length;
      }
    }
    
    // Clean up empty className attributes and extra spaces
    content = content.replace(/className=["']\s*["']/g, '');
    content = content.replace(/className=["']\s+([^"']+?)\s+["']/g, 'className="$1"');
    content = content.replace(/\s{2,}/g, ' ');
    
    if (modified) {
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
  console.log('🔍 Scanning for text size class violations...\n');
  
  const files = await glob('src/**/*.{tsx,jsx}', {
    ignore: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/components/atoms/Typography.tsx',
      '**/components/atoms/Text.tsx',
    ],
  });
  
  console.log(`📁 Found ${files.length} files to scan\n`);
  
  for (const file of files) {
    stats.filesScanned++;
    fixFileTextSizes(file);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEXT SIZE CLASS VIOLATION FIX SUMMARY');
  console.log('='.repeat(60));
  console.log(`Files Scanned:    ${stats.filesScanned}`);
  console.log(`Files Modified:   ${stats.filesModified}`);
  console.log(`Violations Fixed: ${stats.violationsFixed}`);
  console.log(`Errors:           ${stats.errors.length}`);
  console.log('\n✨ Text size class violation fix complete!');
  console.log('\n⚠️  NOTE: Elements may need proper semantic HTML tags');
  console.log('   Use <h1>, <h2>, <p>, etc. with Typography components');
  
  process.exit(stats.errors.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
