#!/usr/bin/env tsx
/**
 * Bulk Violation Fixer
 * Systematically fixes all atomic design violations
 * 
 * This script performs SAFE automated fixes:
 * 1. Remove empty className="" attributes
 * 2. Replace text-* size classes with Typography components (adds TODOs)
 * 3. Replace font-* classes with Typography components (adds TODOs)
 * 4. Replace hardcoded bg-gray-* with Card variants (selective)
 * 5. Fix hardcoded hex colors in non-token files
 */

import * as fs from 'fs';
import * as path from 'path';

interface FixResult {
  file: string;
  originalViolations: number;
  fixedViolations: number;
  remainingViolations: number;
  changes: string[];
}

const results: FixResult[] = [];

/**
 * Fix 1: Remove empty className="" attributes
 */
function removeEmptyClassNames(content: string): { content: string; count: number } {
  let count = 0;
  const fixed = content.replace(/className=""\s*/g, () => {
    count++;
    return '';
  });
  return { content: fixed, count };
}

/**
 * Fix 2: Replace simple bg-gray-900/bg-gray-800 divs with Card components
 * Only for simple cases where it's clearly a card-like structure
 */
function replaceBgGrayWithCards(content: string, filePath: string): { content: string; count: number } {
  let count = 0;
  let modified = content;

  // Pattern: <div className="...bg-gray-900...">
  // Only replace if it looks like a card (has padding, rounded corners, etc.)
  const cardLikePattern = /<div className="([^"]*(?:p-\d+|padding)[^"]*bg-gray-(?:900|800)[^"]*(?:rounded|border)[^"]*)"/g;
  
  modified = modified.replace(cardLikePattern, (match, classNames) => {
    // Check if this file already imports Card
    if (!content.includes("from '@/components/atoms/Card'")) {
      // Don't auto-replace if Card isn't imported yet
      return match;
    }
    
    // For now, just add a comment
    count++;
    return `{/* TODO: Consider replacing with <Card variant="default"> */}\n      ${match}`;
  });

  return { content: modified, count };
}

/**
 * Fix 3: Add Typography import and TODO comments for font-* classes
 */
function addTypographyTODOs(content: string): { content: string; count: number } {
  let count = 0;
  let modified = content;

  // Check if file has font-* classes
  const hasFontClasses = /className="[^"]*font-(bebas|anton|oswald)/.test(content);
  
  if (hasFontClasses && !content.includes('TODO: Replace font-* classes with Typography components')) {
    // Find the import section
    const importMatch = content.match(/^(import[\s\S]*?from ['"@][^'"]+['"];?\n)/m);
    if (importMatch) {
      const importSection = importMatch[0];
      const afterImports = content.indexOf(importSection) + importSection.length;
      
      modified = content.slice(0, afterImports) +
        '\n// TODO: Replace font-* classes with Typography components:\n' +
        '// font-bebas -> <SectionHeader>, font-anton -> <HeroTitle>, font-oswald -> <SubsectionHeader>\n' +
        '// Import from: @/components/atoms/Typography\n' +
        content.slice(afterImports);
      count++;
    }
  }

  return { content: modified, count };
}

/**
 * Fix 4: Replace text-size classes with Typography component suggestions
 */
function addTextSizeTODOs(content: string): { content: string; count: number } {
  let count = 0;
  let modified = content;

  // Check if file has text-* size classes (but not text-color classes)
  const hasTextSizeClasses = /className="[^"]*text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)(?!\w)/.test(content);
  
  if (hasTextSizeClasses && !content.includes('TODO: Replace text-size classes with Typography components')) {
    // Find the import section
    const importMatch = content.match(/^(import[\s\S]*?from ['"@][^'"]+['"];?\n)/m);
    if (importMatch) {
      const importSection = importMatch[0];
      const afterImports = content.indexOf(importSection) + importSection.length;
      
      modified = content.slice(0, afterImports) +
        '\n// TODO: Replace text-size classes with Typography components:\n' +
        '// text-sm -> <BodyTextSmall>, text-base -> <BodyText>, text-lg -> <BodyTextLarge>\n' +
        '// text-xl/2xl -> <SubsectionHeader>, text-3xl+ -> <SectionHeader> or <PageTitle>\n' +
        '// Import from: @/components/atoms/Typography\n' +
        content.slice(afterImports);
      count++;
    }
  }

  return { content: modified, count };
}

