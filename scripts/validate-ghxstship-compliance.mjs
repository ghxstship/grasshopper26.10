#!/usr/bin/env node
/**
 * GHXSTSHIP Design System Compliance Validator
 * 
 * Zero tolerance for violations:
 * - NO colors (only black/white/grey)
 * - NO gradients
 * - NO rounded corners (except circles)
 * - NO soft shadows
 * - NO color variants
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const violations = [];

const FORBIDDEN_PATTERNS = [
  {
    name: 'Color classes (FORBIDDEN)',
    pattern: /\b(bg|text|border)-(red|blue|green|yellow|purple|pink|indigo|cyan|teal|orange)-\d+\b/g,
    message: 'GHXSTSHIP uses ONLY black, white, and grey. NO COLORS.',
    severity: 'error',
  },
  {
    name: 'Platform color variants (FORBIDDEN)',
    pattern: /\b(atlvs|compvss|gvteway)-(red|green|blue|yellow|orange|purple|cyan|teal|indigo)-\d+\b/g,
    message: 'Platform colors removed. Use black/white/grey only.',
    severity: 'error',
  },
  {
    name: 'Gradient classes (FORBIDDEN)',
    pattern: /\bbg-gradient-(to|from|via)-\w+\b/g,
    message: 'NO gradients in GHXSTSHIP. Use solid black or white.',
    severity: 'error',
  },
  {
    name: 'Rounded corners (except full)',
    pattern: /\brounded-(sm|md|lg|xl|2xl|3xl)\b/g,
    message: 'GHXSTSHIP uses hard edges. Use rounded-none (or rounded-full for circles only).',
    severity: 'error',
  },
  {
    name: 'Soft shadows (FORBIDDEN)',
    pattern: /\bshadow-(sm|md|lg|xl|2xl)\b/g,
    message: 'Use hard geometric shadows: shadow-hard, shadow-hard-sm, shadow-hard-lg.',
    severity: 'error',
  },
  {
    name: 'Color variant props (FORBIDDEN)',
    pattern: /variant=["'](atlvs|compvss|gvteway|primary|secondary|success|warning|error|info)["']/g,
    message: 'Color variants removed. Components should not have color-based variants.',
    severity: 'error',
  },
];

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const fileViolations = [];
  
  for (const { name, pattern, message, severity } of FORBIDDEN_PATTERNS) {
    lines.forEach((line, index) => {
      const matches = line.match(pattern);
      if (matches) {
        fileViolations.push({
          file: path.relative(process.cwd(), filePath),
          line: index + 1,
          violation: name,
          code: matches[0],
          message,
          severity,
        });
      }
    });
  }
  
  return fileViolations;
}

async function main() {
  console.log('🎨 GHXSTSHIP Design System Compliance Validator\n');
  console.log('Zero Tolerance Policy: Black. White. Grey. Nothing else.\n');
  
  const files = await glob('src/**/*.{tsx,ts,jsx,js}', {
    ignore: [
      '**/node_modules/**',
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      '**/tailwind.config.ts',
    ],
    cwd: process.cwd(),
  });
  
  console.log(`Scanning ${files.length} files...\n`);
  
  let errorCount = 0;
  
  for (const file of files) {
    const fileViolations = validateFile(path.join(process.cwd(), file));
    
    if (fileViolations.length > 0) {
      violations.push(...fileViolations);
      errorCount += fileViolations.length;
    }
  }
  
  if (violations.length === 0) {
    console.log('✅ PERFECT COMPLIANCE!\n');
    console.log('🎨 GHXSTSHIP Design System: 100% Monochromatic\n');
    console.log('   ✓ No colors detected');
    console.log('   ✓ No gradients detected');
    console.log('   ✓ No soft shadows detected');
    console.log('   ✓ No rounded corners (except circles)');
    console.log('   ✓ No color variants detected\n');
    process.exit(0);
  }
  
  // Group violations by type
  const violationsByType = {};
  violations.forEach(v => {
    if (!violationsByType[v.violation]) {
      violationsByType[v.violation] = [];
    }
    violationsByType[v.violation].push(v);
  });
  
  console.log('❌ VIOLATIONS DETECTED:\n');
  console.log('='.repeat(80));
  
  for (const [type, items] of Object.entries(violationsByType)) {
    console.log(`\n🔴 ${type} (${items.length} occurrences)`);
    console.log(`   ${items[0].message}\n`);
    
    // Show first 5 examples
    items.slice(0, 5).forEach(v => {
      console.log(`   ${v.file}:${v.line}`);
      console.log(`   Code: ${v.code}\n`);
    });
    
    if (items.length > 5) {
      console.log(`   ... and ${items.length - 5} more\n`);
    }
  }
  
  console.log('='.repeat(80));
  console.log(`\n📊 Summary:`);
  console.log(`   Total Violations: ${errorCount}`);
  console.log(`\n💡 Fix: npm run ghxstship:enforce\n`);
  
  process.exit(1);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
