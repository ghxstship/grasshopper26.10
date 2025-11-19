#!/usr/bin/env node
/**
 * GHXSTSHIP Monochrome Enforcement Script
 * ZERO TOLERANCE for color violations
 */

import { readFileSync } from 'fs';
import { glob } from 'glob';

// Regex patterns to detect color violations
const COLOR_PATTERNS = {
  hexColor: /#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b/g,
  rgb: /rgba?\([^)]+\)/g,
  hsl: /hsla?\([^)]+\)/g,
  namedColors: /\b(red|blue|green|yellow|orange|purple|pink|cyan|teal|indigo|violet|magenta|lime|aqua|fuchsia|maroon|navy|olive|silver|gold)\b/gi,
  tailwindColors: /(?:bg|text|border|ring|from|to|via)-(?:red|blue|green|yellow|orange|purple|pink|cyan|teal|indigo|violet|rose|fuchsia|lime|emerald|sky|amber)-\d+/g,
};

function isGreyscale(hex) {
  const cleanHex = hex.replace('#', '');
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(c => c + c).join('')
    : cleanHex;
  
  const r = fullHex.substring(0, 2);
  const g = fullHex.substring(2, 4);
  const b = fullHex.substring(4, 6);
  
  return r === g && g === b;
}

function scanFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const violations = [];
  
  // Check for hex colors
  const hexMatches = content.match(COLOR_PATTERNS.hexColor);
  if (hexMatches) {
    hexMatches.forEach(hex => {
      if (!isGreyscale(hex)) {
        violations.push(`Non-greyscale hex: ${hex}`);
      }
    });
  }
  
  // Check for RGB/RGBA
  if (COLOR_PATTERNS.rgb.test(content)) {
    violations.push('RGB/RGBA detected');
  }
  
  // Check for HSL/HSLA
  if (COLOR_PATTERNS.hsl.test(content)) {
    violations.push('HSL/HSLA detected');
  }
  
  // Check for named colors
  const namedMatches = content.match(COLOR_PATTERNS.namedColors);
  if (namedMatches) {
    namedMatches.forEach(color => {
      violations.push(`Named color: ${color}`);
    });
  }
  
  // Check for Tailwind color classes
  const tailwindMatches = content.match(COLOR_PATTERNS.tailwindColors);
  if (tailwindMatches) {
    tailwindMatches.forEach(className => {
      violations.push(`Tailwind color: ${className}`);
    });
  }
  
  return violations;
}

async function main() {
  console.log('🎨 GHXSTSHIP Monochrome Enforcement\n');
  
  const files = await glob('src/**/*.{ts,tsx,css}', {
    ignore: ['node_modules/**', '.next/**'],
  });
  
  let totalViolations = 0;
  const violatedFiles = [];
  
  for (const file of files) {
    const violations = scanFile(file);
    
    if (violations.length > 0) {
      violatedFiles.push(file);
      totalViolations += violations.length;
      console.log(`❌ ${file}`);
      violations.slice(0, 5).forEach(v => console.log(`   - ${v}`));
      if (violations.length > 5) {
        console.log(`   ... and ${violations.length - 5} more`);
      }
      console.log('');
    }
  }
  
  console.log(`\nScanned: ${files.length} files`);
  console.log(`Violations: ${violatedFiles.length} files, ${totalViolations} issues\n`);
  
  if (totalViolations > 0) {
    console.log('⚠️  COLOR VIOLATIONS DETECTED');
    console.log('GHXSTSHIP uses ONLY black, white, and greyscale.\n');
    process.exit(1);
  } else {
    console.log('✅ NO COLOR VIOLATIONS\n');
    process.exit(0);
  }
}

main().catch(console.error);
