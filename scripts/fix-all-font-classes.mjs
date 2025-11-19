#!/usr/bin/env node
/**
 * Comprehensive Font Class Fixer
 * Removes ALL raw font class usage (font-bebas, font-anton, font-oswald, font-share-tech, font-share-tech-mono)
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

// Font classes to remove
const FONT_CLASS_PATTERNS = [
  /\s*font-anton\s*/g,
  /\s*font-bebas\s*/g,
  /\s*font-oswald\s*/g,
  /\s*font-share-tech-mono\s*/g,
  /\s*font-share-tech\s*/g,
  /\s*font-share\s*/g,
];

function fixFileFontClasses(filePath) {
  // Skip Typography component itself
  if (filePath.includes('/components/atoms/Typography') || 
      filePath.includes('/components/atoms/Text')) {
    return false;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    
    // Remove font class violations
    for (const pattern of FONT_CLASS_PATTERNS) {
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
  console.log('🔍 Scanning for raw font class violations...\n');
  
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
    fixFileFontClasses(file);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 FONT CLASS VIOLATION FIX SUMMARY');
  console.log('='.repeat(60));
  console.log(`Files Scanned:    ${stats.filesScanned}`);
  console.log(`Files Modified:   ${stats.filesModified}`);
  console.log(`Violations Fixed: ${stats.violationsFixed}`);
  console.log(`Errors:           ${stats.errors.length}`);
  console.log('\n✨ Font class violation fix complete!');
  console.log('\n⚠️  NOTE: Files may need Typography component imports added manually');
  console.log('   Use appropriate components: HeroTitle, SectionHeader, BodyText, etc.');
  
  process.exit(stats.errors.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
