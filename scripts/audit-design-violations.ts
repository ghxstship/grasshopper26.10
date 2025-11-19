#!/usr/bin/env tsx
/**
 * Design System Audit Script
 * Scans codebase for hardcoded values and atomic design violations
 * 
 * ZERO TOLERANCE for:
 * - Hardcoded hex colors
 * - Hardcoded spacing (px values)
 * - Raw font classes (font-bebas, font-anton, font-oswald)
 * - Raw text size classes (text-xs, text-sm, etc.)
 * - Directional properties (margin-left, padding-right)
 * - Hardcoded background/border colors
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
}

interface ViolationStats {
  totalFiles: number;
  totalViolations: number;
  byType: Record<string, number>;
  byFile: Record<string, number>;
}

const VIOLATION_PATTERNS = [
  {
    name: 'hardcoded-hex-color',
    pattern: /#[0-9A-Fa-f]{3,8}/g,
    suggestion: 'Use CSS variable like var(--color-*) or semantic color token',
  },
  {
    name: 'hardcoded-rgb-color',
    pattern: /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g,
    suggestion: 'Use CSS variable like var(--color-*) or semantic color token',
  },
  {
    name: 'hardcoded-rgba-color',
    pattern: /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/g,
    suggestion: 'Use CSS variable like var(--color-*) or semantic color token',
  },
  {
    name: 'tailwind-bg-color',
    pattern: /className="[^"]*bg-(gray|blue|red|green|yellow|purple|pink|indigo|cyan|teal|orange)-\d{3}/g,
    suggestion: 'Use Card component with variant prop or semantic color classes',
  },
  {
    name: 'raw-font-family',
    pattern: /className="[^"]*font-(bebas|anton|oswald)/g,
    suggestion: 'Use Typography components (HeroTitle, SectionHeader, etc.) from @/components/atoms/Typography',
  },
  {
    name: 'raw-text-size',
    pattern: /className="[^"]*text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)(?!\w)/g,
    suggestion: 'Use Typography components (BodyText, BodyTextSmall, etc.) from @/components/atoms/Typography',
  },
  {
    name: 'hardcoded-spacing-px',
    pattern: /:\s*\d+px/g,
    suggestion: 'Use spacing tokens via Tailwind classes (p-4, m-6) or CSS variables',
  },
  {
    name: 'directional-margin',
    pattern: /(margin|padding)-(left|right):/g,
    suggestion: 'Use logical properties: margin-inline-start, margin-inline-end for RTL support',
  },
  {
    name: 'hardcoded-font-size',
    pattern: /font-size:\s*\d+/g,
    suggestion: 'Use typography tokens via text-* classes or CSS variables',
  },
];

const EXCLUDED_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  'coverage',
  '.swc',
];

const INCLUDED_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js', '.css', '.scss'];

function shouldScanFile(filePath: string): boolean {
  const ext = path.extname(filePath);
  return INCLUDED_EXTENSIONS.includes(ext);
}

function shouldScanDirectory(dirName: string): boolean {
  return !EXCLUDED_DIRS.includes(dirName) && !dirName.startsWith('.');
}

function scanFile(filePath: string): Violation[] {
  const violations: Violation[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, lineIndex) => {
    VIOLATION_PATTERNS.forEach(({ name, pattern, suggestion }) => {
      const regex = new RegExp(pattern);
      let match;
      
      while ((match = regex.exec(line)) !== null) {
        violations.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index + 1,
          type: name,
          violation: match[0],
          suggestion,
        });
      }
    });
  });

  return violations;
}

function scanDirectory(dirPath: string): Violation[] {
  let allViolations: Violation[] = [];

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        if (shouldScanDirectory(entry.name)) {
          allViolations = allViolations.concat(scanDirectory(fullPath));
        }
      } else if (entry.isFile() && shouldScanFile(fullPath)) {
        allViolations = allViolations.concat(scanFile(fullPath));
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }

  return allViolations;
}

function generateStats(violations: Violation[]): ViolationStats {
  const stats: ViolationStats = {
    totalFiles: new Set(violations.map(v => v.file)).size,
    totalViolations: violations.length,
    byType: {},
    byFile: {},
  };

  violations.forEach(v => {
    stats.byType[v.type] = (stats.byType[v.type] || 0) + 1;
    stats.byFile[v.file] = (stats.byFile[v.file] || 0) + 1;
  });

  return stats;
}

function generateReport(violations: Violation[], stats: ViolationStats): string {
  let report = `
╔═══════════════════════════════════════════════════════════════════════════╗
║                    ATOMIC DESIGN SYSTEM AUDIT REPORT                      ║
║                         ZERO TOLERANCE ENFORCEMENT                        ║
╚═══════════════════════════════════════════════════════════════════════════╝

📊 SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Violations: ${stats.totalViolations}
Files Affected: ${stats.totalFiles}
Compliance Status: ❌ FAILED

🔍 VIOLATIONS BY TYPE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  Object.entries(stats.byType)
    .sort(([, a], [, b]) => b - a)
    .forEach(([type, count]) => {
      report += `${type.padEnd(30)} ${count.toString().padStart(6)} violations\n`;
    });

  report += `\n📁 TOP 20 FILES WITH MOST VIOLATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  Object.entries(stats.byFile)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .forEach(([file, count]) => {
      const relativePath = path.relative(process.cwd(), file);
      report += `${count.toString().padStart(4)} | ${relativePath}\n`;
    });

  report += `\n⚠️  DETAILED VIOLATIONS (First 100)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  violations.slice(0, 100).forEach((v, index) => {
    const relativePath = path.relative(process.cwd(), v.file);
    report += `\n${(index + 1).toString().padStart(3)}. ${relativePath}:${v.line}:${v.column}\n`;
    report += `    Type: ${v.type}\n`;
    report += `    Found: ${v.violation}\n`;
    report += `    Fix: ${v.suggestion}\n`;
  });

  if (violations.length > 100) {
    report += `\n... and ${violations.length - 100} more violations\n`;
  }

  report += `\n
╔═══════════════════════════════════════════════════════════════════════════╗
║                           REMEDIATION REQUIRED                            ║
╚═══════════════════════════════════════════════════════════════════════════╝

All violations must be resolved before the design system can be considered
compliant. Use the following priority order:

1. Fix atomic components first (atoms, molecules, organisms)
2. Fix templates and page layouts
3. Fix individual pages
4. Verify no new violations are introduced

Run this script again after fixes to verify compliance.
`;

  return report;
}

function main() {
  console.log('🔍 Starting Atomic Design System Audit...\n');

  const srcPath = path.join(process.cwd(), 'src');
  
  console.log(`Scanning directory: ${srcPath}\n`);
  
  const violations = scanDirectory(srcPath);
  const stats = generateStats(violations);
  
  const report = generateReport(violations, stats);
  
  // Write report to file
  const reportPath = path.join(process.cwd(), 'DESIGN_SYSTEM_AUDIT_REPORT.txt');
  fs.writeFileSync(reportPath, report);
  
  // Also write JSON for programmatic access
  const jsonPath = path.join(process.cwd(), 'design-violations.json');
  fs.writeFileSync(jsonPath, JSON.stringify({ violations, stats }, null, 2));
  
  console.log(report);
  console.log(`\n📄 Full report saved to: ${reportPath}`);
  console.log(`📊 JSON data saved to: ${jsonPath}\n`);
  
  // Exit with error code if violations found
  process.exit(violations.length > 0 ? 1 : 0);
}

main();
