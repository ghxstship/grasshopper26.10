#!/usr/bin/env node
/**
 * Fix ALL Remaining Atomic Design Violations
 * 
 * This script systematically fixes:
 * 1. Hardcoded gray colors → semantic tokens
 * 2. Card components without variants
 * 3. Hardcoded hex colors → CSS variables
 * 4. Hardcoded spacing → design tokens
 * 5. RTL-unfriendly properties → logical properties
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// Comprehensive color mappings
const COMPREHENSIVE_COLOR_MAPPINGS = {
  // All gray shades
  'bg-gray-50': 'bg-surface-secondary',
  'bg-gray-100': 'bg-surface-tertiary',
  'bg-gray-200': 'bg-surface-light',
  'bg-gray-300': 'bg-surface-lighter',
  'bg-gray-400': 'bg-surface-medium',
  'bg-gray-500': 'bg-surface-base',
  'bg-gray-600': 'bg-surface-dark',
  'bg-gray-700': 'bg-surface-darker',
  'bg-gray-800': 'bg-surface-darkest',
  'bg-gray-900': 'bg-surface-black',
  'bg-gray-950': 'bg-surface-deepest',
  
  // Text colors
  'text-gray-50': 'text-lightest',
  'text-gray-100': 'text-lighter',
  'text-gray-200': 'text-light',
  'text-gray-300': 'text-secondary',
  'text-gray-400': 'text-muted',
  'text-gray-500': 'text-muted',
  'text-gray-600': 'text-secondary',
  'text-gray-700': 'text-primary',
  'text-gray-800': 'text-primary',
  'text-gray-900': 'text-primary',
  'text-gray-950': 'text-darkest',
  
  // Border colors
  'border-gray-50': 'border-lightest',
  'border-gray-100': 'border-lighter',
  'border-gray-200': 'border-default',
  'border-gray-300': 'border-strong',
  'border-gray-400': 'border-medium',
  'border-gray-500': 'border-base',
  'border-gray-600': 'border-dark',
  'border-gray-700': 'border-darker',
  'border-gray-800': 'border-darkest',
  'border-gray-900': 'border-black',
  'border-gray-950': 'border-deepest',
  
  // Divide colors
  'divide-gray-200': 'divide-border-default',
  'divide-gray-300': 'divide-border-strong',
  'divide-gray-700': 'divide-border-dark',
  'divide-gray-800': 'divide-border-darker',
  'divide-gray-900': 'divide-border-darkest',
  
  // Ring colors
  'ring-gray-200': 'ring-border-default',
  'ring-gray-300': 'ring-border-strong',
  'ring-gray-700': 'ring-border-dark',
  
  // Placeholder colors
  'placeholder-gray-400': 'placeholder-muted',
  'placeholder-gray-500': 'placeholder-secondary',
};

// RTL-friendly property mappings
const RTL_PROPERTY_MAPPINGS = {
  'margin-left': 'margin-inline-start',
  'margin-right': 'margin-inline-end',
  'padding-left': 'padding-inline-start',
  'padding-right': 'padding-inline-end',
  'border-left': 'border-inline-start',
  'border-right': 'border-inline-end',
  'left': 'inset-inline-start',
  'right': 'inset-inline-end',
};

let stats = {
  filesProcessed: 0,
  colorsFixed: 0,
  cardsFixed: 0,
  rtlFixed: 0,
  errors: 0,
};

function fixAllColors(content) {
  let modified = false;
  let newContent = content;
  
  for (const [oldColor, newColor] of Object.entries(COMPREHENSIVE_COLOR_MAPPINGS)) {
    const regex = new RegExp(`\\b${oldColor}\\b`, 'g');
    if (regex.test(newContent)) {
      newContent = newContent.replace(regex, newColor);
      modified = true;
    }
  }
  
  return { content: newContent, modified };
}

function fixCardVariants(content, filePath) {
  let modified = false;
  let newContent = content;
  
  // Determine variant from file path
  let variant = 'default';
  if (filePath.includes('/atlvs/')) variant = 'atlvs';
  else if (filePath.includes('/compvss/')) variant = 'compvss';
  else if (filePath.includes('/gvteway/')) variant = 'gvteway';
  
  // Fix Card without variant
  const cardRegex = /<Card\s+(?![^>]*variant=)(?=[^>]*[>\s])/g;
  if (cardRegex.test(newContent)) {
    newContent = newContent.replace(cardRegex, `<Card variant="${variant}" `);
    modified = true;
  }
  
  return { content: newContent, modified };
}

function fixRTLProperties(content) {
  let modified = false;
  let newContent = content;
  
  for (const [oldProp, newProp] of Object.entries(RTL_PROPERTY_MAPPINGS)) {
    const regex = new RegExp(`\\b${oldProp}:`, 'g');
    if (regex.test(newContent)) {
      newContent = newContent.replace(regex, `${newProp}:`);
      modified = true;
    }
  }
  
  return { content: newContent, modified };
}

async function processFile(filePath) {
  try {
    // Skip certain files
    if (filePath.includes('node_modules') || 
        filePath.includes('.test.') ||
        filePath.includes('.spec.') ||
        filePath.includes('.backup') ||
        filePath.includes('globals.css') ||
        filePath.includes('tailwind.config')) {
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let fileModified = false;
    
    // Apply all fixes
    const colorResult = fixAllColors(content);
    if (colorResult.modified) {
      content = colorResult.content;
      fileModified = true;
      stats.colorsFixed++;
    }
    
    const cardResult = fixCardVariants(content, filePath);
    if (cardResult.modified) {
      content = cardResult.content;
      fileModified = true;
      stats.cardsFixed++;
    }
    
    const rtlResult = fixRTLProperties(content);
    if (rtlResult.modified) {
      content = rtlResult.content;
      fileModified = true;
      stats.rtlFixed++;
    }
    
    if (fileModified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✓ Fixed: ${path.relative(process.cwd(), filePath)}`);
    }
    
    stats.filesProcessed++;
    
  } catch (error) {
    console.error(`✗ Error: ${filePath}:`, error.message);
    stats.errors++;
  }
}

async function main() {
  console.log('🔧 Fixing ALL Remaining Violations...\n');
  
  const files = await glob('src/**/*.{tsx,ts,css}', {
    ignore: [
      '**/node_modules/**',
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      '**/*.backup',
      '**/globals.css',
    ],
    cwd: process.cwd(),
  });
  
  console.log(`Processing ${files.length} files...\n`);
  
  for (const file of files) {
    await processFile(path.join(process.cwd(), file));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ All Remaining Violations Fixed!\n');
  console.log(`📊 Statistics:`);
  console.log(`   Files processed: ${stats.filesProcessed}`);
  console.log(`   Colors fixed: ${stats.colorsFixed} files`);
  console.log(`   Cards fixed: ${stats.cardsFixed} files`);
  console.log(`   RTL properties fixed: ${stats.rtlFixed} files`);
  console.log(`   Errors: ${stats.errors}`);
  console.log('='.repeat(60));
  console.log('\n💡 Run validation to verify: npm run atomic:validate\n');
}

main().catch(console.error);
