#!/usr/bin/env ts-node
/**
 * Design Token Validator
 * Scans codebase for hardcoded values and design system violations
 * 
 * ZERO TOLERANCE ENFORCEMENT:
 * - No hardcoded colors (hex, rgb, rgba)
 * - No hardcoded spacing (px values)
 * - No hardcoded font sizes
 * - No directional properties (use logical properties for RTL)
 * - No raw font classes (must use Typography components)
 * 
 * Run in CI/CD pipeline to prevent violations
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface Violation {
  file: string;
  line: number;
  column: number;
  type: ViolationType;
  value: string;
  suggestion: string;
  severity: 'error' | 'warning';
}

type ViolationType =
  | 'hardcoded-hex-color'
  | 'hardcoded-rgb-color'
  | 'hardcoded-rgba-color'
  | 'hardcoded-pixel-spacing'
  | 'hardcoded-font-size'
  | 'directional-property'
  | 'raw-font-class'
  | 'raw-text-size-class'
  | 'hardcoded-background-override'
  | 'magic-number';

interface ViolationPattern {
  pattern: RegExp;
  type: ViolationType;
  suggestion: string;
  severity: 'error' | 'warning';
  exceptions?: RegExp[];
}

const VIOLATION_PATTERNS: ViolationPattern[] = [
  // Hardcoded Colors
  {
    pattern: /#[0-9A-Fa-f]{3,8}(?![0-9A-Fa-f])/g,
    type: 'hardcoded-hex-color',
    suggestion: 'Use var(--color-*) token or semantic color from design system',
    severity: 'error',
    exceptions: [/\/\*.*\*\//], // Allow in comments
  },
  {
    pattern: /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g,
    type: 'hardcoded-rgb-color',
    suggestion: 'Use var(--color-*) token or semantic color from design system',
    severity: 'error',
  },
  {
    pattern: /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/g,
    type: 'hardcoded-rgba-color',
    suggestion: 'Use var(--color-*) token with opacity or semantic color',
    severity: 'error',
  },
  
  // Hardcoded Spacing (px values)
  {
    pattern: /(?:padding|margin|gap|top|right|bottom|left|width|height|min-width|max-width|min-height|max-height):\s*\d+px/g,
    type: 'hardcoded-pixel-spacing',
    suggestion: 'Use var(--space-*) token or rem units',
    severity: 'error',
    exceptions: [
      /border.*:\s*\d+px/, // Allow border widths
      /outline.*:\s*\d+px/, // Allow outline widths
    ],
  },
  
  // Hardcoded Font Sizes
  {
    pattern: /font-size:\s*\d+(?:px|pt|em|rem)/g,
    type: 'hardcoded-font-size',
    suggestion: 'Use var(--font-size-*) token or Typography component',
    severity: 'error',
  },
  
  // Directional Properties (not RTL-friendly)
  {
    pattern: /(?:margin|padding)-(left|right):/g,
    type: 'directional-property',
    suggestion: 'Use margin-inline-start or margin-inline-end for RTL support',
    severity: 'warning',
  },
  {
    pattern: /(?:border)-(left|right):/g,
    type: 'directional-property',
    suggestion: 'Use border-inline-start or border-inline-end for RTL support',
    severity: 'warning',
  },
  {
    pattern: /text-align:\s*(left|right)/g,
    type: 'directional-property',
    suggestion: 'Use text-align: start or text-align: end for RTL support',
    severity: 'warning',
  },
  
  // Raw Font Classes (should use Typography components)
  {
    pattern: /className=["'][^"']*\b(?:font-anton|font-bebas|font-share|font-oswald)\b/g,
    type: 'raw-font-class',
    suggestion: 'Use Typography components (HeroTitle, SectionHeader, BodyText, etc.)',
    severity: 'error',
  },
  
  // Raw Text Size Classes (should use Typography components)
  {
    pattern: /className=["'][^"']*\b(?:text-h1|text-h2|text-h3|text-h4|text-h5|text-h6|text-hero|text-display)\b/g,
    type: 'raw-text-size-class',
    suggestion: 'Use Typography components instead of raw text size classes',
    severity: 'error',
  },
  
  // Hardcoded Background Overrides on Cards
  {
    pattern: /className=["'][^"']*\b(?:bg-gray-\d+|bg-black|bg-white)\/\d+\b/g,
    type: 'hardcoded-background-override',
    suggestion: 'Use Card variant prop instead of background overrides',
    severity: 'error',
  },
];

class TokenValidator {
  private violations: Violation[] = [];
  private filesScanned = 0;
  private filesWithViolations = 0;

  async validate(directory: string): Promise<void> {
    console.log('🔍 Scanning for design token violations...\n');
    
    const files = await glob('**/*.{ts,tsx,js,jsx,css,scss}', {
      cwd: directory,
      ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/.next/**',
        '**/coverage/**',
        '**/scripts/**', // Ignore scripts directory
        '**/design-system/tokens/**', // Ignore token definitions
      ],
      absolute: true,
    });

    for (const file of files) {
      await this.validateFile(file);
    }

    this.printResults();
  }

  private async validateFile(filePath: string): Promise<void> {
    this.filesScanned++;
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    let hasViolations = false;

    lines.forEach((line, index) => {
      for (const { pattern, type, suggestion, severity, exceptions } of VIOLATION_PATTERNS) {
        // Skip if line matches exception patterns
        if (exceptions?.some(ex => ex.test(line))) {
          continue;
        }

        const matches = line.matchAll(pattern);
        for (const match of matches) {
          hasViolations = true;
          this.violations.push({
            file: filePath,
            line: index + 1,
            column: match.index || 0,
            type,
            value: match[0],
            suggestion,
            severity,
          });
        }
      }
    });

    if (hasViolations) {
      this.filesWithViolations++;
    }
  }

  private printResults(): void {
    console.log('\n' + '='.repeat(80));
    console.log('DESIGN TOKEN VALIDATION RESULTS');
    console.log('='.repeat(80) + '\n');

    if (this.violations.length === 0) {
      console.log('✅ No violations found! All files comply with design token requirements.\n');
      console.log(`Files scanned: ${this.filesScanned}`);
      return;
    }

    // Group violations by type
    const violationsByType = new Map<ViolationType, Violation[]>();
    for (const violation of this.violations) {
      const existing = violationsByType.get(violation.type) || [];
      existing.push(violation);
      violationsByType.set(violation.type, existing);
    }

    // Print summary
    console.log('❌ VIOLATIONS FOUND:\n');
    console.log(`Total violations: ${this.violations.length}`);
    console.log(`Files with violations: ${this.filesWithViolations} / ${this.filesScanned}`);
    console.log('');

    // Print violations by type
    for (const [type, violations] of violationsByType.entries()) {
      const severity = violations[0].severity;
      const icon = severity === 'error' ? '🚫' : '⚠️';
      
      console.log(`${icon} ${type.toUpperCase().replace(/-/g, ' ')}: ${violations.length} violations`);
      console.log(`   Suggestion: ${violations[0].suggestion}\n`);

      // Show first 5 examples
      const examples = violations.slice(0, 5);
      for (const violation of examples) {
        const relativePath = path.relative(process.cwd(), violation.file);
        console.log(`   ${relativePath}:${violation.line}:${violation.column}`);
        console.log(`   Found: ${violation.value}\n`);
      }

      if (violations.length > 5) {
        console.log(`   ... and ${violations.length - 5} more\n`);
      }
    }

    console.log('='.repeat(80));
    console.log('\n💡 FIX INSTRUCTIONS:\n');
    console.log('1. Replace hardcoded values with design tokens from:');
    console.log('   - src/design-system/tokens/tokens.css');
    console.log('   - src/design-system/tokens/index.ts\n');
    console.log('2. Use Typography components instead of raw font classes:');
    console.log('   - HeroTitle, SectionHeader, SubsectionHeader');
    console.log('   - CardTitle, BodyText, BodyTextSmall, Caption\n');
    console.log('3. Use Card variant prop instead of background overrides:');
    console.log('   - variant="atlvs" | "compvss" | "gvteway" | "default"\n');
    console.log('4. Use logical properties for RTL support:');
    console.log('   - margin-inline-start instead of margin-left');
    console.log('   - padding-inline-end instead of padding-right\n');
    console.log('='.repeat(80) + '\n');

    // Exit with error code if violations found
    process.exit(1);
  }
}

// Run validator
const validator = new TokenValidator();
const srcPath = path.join(process.cwd(), 'src');

validator.validate(srcPath).catch((error) => {
  console.error('❌ Validation failed:', error);
  process.exit(1);
});
