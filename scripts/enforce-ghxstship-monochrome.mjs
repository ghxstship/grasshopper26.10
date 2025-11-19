#!/usr/bin/env node
/**
 * GHXSTSHIP Monochrome Enforcer
 * 
 * Removes ALL colors and replaces with black/white/grey only
 * Zero tolerance for color violations
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// Color replacements - ALL colors become monochrome
const COLOR_REPLACEMENTS = {
  // Remove all ATLVS colors
  'bg-atlvs-green-500': 'bg-black',
  'bg-atlvs-orange-500': 'bg-black',
  'bg-atlvs-purple-500': 'bg-black',
  'text-atlvs-green-500': 'text-black',
  'text-atlvs-orange-500': 'text-black',
  'text-atlvs-purple-500': 'text-black',
  'border-atlvs-green-500': 'border-black',
  'border-atlvs-orange-500': 'border-black',
  'border-atlvs-purple-500': 'border-black',
  
  // Remove all COMPVSS colors
  'bg-compvss-cyan-500': 'bg-black',
  'bg-compvss-teal-500': 'bg-black',
  'bg-compvss-indigo-500': 'bg-black',
  'text-compvss-cyan-500': 'text-black',
  'text-compvss-teal-500': 'text-black',
  'text-compvss-indigo-500': 'text-black',
  'border-compvss-cyan-500': 'border-black',
  'border-compvss-teal-500': 'border-black',
  'border-compvss-indigo-500': 'border-black',
  
  // Remove all GVTEWAY colors
  'bg-gvteway-red-500': 'bg-black',
  'bg-gvteway-yellow-500': 'bg-black',
  'bg-gvteway-blue-500': 'bg-black',
  'text-gvteway-red-500': 'text-black',
  'text-gvteway-yellow-500': 'text-black',
  'text-gvteway-blue-500': 'text-black',
  'border-gvteway-red-500': 'border-black',
  'border-gvteway-yellow-500': 'border-black',
  'border-gvteway-blue-500': 'border-black',
  
  // Replace gradients with solid black or white
  'bg-gradient-to-r': 'bg-black',
  'bg-gradient-to-l': 'bg-black',
  'bg-gradient-to-t': 'bg-black',
  'bg-gradient-to-b': 'bg-black',
  'bg-gradient-to-br': 'bg-black',
  'bg-gradient-to-bl': 'bg-black',
  'bg-gradient-to-tr': 'bg-black',
  'bg-gradient-to-tl': 'bg-black',
  
  // Replace rounded corners with sharp edges
  'rounded-lg': 'rounded-none',
  'rounded-md': 'rounded-none',
  'rounded-sm': 'rounded-none',
  'rounded-xl': 'rounded-none',
  'rounded-2xl': 'rounded-none',
  'rounded-3xl': 'rounded-none',
  'rounded': 'rounded-none',
  
  // Replace soft shadows with hard shadows
  'shadow-sm': 'shadow-hard-sm',
  'shadow-md': 'shadow-hard',
  'shadow-lg': 'shadow-hard-lg',
  'shadow-xl': 'shadow-hard-lg',
  'shadow-2xl': 'shadow-hard-lg',
  'shadow': 'shadow-hard',
};

// Remove variant props that reference colors
const VARIANT_REMOVALS = [
  /variant=["'](atlvs|compvss|gvteway)["']/g,
  /variant=["'](atlvs-outline|compvss-outline|gvteway-outline)["']/g,
  /variant=["'](primary|secondary|success|warning|error|info)["']/g,
];

let stats = {
  filesProcessed: 0,
  colorsRemoved: 0,
  gradientsRemoved: 0,
  roundingRemoved: 0,
  variantsRemoved: 0,
  errors: 0,
};

function enforceMonochrome(content) {
  let modified = false;
  let newContent = content;
  
  // Replace all color classes
  for (const [oldClass, newClass] of Object.entries(COLOR_REPLACEMENTS)) {
    const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
    if (regex.test(newContent)) {
      newContent = newContent.replace(regex, newClass);
      modified = true;
      stats.colorsRemoved++;
    }
  }
  
  // Remove gradient classes
  const gradientRegex = /\b(from|via|to)-\w+-\d+\b/g;
  if (gradientRegex.test(newContent)) {
    newContent = newContent.replace(gradientRegex, '');
    modified = true;
    stats.gradientsRemoved++;
  }
  
  // Remove color variant props
  for (const variantRegex of VARIANT_REMOVALS) {
    if (variantRegex.test(newContent)) {
      newContent = newContent.replace(variantRegex, '');
      modified = true;
      stats.variantsRemoved++;
    }
  }
  
  // Replace any remaining color references with black/white/grey
  const colorPatterns = [
    { pattern: /\btext-red-\d+\b/g, replace: 'text-black' },
    { pattern: /\btext-blue-\d+\b/g, replace: 'text-black' },
    { pattern: /\btext-green-\d+\b/g, replace: 'text-black' },
    { pattern: /\btext-yellow-\d+\b/g, replace: 'text-black' },
    { pattern: /\btext-purple-\d+\b/g, replace: 'text-black' },
    { pattern: /\btext-pink-\d+\b/g, replace: 'text-black' },
    { pattern: /\btext-indigo-\d+\b/g, replace: 'text-black' },
    { pattern: /\btext-cyan-\d+\b/g, replace: 'text-black' },
    { pattern: /\btext-teal-\d+\b/g, replace: 'text-black' },
    { pattern: /\btext-orange-\d+\b/g, replace: 'text-black' },
    
    { pattern: /\bbg-red-\d+\b/g, replace: 'bg-black' },
    { pattern: /\bbg-blue-\d+\b/g, replace: 'bg-black' },
    { pattern: /\bbg-green-\d+\b/g, replace: 'bg-black' },
    { pattern: /\bbg-yellow-\d+\b/g, replace: 'bg-black' },
    { pattern: /\bbg-purple-\d+\b/g, replace: 'bg-black' },
    { pattern: /\bbg-pink-\d+\b/g, replace: 'bg-black' },
    { pattern: /\bbg-indigo-\d+\b/g, replace: 'bg-black' },
    { pattern: /\bbg-cyan-\d+\b/g, replace: 'bg-black' },
    { pattern: /\bbg-teal-\d+\b/g, replace: 'bg-black' },
    { pattern: /\bbg-orange-\d+\b/g, replace: 'bg-black' },
    
    { pattern: /\bborder-red-\d+\b/g, replace: 'border-black' },
    { pattern: /\bborder-blue-\d+\b/g, replace: 'border-black' },
    { pattern: /\bborder-green-\d+\b/g, replace: 'border-black' },
    { pattern: /\bborder-yellow-\d+\b/g, replace: 'border-black' },
    { pattern: /\bborder-purple-\d+\b/g, replace: 'border-black' },
    { pattern: /\bborder-pink-\d+\b/g, replace: 'border-black' },
    { pattern: /\bborder-indigo-\d+\b/g, replace: 'border-black' },
    { pattern: /\bborder-cyan-\d+\b/g, replace: 'border-black' },
    { pattern: /\bborder-teal-\d+\b/g, replace: 'border-black' },
    { pattern: /\bborder-orange-\d+\b/g, replace: 'border-black' },
  ];
  
  for (const { pattern, replace } of colorPatterns) {
    if (pattern.test(newContent)) {
      newContent = newContent.replace(pattern, replace);
      modified = true;
      stats.colorsRemoved++;
    }
  }
  
  return { content: newContent, modified };
}

async function processFile(filePath) {
  try {
    if (filePath.includes('node_modules') || 
        filePath.includes('.test.') ||
        filePath.includes('.spec.') ||
        filePath.includes('tailwind.config')) {
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const result = enforceMonochrome(content);
    
    if (result.modified) {
      fs.writeFileSync(filePath, result.content, 'utf-8');
      console.log(`✓ Enforced monochrome: ${path.relative(process.cwd(), filePath)}`);
    }
    
    stats.filesProcessed++;
    
  } catch (error) {
    console.error(`✗ Error: ${filePath}:`, error.message);
    stats.errors++;
  }
}

async function main() {
  console.log('🎨 GHXSTSHIP Monochrome Enforcer\n');
  console.log('Removing ALL colors - Zero tolerance policy\n');
  
  const files = await glob('src/**/*.{tsx,ts,jsx,js,css}', {
    ignore: ['**/node_modules/**', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    cwd: process.cwd(),
  });
  
  console.log(`Processing ${files.length} files...\n`);
  
  for (const file of files) {
    await processFile(path.join(process.cwd(), file));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Monochrome Enforcement Complete!\n');
  console.log(`📊 Statistics:`);
  console.log(`   Files processed: ${stats.filesProcessed}`);
  console.log(`   Colors removed: ${stats.colorsRemoved}`);
  console.log(`   Gradients removed: ${stats.gradientsRemoved}`);
  console.log(`   Rounding removed: ${stats.roundingRemoved}`);
  console.log(`   Variants removed: ${stats.variantsRemoved}`);
  console.log(`   Errors: ${stats.errors}`);
  console.log('='.repeat(60));
  console.log('\n🎨 GHXSTSHIP: Black. White. Grey. Nothing else.\n');
}

main().catch(console.error);