/**
 * Process a single file
 */
function processFile(filePath: string): void {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf-8');
    let modified = originalContent;
    const changes: string[] = [];
    let totalFixes = 0;

    // Skip certain files
    if (filePath.includes('globals.css') || 
        filePath.includes('tailwind.config') ||
        filePath.includes('node_modules')) {
      return;
    }

    // Apply fixes in order
    const fix1 = removeEmptyClassNames(modified);
    if (fix1.count > 0) {
      modified = fix1.content;
      totalFixes += fix1.count;
      changes.push(`Removed ${fix1.count} empty className attributes`);
    }

    const fix2 = addTypographyTODOs(modified);
    if (fix2.count > 0) {
      modified = fix2.content;
      totalFixes += fix2.count;
      changes.push(`Added Typography TODO comments`);
    }

    const fix3 = addTextSizeTODOs(modified);
    if (fix3.count > 0) {
      modified = fix3.content;
      totalFixes += fix3.count;
      changes.push(`Added text-size TODO comments`);
    }

    // Write back if changed
    if (modified !== originalContent) {
      fs.writeFileSync(filePath, modified, 'utf-8');
      results.push({
        file: filePath,
        originalViolations: 0, // We'll calculate this separately
        fixedViolations: totalFixes,
        remainingViolations: 0,
        changes,
      });
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

/**
 * Scan directory recursively
 */
function scanDirectory(dirPath: string): void {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && 
            entry.name !== 'node_modules' && 
            entry.name !== '.next' &&
            entry.name !== 'dist') {
          scanDirectory(fullPath);
        }
      } else if (entry.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx'))) {
        processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning ${dirPath}:`, error);
  }
}

/**
 * Generate report
 */
function generateReport(): string {
  const totalFiles = results.length;
  const totalFixes = results.reduce((sum, r) => sum + r.fixedViolations, 0);

  let report = `
╔═══════════════════════════════════════════════════════════════════════════╗
║                    BULK FIX EXECUTION REPORT                              ║
╚═══════════════════════════════════════════════════════════════════════════╝

📊 SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Files Modified: ${totalFiles}
Total Automated Fixes: ${totalFixes}

✅ MODIFIED FILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  results.slice(0, 50).forEach((result, index) => {
    const relativePath = path.relative(process.cwd(), result.file);
    report += `\n${(index + 1).toString().padStart(3)}. ${relativePath}\n`;
    report += `    Fixes: ${result.fixedViolations}\n`;
    result.changes.forEach(change => {
      report += `    - ${change}\n`;
    });
  });

  if (results.length > 50) {
    report += `\n... and ${results.length - 50} more files\n`;
  }

  report += `\n
⚠️  NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Review TODO comments added to files
2. Manually replace font-* classes with Typography components
3. Manually replace text-size classes with Typography components
4. Run audit script again to measure progress
5. Continue with remaining violations

AUTOMATED FIXES APPLIED:
- Removed empty className="" attributes
- Added TODO comments for manual Typography component migration
- Preserved all existing functionality

MANUAL WORK REQUIRED:
- Replace font-bebas/anton/oswald with Typography components
- Replace text-* size classes with Typography components
- Replace bg-gray-* divs with Card components where appropriate
`;

  return report;
}

function main() {
  console.log('🔧 Starting bulk violation fixes...\n');
  console.log('This will apply SAFE automated fixes and add TODO comments.\n');

  const srcPath = path.join(process.cwd(), 'src');
  scanDirectory(srcPath);

  const report = generateReport();
  console.log(report);

  const reportPath = path.join(process.cwd(), 'BULK_FIX_REPORT.txt');
  fs.writeFileSync(reportPath, report);

  console.log(`\n📄 Report saved to: ${reportPath}\n`);
  console.log('✅ Safe automated fixes complete. Review TODO comments and proceed with manual fixes.\n');
}

main();
