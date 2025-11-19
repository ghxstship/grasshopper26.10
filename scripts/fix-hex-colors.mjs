#!/usr/bin/env node
/**
 * Hex Color Violation Fixer
 * Replaces hardcoded hex colors with CSS variables
 */

import fs from 'fs';
import { glob } from 'glob';

const stats = {
  filesScanned: 0,
  filesModified: 0,
  violationsFixed: 0,
  errors: [],
};

// Hex color to CSS variable mappings
const HEX_MAPPINGS = {
  '#000000': 'var(--ghxst-black)',
  '#000': 'var(--ghxst-black)',
  '#FFFFFF': 'var(--ghxst-white)',
  '#FFF': 'var(--ghxst-white)',
  '#F5F5F5': 'var(--ghxst-grey-100)',
  '#E5E5E5': 'var(--ghxst-grey-200)',
  '#D4D4D4': 'var(--ghxst-grey-300)',
  '#A3A3A3': 'var(--ghxst-grey-400)',
  '#737373': 'var(--ghxst-grey-500)',
  '#525252': 'var(--ghxst-grey-600)',
  '#404040': 'var(--ghxst-grey-700)',
  '#262626': 'var(--ghxst-grey-800)',
  '#171717': 'var(--ghxst-grey-900)',
};

function fixFileHexColors(filePath) {
  // Skip token definition files
  if (filePath.includes('/tokens/') || filePath.includes('colors.ts')) {
    return false;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    
    // Replace hex colors with CSS variables
    for (const [hex, cssVar] of Object.entries(HEX_MAPPINGS)) {
      const hexPattern = new RegExp(`['"]${hex}['"]`, 'gi');
      if (hexPattern.test(content)) {
        content = content.replace(hexPattern, `'${cssVar}'`);
        modified = true;
        stats.violationsFixed++;
      }
    }
    
    // Replace inline style hex colors
    const inlineHexPattern = /style=\{\{[^}]*color:\s*['"]?(#[0-9A-Fa-f]{3,6})['"]?[^}]*\}\}/g;
    if (inlineHexPattern.test(content)) {
      content = content.replace(inlineHexPattern, (match) => {
        const hexMatch = match.match(/#[0-9A-Fa-f]{3,6}/);
        if (hexMatch && HEX_MAPPINGS[hexMatch[0].toUpperCase()]) {
          modified = true;
          stats.violationsFixed++;
          return match.replace(hexMatch[0], HEX_MAPPINGS[hexMatch[0].toUpperCase()]);
        }
        return match;
      });
    }
    
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
  console.log('🔍 Scanning for hex color violations...\n');
  
  const files = await glob('src/**/*.{tsx,jsx,ts,js}', {
    ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/tokens/**'],
  });
  
  console.log(`📁 Found ${files.length} files to scan\n`);
  
  for (const file of files) {
    stats.filesScanned++;
    fixFileHexColors(file);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 HEX COLOR VIOLATION FIX SUMMARY');
  console.log('='.repeat(60));
  console.log(`Files Scanned:    ${stats.filesScanned}`);
  console.log(`Files Modified:   ${stats.filesModified}`);
  console.log(`Violations Fixed: ${stats.violationsFixed}`);
  console.log(`Errors:           ${stats.errors.length}`);
  console.log('\n✨ Hex color violation fix complete!');
  
  process.exit(stats.errors.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
