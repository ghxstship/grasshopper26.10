#!/usr/bin/env ts-node
/**
 * GHXSTSHIP Design System Enforcement Script
 * Contemporary Minimal Pop Art Aesthetic
 * 
 * This script enforces zero-tolerance design system compliance by:
 * 1. Detecting violations of monochromatic color palette
 * 2. Identifying improper font usage
 * 3. Finding raw className usage instead of atomic components
 * 4. Reporting soft shadows instead of hard geometric shadows
 * 5. Detecting gradients used outside of text/brand contexts
 * 
 * Run with: npm run enforce-design-system
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface Violation {
  file: string;
  line: number;
  column: number;
  type: 'color' | 'font' | 'component' | 'shadow' | 'gradient' | 'typography';
  severity: 'error' | 'warning';
  message: string;
  code: string;
}

const violations: Violation[] = [];

// ============================================
// GHXSTSHIP DESIGN SYSTEM RULES
// ============================================

const FORBIDDEN_COLORS = [
  // Any color that's not black, white, or greyscale
  /(?:bg|text|border)-(?:red|green|blue|yellow|purple|pink|indigo|cyan|teal|orange|lime|emerald|sky|violet|fuchsia|rose)-/,
  // RGB/RGBA colors (except in gradients)
  /rgb\([^)]*\)/,
  // Hex colors (except #000000, #FFFFFF, and grey tones)
  /#(?![0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?$)[0-9A-Fa-f]{3,8}/,
];

const ALLOWED_COLORS = [
  '#000000', '#FFFFFF', // Pure black and white
  '#F5F5F5', '#E5E5E5', '#D4D4D4', '#A3A3A3', '#737373', // Greyscale
  '#525252', '#404040', '#262626', '#171717', '#0A0A0A', '#FAFAFA',
];

const FORBIDDEN_FONTS = [
  /font-(?:serif|sans|mono)(?!\s*:)/,  // Generic font families
  /font-family:\s*['"](?!Anton|Bebas Neue|Share Tech|Share Tech Mono)/,
];

const FORBIDDEN_SHADOWS = [
  /box-shadow:\s*[^;]*rgba?\(/,  // Soft shadows with transparency
  /shadow-(?:sm|md|lg|xl|2xl)/,  // Tailwind soft shadows
];

const RAW_TYPOGRAPHY_PATTERNS = [
  /className=["'][^"']*(?:text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl))[^"']*["']/,
  /className=["'][^"']*(?:font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black))[^"']*["']/,
];

const COMPONENT_VIOLATIONS = [
  { pattern: /className=["'][^"']*(?:bg-gray-900\/50|border-gray-800)[^"']*["']/, message: 'Use Card component with variant prop instead of custom styling' },
  { pattern: /<h1[^>]*className/, message: 'Use HeroTitle or SectionHeader component instead of raw <h1>' },
  { pattern: /<h2[^>]*className/, message: 'Use SectionHeader component instead of raw <h2>' },
  { pattern: /<h3[^>]*className/, message: 'Use SubsectionHeader component instead of raw <h3>' },
  { pattern: /<h4[^>]*className/, message: 'Use CardTitle component instead of raw <h4>' },
  { pattern: /<p[^>]*className=["'][^"']*(?:text-sm|text-base|text-lg)[^"']*["']/, message: 'Use BodyText or BodyTextSmall component instead of raw <p>' },
];

// ============================================
// FILE SCANNING
// ============================================

async function scanFiles() {
  const files = await glob('src/**/*.{ts,tsx,js,jsx}', {
    ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
  });

  console.log(`🔍 Scanning ${files.length} files for GHXSTSHIP design system violations...\n`);

  for (const file of files) {
    await scanFile(file);
  }
}

async function scanFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // Check for forbidden colors
    FORBIDDEN_COLORS.forEach(pattern => {
      const match = line.match(pattern);
      if (match && !isAllowedColorContext(line, match[0])) {
        violations.push({
          file: filePath,
          line: lineNumber,
          column: match.index || 0,
          type: 'color',
          severity: 'error',
          message: `Forbidden color usage: "${match[0]}". GHXSTSHIP uses ONLY black, white, and greyscale.`,
          code: line.trim(),
        });
      }
    });

    // Check for forbidden fonts
    FORBIDDEN_FONTS.forEach(pattern => {
      const match = line.match(pattern);
      if (match) {
        violations.push({
          file: filePath,
          line: lineNumber,
          column: match.index || 0,
          type: 'font',
          severity: 'error',
          message: `Forbidden font usage: "${match[0]}". Use Anton, Bebas Neue, Share Tech, or Share Tech Mono only.`,
          code: line.trim(),
        });
      }
    });

    // Check for forbidden shadows
    FORBIDDEN_SHADOWS.forEach(pattern => {
      const match = line.match(pattern);
      if (match) {
        violations.push({
          file: filePath,
          line: lineNumber,
          column: match.index || 0,
          type: 'shadow',
          severity: 'error',
          message: `Forbidden soft shadow: "${match[0]}". Use hard geometric shadows only (shadow-hard, shadow-hard-inverse).`,
          code: line.trim(),
        });
      }
    });

    // Check for raw typography
    RAW_TYPOGRAPHY_PATTERNS.forEach(pattern => {
      const match = line.match(pattern);
      if (match && !isInTypographyComponent(filePath)) {
        violations.push({
          file: filePath,
          line: lineNumber,
          column: match.index || 0,
          type: 'typography',
          severity: 'error',
          message: `Raw typography classes detected. Use Typography components (HeroTitle, SectionHeader, BodyText, etc.) instead.`,
          code: line.trim(),
        });
      }
    });

    // Check for component violations
    COMPONENT_VIOLATIONS.forEach(({ pattern, message }) => {
      const match = line.match(pattern);
      if (match) {
        violations.push({
          file: filePath,
          line: lineNumber,
          column: match.index || 0,
          type: 'component',
          severity: 'error',
          message,
          code: line.trim(),
        });
      }
    });

    // Check for gradients outside of text context
    if (line.includes('gradient') && !line.includes('text-gradient') && !line.includes('background-clip')) {
      violations.push({
        file: filePath,
        line: lineNumber,
        column: 0,
        type: 'gradient',
        severity: 'warning',
        message: 'Gradients should only be used for text/brand elements, not backgrounds or UI.',
        code: line.trim(),
      });
    }
  });
}

