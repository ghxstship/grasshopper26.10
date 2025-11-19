#!/usr/bin/env tsx
/**
 * Automated Fix Script for bg-gray Violations
 * Replaces hardcoded bg-gray-* classes with proper Card component usage
 * 
 * This script will:
 * 1. Identify divs/sections with bg-gray-* classes
 * 2. Suggest Card component replacements
 * 3. Generate a report of changes needed
 */

import * as fs from 'fs';
import * as path from 'path';

interface Fix {
  file: string;
  line: number;
  original: string;
  suggested: string;
  context: string;
}

const fixes: Fix[] = [];

function analyzeFile(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Pattern: className with bg-gray-*
    const bgGrayPattern = /className="([^"]*bg-gray-\d{3}[^"]*)"/g;
    let match;

    while ((match = bgGrayPattern.exec(line)) !== null) {
      const fullClassName = match[1];
      
      // Determine if this should be a Card
      const isCard = line.includes('<div') || line.includes('<section');
      
      if (isCard) {
        fixes.push({
          file: filePath,
          line: index + 1,
          original: match[0],
          suggested: 'Use <Card variant="default"> component from @/components/atoms/Card',
          context: line.trim(),
        });
      }
    }
  });
}

function scanDirectory(dirPath: string): void {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      scanDirectory(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx'))) {
      analyzeFile(fullPath);
    }
  }
}

function generateReport(): string {
  let report = `
╔═══════════════════════════════════════════════════════════════════════════╗
║                    BG-COLOR VIOLATION FIX REPORT                          ║
╚═══════════════════════════════════════════════════════════════════════════╝

Total fixes needed: ${fixes.length}

INSTRUCTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Replace hardcoded bg-gray-* classes with Card component:

BEFORE:
<div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
  <h3>Title</h3>
  <p>Content</p>
</div>

AFTER:
<Card variant="default">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content</p>
  </CardContent>
</Card>

Import statement needed:
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FIXES NEEDED (First 50):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

  fixes.slice(0, 50).forEach((fix, index) => {
    const relativePath = path.relative(process.cwd(), fix.file);
    report += `\n${(index + 1).toString().padStart(3)}. ${relativePath}:${fix.line}\n`;
    report += `    Context: ${fix.context.substring(0, 80)}...\n`;
    report += `    Fix: ${fix.suggested}\n`;
  });

  if (fixes.length > 50) {
    report += `\n... and ${fixes.length - 50} more fixes needed\n`;
  }

  return report;
}

function main() {
  console.log('🔍 Analyzing bg-color violations...\n');

  const srcPath = path.join(process.cwd(), 'src/app');
  scanDirectory(srcPath);

  const report = generateReport();
  console.log(report);

  const reportPath = path.join(process.cwd(), 'BG_COLOR_FIX_REPORT.txt');
  fs.writeFileSync(reportPath, report);

  console.log(`\n📄 Report saved to: ${reportPath}\n`);
}

main();
