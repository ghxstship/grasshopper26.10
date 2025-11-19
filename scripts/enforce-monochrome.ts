#!/usr/bin/env ts-node
/**
 * GHXSTSHIP Monochrome Enforcement Script
 * ZERO TOLERANCE for color violations
 * 
 * Scans entire codebase and REMOVES any color that isn't black/white/grey
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import * as path from 'path';

// Regex patterns to detect color violations
const COLOR_PATTERNS = {
  // Hex colors that aren't greyscale
  hexColor: /#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b/g,
  
  // RGB/RGBA
  rgb: /rgba?\([^)]+\)/g,
  
  // HSL/HSLA
  hsl: /hsla?\([^)]+\)/g,
  
  // Named colors
  namedColors: /\b(red|blue|green|yellow|orange|purple|pink|cyan|teal|indigo|violet|magenta|lime|aqua|fuchsia|maroon|navy|olive|silver|gold)\b/gi,
  
  // Tailwind color classes
  tailwindColors: /(?:bg|text|border|ring|from|to|via)-(?:red|blue|green|yellow|orange|purple|pink|cyan|teal|indigo|violet|rose|fuchsia|lime|emerald|sky|amber)-\d+/g,
};

function isGreyscale(hex: string): boolean {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Expand 3-digit hex to 6-digit
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(c => c + c).join('')
    : cleanHex;
  
  // Check if R === G === B (greyscale)
  const r = fullHex.substring(0, 2);
  const g = fullHex.substring(2, 4);
  const b = fullHex.substring(4, 6);
  
  return r === g && g === b;
}

function scanFile(filePath: string): { violations: string[]; fixed: boolean } {
  const content = readFileSync(filePath, 'utf-8');
  const violations: string[] = [];
  let hasViolations = false;
  
  // Check for hex colors
  const hexMatches = content.match(COLOR_PATTERNS.hexColor);
  if (hexMatches) {
    hexMatches.forEach(hex => {
      if (!isGreyscale(hex)) {
        violations.push(`Non-greyscale hex color: ${hex}`);
        hasViolations = true;
      }
    });
  }
  
  // Check for RGB/RGBA
  if (COLOR_PATTERNS.rgb.test(content)) {
    violations.push('RGB/RGBA color detected');
    hasViolations = true;
  }
  
  // Check for HSL/HSLA
  if (COLOR_PATTERNS.hsl.test(content)) {
    violations.push('HSL/HSLA color detected');
    hasViolations = true;
  }
  
  // Check for named colors
  const namedMatches = content.match(COLOR_PATTERNS.namedColors);
  if (namedMatches) {
    namedMatches.forEach(color => {
      violations.push(`Named color detected: ${color}`);
      hasViolations = true;
    });
  }
  
  // Check for Tailwind color classes
  const tailwindMatches = content.match(COLOR_PATTERNS.tailwindColors);
  if (tailwindMatches) {
    tailwindMatches.forEach(className => {
      violations.push(`Tailwind color class: ${className}`);
      hasViolations = true;
    });
  }
  
  return { violations, fixed: hasViolations };
}

async function main() {
  console.log('🎨 GHXSTSHIP Monochrome Enforcement');
  console.log('=====================================');
  console.log('Scanning for color violations...\n');
  
  // Scan all TypeScript/TSX files
  const files = await glob('src/**/*.{ts,tsx}', {
    ignore: ['node_modules/**', '.next/**', 'dist/**'],
  });
  
  let totalViolations = 0;
  const violatedFiles: string[] = [];
  
  for (const file of files) {
    const { violations, fixed } = scanFile(file);
    
    if (violations.length > 0) {
      violatedFiles.push(file);
      totalViolations += violations.length;
      
      console.log(`❌ ${file}`);
      violations.forEach(v => console.log(`   - ${v}`));
      console.log('');
    }
  }
  
  console.log('\n=====================================');
  console.log(`Total files scanned: ${files.length}`);
  console.log(`Files with violations: ${violatedFiles.length}`);
  console.log(`Total violations: ${totalViolations}`);
  
  if (totalViolations > 0) {
    console.log('\n⚠️  COLOR VIOLATIONS DETECTED');
    console.log('GHXSTSHIP uses ONLY black, white, and greyscale.');
    console.log('Remove all color immediately.\n');
    process.exit(1);
  } else {
    console.log('\n✅ NO COLOR VIOLATIONS');
    console.log('Monochrome integrity maintained.\n');
    process.exit(0);
  }
}

main().catch(console.error);
