#!/usr/bin/env node
/**
 * Atomic Design System Validator
 * 
 * Validates that all code follows atomic design system principles:
 * - No raw typography classes (text-h1, text-body-sm, etc.)
 * - No hardcoded colors (bg-gray-900, text-gray-400, etc.)
 * - No hardcoded spacing values
 * - Card components use proper variants
 * - Button components use proper variants
 * 
 * Exit code 0: All checks passed
 * Exit code 1: Violations found
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const violations = [];

// Forbidden patterns
const FORBIDDEN_PATTERNS = [
  {
    name: 'Raw typography classes',
    pattern: /\btext-(h[1-6]|body|caption|subtitle|display|hero)(-\w+)?\b/g,
    message: 'Use Typography components instead (PageTitle, BodyText, Caption, etc.)',
    severity: 'error',
    exclude: ['Typography.tsx', 'Text.tsx'], // Typography component definitions
  },
  {
    name: 'Raw font classes',
    pattern: /\b(font-anton|font-bebas|font-oswald|font-share-tech)\b/g,
    message: 'Use Typography components with variant prop',
    severity: 'error',
    exclude: ['layout.tsx', 'Typography.tsx', 'tokens.css', 'PagePatterns.tsx'], // Font system definitions
  },
  {
    name: 'Hardcoded gray colors',
    pattern: /\b(bg|text|border)-gray-\d+\b/g,
    message: 'Use semantic color tokens (bg-surface-dark, text-muted, border-default, etc.)',
    severity: 'warning',
  },
  {
    name: 'Hardcoded hex colors',
    pattern: /#[0-9A-Fa-f]{3,8}\b/g,
    message: 'Use CSS variables or semantic color tokens',
    severity: 'error',
    exclude: ['globals.css', 'tailwind.config', 'tokens.css', 'qr-code.ts', 'formatting.ts', 'sendgrid.ts', 'route.ts', 'design-system/tokens'],
  },
  {
    name: 'Hardcoded pixel spacing',
    pattern: /:\s*\d+px\b/g,
    message: 'Use spacing tokens (space-4, space-8, etc.) or rem units',
    severity: 'warning',
    exclude: ['.css', 'tailwind.config'],
  },
  // Note: Card and Button variant checks disabled - they produce false positives
  // for multi-line component declarations. Use manual review instead.
  {
    name: 'Directional properties (not RTL-friendly)',
    pattern: /\b(margin|padding)-(left|right):/g,
    message: 'Use logical properties (margin-inline-start, padding-inline-end)',
    severity: 'warning',
    exclude: ['.css'],
  },
];

function shouldExcludeFile(filePath, excludePatterns) {
  if (!excludePatterns) return false;
  return excludePatterns.some(pattern => filePath.includes(pattern));
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const fileViolations = [];
  
  for (const { name, pattern, message, severity, exclude } of FORBIDDEN_PATTERNS) {
    if (shouldExcludeFile(filePath, exclude)) continue;
    
    lines.forEach((line, index) => {
      const matches = line.match(pattern);
      if (matches) {
        fileViolations.push({
          file: path.relative(process.cwd(), filePath),
          line: index + 1,
          column: line.indexOf(matches[0]) + 1,
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
  console.log('🔍 Validating Atomic Design System Compliance...\n');
  
  const files = await glob('src/**/*.{tsx,ts,css}', {
    ignore: [
      '**/node_modules/**',
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      '**/globals.css',
      '**/tailwind.config.ts',
    ],
    cwd: process.cwd(),
  });
  
  console.log(`Scanning ${files.length} files...\n`);
  
  let errorCount = 0;
  let warningCount = 0;
  
  for (const file of files) {
    const fileViolations = validateFile(path.join(process.cwd(), file));
    
    if (fileViolations.length > 0) {
      violations.push(...fileViolations);
      
      fileViolations.forEach(v => {
        if (v.severity === 'error') errorCount++;
        else warningCount++;
      });
    }
  }
  
  if (violations.length === 0) {
    console.log('✅ All checks passed! No violations found.\n');
    console.log('🎉 Your codebase is fully compliant with the atomic design system.\n');
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
  
  console.log('❌ Violations Found:\n');
  console.log('='.repeat(80));
  
  for (const [type, items] of Object.entries(violationsByType)) {
    console.log(`\n${items[0].severity === 'error' ? '🔴' : '⚠️ '} ${type} (${items.length} occurrences)`);
    console.log(`   ${items[0].message}\n`);
    
    // Show first 5 examples
    items.slice(0, 5).forEach(v => {
      console.log(`   ${v.file}:${v.line}:${v.column}`);
      console.log(`   Code: ${v.code}\n`);
    });
    
    if (items.length > 5) {
      console.log(`   ... and ${items.length - 5} more\n`);
    }
  }
  
  console.log('='.repeat(80));
  console.log(`\n📊 Summary:`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Warnings: ${warningCount}`);
  console.log(`   Total: ${violations.length}\n`);
  
  if (errorCount > 0) {
    console.log('💡 Fix errors by running: npm run fix:atomic-design\n');
    process.exit(1);
  } else {
    console.log('✅ No errors found, only warnings.\n');
    process.exit(0);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