function isAllowedColorContext(line: string, colorMatch: string): boolean {
  // Allow platform gradient colors in specific contexts
  if (line.includes('gvteway-text-gradient') || 
      line.includes('atlvs-text-gradient') || 
      line.includes('compvss-text-gradient')) {
    return true;
  }

  // Allow greyscale colors
  if (ALLOWED_COLORS.some(allowed => line.includes(allowed))) {
    return true;
  }

  // Allow grey/gray Tailwind classes
  if (/(?:bg|text|border)-gr[ae]y-[1-9]00/.test(line)) {
    return true;
  }

  return false;
}

function isInTypographyComponent(filePath: string): boolean {
  return filePath.includes('/components/atoms/Typography');
}

// ============================================
// REPORTING
// ============================================

function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('GHXSTSHIP DESIGN SYSTEM ENFORCEMENT REPORT');
  console.log('Contemporary Minimal Pop Art Aesthetic - Zero Tolerance');
  console.log('='.repeat(80) + '\n');

  if (violations.length === 0) {
    console.log('✅ No violations found! Design system is fully compliant.\n');
    return 0;
  }

  const errorCount = violations.filter(v => v.severity === 'error').length;
  const warningCount = violations.filter(v => v.severity === 'warning').length;

  console.log(`❌ Found ${errorCount} errors and ${warningCount} warnings\n`);

  // Group by type
  const byType = violations.reduce((acc, v) => {
    if (!acc[v.type]) acc[v.type] = [];
    acc[v.type].push(v);
    return acc;
  }, {} as Record<string, Violation[]>);

  Object.entries(byType).forEach(([type, viols]) => {
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`${type.toUpperCase()} VIOLATIONS (${viols.length})`);
    console.log('─'.repeat(80));

    viols.forEach((v, i) => {
      const icon = v.severity === 'error' ? '❌' : '⚠️';
      console.log(`\n${icon} ${i + 1}. ${v.message}`);
      console.log(`   File: ${v.file}:${v.line}:${v.column}`);
      console.log(`   Code: ${v.code}`);
    });
  });

  console.log('\n' + '='.repeat(80));
  console.log('REMEDIATION GUIDE');
  console.log('='.repeat(80) + '\n');

  console.log('1. COLOR VIOLATIONS:');
  console.log('   - Replace all colors with black (#000000), white (#FFFFFF), or greyscale');
  console.log('   - Use grey-100 through grey-900 for greyscale tones');
  console.log('   - Platform colors (gvteway, atlvs, compvss) are ONLY for text gradients\n');

  console.log('2. TYPOGRAPHY VIOLATIONS:');
  console.log('   - Replace <h1> with <HeroTitle> or <SectionHeader>');
  console.log('   - Replace <h2> with <SectionHeader>');
  console.log('   - Replace <h3> with <SubsectionHeader>');
  console.log('   - Replace <p> with <BodyText> or <BodyTextSmall>');
  console.log('   - Import from @/components/atoms/Typography\n');

  console.log('3. COMPONENT VIOLATIONS:');
  console.log('   - Use <Card variant="atlvs|compvss|gvteway"> instead of custom styling');
  console.log('   - Use <Button variant="atlvs|compvss|gvteway"> for all buttons');
  console.log('   - Check /docs/architecture/ATOMIC_DESIGN_SYSTEM.md for all components\n');

  console.log('4. SHADOW VIOLATIONS:');
  console.log('   - Replace soft shadows with shadow-hard or shadow-hard-inverse');
  console.log('   - Use hard geometric shadows only (8px 8px 0 #000000)\n');

  console.log('='.repeat(80) + '\n');

  return errorCount > 0 ? 1 : 0;
}

// ============================================
// MAIN
// ============================================

async function main() {
  await scanFiles();
  const exitCode = generateReport();
  process.exit(exitCode);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
