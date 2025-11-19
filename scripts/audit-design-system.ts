#!/usr/bin/env ts-node
/**
 * Comprehensive Atomic Design System Audit Script
 * Scans codebase for violations and generates detailed report
 */

import * as fs from 'fs';
import * as path from 'path';

interface Violation {
  file: string;
  line: number;
  column: number;
  type: string;
  violation: string;
  suggestion: string;
  severity: 'error' | 'warning';
}

const violations: Violation[] = [];

// Violation patterns to detect
const VIOLATION_PATTERNS = {
  // Hardcoded hex colors
  hexColor: {
    pattern: /#[0-9A-Fa-f]{3,8}(?![0-9A-Fa-f])/g,
    type: 'hardcoded-color',
    suggestion: 'Use design tokens from @/design-system/tokens or Tailwind classes with semantic names',
    severity: 'error' as const,
  },
  
  // Hardcoded RGB/RGBA colors
  rgbColor: {
    pattern: /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/g,
    type: 'hardcoded-color',
    suggestion: 'Use design tokens or Tailwind classes',
    severity: 'error' as const,
  },
  
  // Hardcoded pixel spacing in className
  pxSpacing: {
    pattern: /className="[^"]*\b(p|m|gap|space|w|h|top|left|right|bottom|inset)-\[\d+px\]/g,
    type: 'hardcoded-spacing',
    suggestion: 'Use spacing tokens (space-1 through space-96) or rem units',
    severity: 'error' as const,
  },
  
  // Raw font classes (should use Typography components)
  rawFontClasses: {
    pattern: /className="[^"]*\b(font-anton|font-bebas|font-oswald|font-share)/g,
    type: 'raw-typography',
    suggestion: 'Use Typography components: HeroTitle, SectionHeader, SubsectionHeader, CardTitle, BodyText, etc.',
    severity: 'error' as const,
  },
  
  // Raw text size classes (should use Typography components)
  rawTextSizes: {
    pattern: /className="[^"]*\b(text-h[1-6]|text-hero|text-body|text-meta|text-caption)/g,
    type: 'raw-typography',
    suggestion: 'Use Typography components instead of raw text size classes',
    severity: 'error' as const,
  },
  
  // Custom Card background colors (should use variants)
  customCardBg: {
    pattern: /className="[^"]*\bbg-(gray|grey|blue|green|red|purple|cyan|teal|indigo|yellow|orange)-\d+\/\d+/g,
    type: 'custom-card-styling',
    suggestion: 'Use Card component with variant prop: variant="atlvs" | "compvss" | "gvteway" | "default"',
    severity: 'error' as const,
  },
  
  // Custom border colors on Cards
  customCardBorder: {
    pattern: /className="[^"]*\bborder-(gray|grey|blue|green|red|purple|cyan|teal|indigo|yellow|orange)-\d+/g,
    type: 'custom-card-styling',
    suggestion: 'Use Card component with proper variant instead of custom border colors',
    severity: 'error' as const,
  },
  
  // Inline styles (forbidden)
  inlineStyles: {
    pattern: /style=\{\{[^}]+\}\}/g,
    type: 'inline-styles',
    suggestion: 'Use design tokens and Tailwind classes instead of inline styles',
    severity: 'error' as const,
  },
  
  // Directional properties (not RTL-friendly)
  directionalProps: {
    pattern: /className="[^"]*\b(ml-|mr-|pl-|pr-|left-|right-)/g,
    type: 'rtl-violation',
    suggestion: 'Use logical properties: ms- (margin-start), me- (margin-end), ps-, pe-, start-, end-',
    severity: 'warning' as const,
  },
};

// Files/directories to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.next',
  'dist',
  'build',
  '.git',
  'design-system/tokens', // Tokens can have hardcoded values
  'tailwind.config', // Config can have hardcoded values
];

function shouldExclude(filePath: string): boolean {
  return EXCLUDE_PATTERNS.some(pattern => filePath.includes(pattern));
}

function scanFile(filePath: string): void {
  if (shouldExclude(filePath)) return;
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, lineIndex) => {
      Object.entries(VIOLATION_PATTERNS).forEach(([key, config]) => {
        const matches = line.matchAll(config.pattern);
        
        for (const match of matches) {
          violations.push({
            file: filePath,
            line: lineIndex + 1,
            column: match.index || 0,
            type: config.type,
            violation: match[0],
            suggestion: config.suggestion,
            severity: config.severity,
          });
        }
      });
    });
  } catch (error) {
    console.error(`Error scanning ${filePath}:`, error);
  }
}

function scanDirectory(dirPath: string): void {
  if (shouldExclude(dirPath)) return;
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    entries.forEach(entry => {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile() && /\.(tsx?|jsx?|css|scss)$/.test(entry.name)) {
        scanFile(fullPath);
      }
    });
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
}

function generateReport(): void {
  console.log('\n' + '='.repeat(80));
  console.log('ATOMIC DESIGN SYSTEM AUDIT REPORT');
  console.log('='.repeat(80) + '\n');
  
  // Group violations by type
  const violationsByType = violations.reduce((acc, v) => {
    if (!acc[v.type]) acc[v.type] = [];
    acc[v.type].push(v);
    return acc;
  }, {} as Record<string, Violation[]>);
  
  // Summary
  console.log('📊 SUMMARY');
  console.log('-'.repeat(80));
  console.log(`Total Violations: ${violations.length}`);
  console.log(`Errors: ${violations.filter(v => v.severity === 'error').length}`);
  console.log(`Warnings: ${violations.filter(v => v.severity === 'warning').length}`);
  console.log('');
  
  // Violations by type
  console.log('📋 VIOLATIONS BY TYPE');
  console.log('-'.repeat(80));
  Object.entries(violationsByType).forEach(([type, viols]) => {
    console.log(`\n${type.toUpperCase()}: ${viols.length} violations`);
    
    // Group by file
    const byFile = viols.reduce((acc, v) => {
      if (!acc[v.file]) acc[v.file] = [];
      acc[v.file].push(v);
      return acc;
    }, {} as Record<string, Violation[]>);
    
    Object.entries(byFile).forEach(([file, fileViols]) => {
      console.log(`  ${file}: ${fileViols.length} violations`);
    });
  });
  
  // Detailed violations (first 50)
  console.log('\n\n🔍 DETAILED VIOLATIONS (First 50)');
  console.log('-'.repeat(80));
  violations.slice(0, 50).forEach((v, i) => {
    console.log(`\n${i + 1}. [${v.severity.toUpperCase()}] ${v.type}`);
    console.log(`   File: ${v.file}:${v.line}:${v.column}`);
    console.log(`   Violation: ${v.violation}`);
    console.log(`   Suggestion: ${v.suggestion}`);
  });
  
  if (violations.length > 50) {
    console.log(`\n... and ${violations.length - 50} more violations`);
  }
  
  // Save full report to JSON
  const reportPath = path.join(process.cwd(), 'design-system-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: violations.length,
      errors: violations.filter(v => v.severity === 'error').length,
      warnings: violations.filter(v => v.severity === 'warning').length,
    },
    violationsByType,
    allViolations: violations,
  }, null, 2));
  
  console.log(`\n\n📄 Full report saved to: ${reportPath}`);
  console.log('\n' + '='.repeat(80) + '\n');
  
  // Exit with error code if violations found
  if (violations.length > 0) {
    process.exit(1);
  }
}

// Main execution
const srcPath = path.join(process.cwd(), 'src');
console.log(`\n🔍 Scanning ${srcPath} for design system violations...\n`);

scanDirectory(srcPath);
generateReport();
