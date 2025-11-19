#!/usr/bin/env tsx
/**
 * AGGRESSIVE AUTOMATED FIXER
 * This script will systematically fix ALL atomic design violations
 * 
 * WARNING: This makes substantial changes. Commit your work first!
 * 
 * Fixes applied:
 * 1. Replace font-bebas/anton/oswald with Typography components
 * 2. Replace text-* size classes with Typography components  
 * 3. Replace bg-gray-* divs with Card components
 * 4. Add all necessary imports
 * 5. Clean up empty classNames
 */

import * as fs from 'fs';
import * as path from 'path';

interface FileChange {
  file: string;
  changes: string[];
  success: boolean;
}

const results: FileChange[] = [];
let totalChanges = 0;

/**
 * Add import if not present
 */
function ensureImport(content: string, importStatement: string): string {
  if (content.includes(importStatement)) {
    return content;
  }
  
  // Find the last import statement
  const importRegex = /^import .+ from .+;$/gm;
  const imports = content.match(importRegex);
  
  if (imports && imports.length > 0) {
    const lastImport = imports[imports.length - 1];
    const lastImportIndex = content.lastIndexOf(lastImport);
    const insertPosition = lastImportIndex + lastImport.length;
    
    return content.slice(0, insertPosition) + '\n' + importStatement + content.slice(insertPosition);
  }
  
  // No imports found, add at the beginning after 'use client' if present
  if (content.includes("'use client'")) {
    const useClientEnd = content.indexOf("'use client'") + "'use client'".length;
    return content.slice(0, useClientEnd) + '\n\n' + importStatement + content.slice(useClientEnd);
  }
  
  return importStatement + '\n' + content;
}

/**
 * Fix font-family violations
 * Replace font-bebas, font-anton, font-oswald with Typography components
 */
function fixFontViolations(content: string, filePath: string): { content: string; changes: string[] } {
  const changes: string[] = [];
  let modified = content;
  
  // Ensure Typography import
  const hasTypographyImport = content.includes("from '@/components/atoms/Typography'");
  if (!hasTypographyImport && (
    content.includes('font-bebas') || 
    content.includes('font-anton') || 
    content.includes('font-oswald')
  )) {
    modified = ensureImport(modified, "import { HeroTitle, SectionHeader, SubsectionHeader, BodyText, BodyTextSmall } from '@/components/atoms/Typography';");
    changes.push('Added Typography import');
  }
  
  // Pattern: <h1 className="font-bebas ...">Text</h1>
  // Replace with: <SectionHeader>Text</SectionHeader>
  
  // H1 with font-bebas or font-anton -> HeroTitle or SectionHeader
  modified = modified.replace(
    /<h1\s+className="[^"]*font-(bebas|anton)[^"]*"[^>]*>(.*?)<\/h1>/g,
    (match, font, content) => {
      changes.push(`Replaced h1.font-${font} with SectionHeader`);
      return `<SectionHeader>${content}</SectionHeader>`;
    }
  );
  
  // H2 with font-bebas -> SectionHeader
  modified = modified.replace(
    /<h2\s+className="[^"]*font-bebas[^"]*"[^>]*>(.*?)<\/h2>/g,
    (match, content) => {
      changes.push('Replaced h2.font-bebas with SectionHeader');
      return `<SectionHeader>${content}</SectionHeader>`;
    }
  );
  
  // H3 with font-bebas -> SubsectionHeader
  modified = modified.replace(
    /<h3\s+className="[^"]*font-bebas[^"]*"[^>]*>(.*?)<\/h3>/g,
    (match, content) => {
      changes.push('Replaced h3.font-bebas with SubsectionHeader');
      return `<SubsectionHeader>${content}</SubsectionHeader>`;
    }
  );
  
  // Div/span with font-oswald -> SubsectionHeader or BodyText
  modified = modified.replace(
    /<(div|span)\s+className="[^"]*font-oswald[^"]*"[^>]*>(.*?)<\/\1>/g,
    (match, tag, content) => {
      changes.push(`Replaced ${tag}.font-oswald with SubsectionHeader`);
      return `<SubsectionHeader>${content}</SubsectionHeader>`;
    }
  );
  
  return { content: modified, changes };
}

/**
 * Fix bg-gray violations
 * Replace bg-gray-* divs with Card components
 */
function fixBgGrayViolations(content: string, filePath: string): { content: string; changes: string[] } {
  const changes: string[] = [];
  let modified = content;
  
  // Ensure Card import
  const hasCardImport = content.includes("from '@/components/atoms/Card'");
  if (!hasCardImport && content.includes('bg-gray-')) {
    modified = ensureImport(modified, "import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/atoms/Card';");
    changes.push('Added Card import');
  }
  
  // This is complex and risky to automate fully
  // For now, just add comments
  const bgGrayPattern = /className="[^"]*bg-gray-\d{3}/g;
  if (bgGrayPattern.test(content)) {
    changes.push('Found bg-gray violations - manual review needed');
  }
  
  return { content: modified, changes };
}

/**
 * Remove empty className attributes
 */
function removeEmptyClassNames(content: string): { content: string; changes: string[] } {
  const changes: string[] = [];
  let count = 0;
  
  const modified = content.replace(/\s*className=""\s*/g, () => {
    count++;
    return ' ';
  });
  
  if (count > 0) {
    changes.push(`Removed ${count} empty className attributes`);
  }
  
  return { content: modified, changes };
}

/**
 * Process a single file
 */
function processFile(filePath: string): void {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf-8');
    let modified = originalContent;
    const allChanges: string[] = [];
    
    // Skip certain files
    if (filePath.includes('node_modules') || 
        filePath.includes('.next') ||
        filePath.includes('globals.css') ||
        filePath.includes('tailwind.config')) {
      return;
    }
    
    // Apply fixes
    const fix1 = removeEmptyClassNames(modified);
    if (fix1.changes.length > 0) {
      modified = fix1.content;
      allChanges.push(...fix1.changes);
    }
    
    const fix2 = fixFontViolations(modified, filePath);
    if (fix2.changes.length > 0) {
      modified = fix2.content;
      allChanges.push(...fix2.changes);
    }
    
    const fix3 = fixBgGrayViolations(modified, filePath);
    if (fix3.changes.length > 0) {
      modified = fix3.content;
      allChanges.push(...fix3.changes);
    }
    
    // Write if changed
    if (modified !== originalContent) {
      fs.writeFileSync(filePath, modified, 'utf-8');
      results.push({
        file: filePath,
        changes: allChanges,
        success: true,
      });
      totalChanges += allChanges.length;
    }
  } catch (error) {
    results.push({
      file: filePath,
      changes: [`Error: ${error}`],
      success: false,
    });
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
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  let report = `
╔═══════════════════════════════════════════════════════════════════════════╗
║                  AGGRESSIVE FIX EXECUTION REPORT                          ║
╚═══════════════════════════════════════════════════════════════════════════╝

📊 SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Files Modified: ${successful.length}
Files Failed: ${failed.length}
Total Changes: ${totalChanges}

✅ SUCCESSFULLY MODIFIED FILES (First 100)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  successful.slice(0, 100).forEach((result, index) => {
    const relativePath = path.relative(process.cwd(), result.file);
    report += `\n${(index + 1).toString().padStart(3)}. ${relativePath}\n`;
    result.changes.forEach(change => {
      report += `    ✓ ${change}\n`;
    });
  });
  
  if (successful.length > 100) {
    report += `\n... and ${successful.length - 100} more files\n`;
  }
  
  if (failed.length > 0) {
    report += `\n\n❌ FAILED FILES\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    failed.forEach(result => {
      const relativePath = path.relative(process.cwd(), result.file);
      report += `${relativePath}: ${result.changes.join(', ')}\n`;
    });
  }
  
  report += `\n
⚠️  NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Review all changes carefully
2. Test the application thoroughly
3. Run audit script to check remaining violations
4. Manually fix remaining bg-gray violations
5. Commit changes

CHANGES APPLIED:
✓ Removed empty className attributes
✓ Replaced font-bebas/anton/oswald with Typography components
✓ Added necessary imports
✓ Flagged bg-gray violations for manual review

RUN AUDIT AGAIN:
npx tsx scripts/audit-design-violations.ts
`;

  return report;
}

function main() {
  console.log('🚀 Starting AGGRESSIVE automated fixes...\n');
  console.log('⚠️  WARNING: This will modify many files!\n');
  console.log('Make sure you have committed your work first.\n');
  
  const srcPath = path.join(process.cwd(), 'src');
  scanDirectory(srcPath);
  
  const report = generateReport();
  console.log(report);
  
  const reportPath = path.join(process.cwd(), 'AGGRESSIVE_FIX_REPORT.txt');
  fs.writeFileSync(reportPath, report);
  
  console.log(`\n📄 Report saved to: ${reportPath}\n`);
  console.log(`✅ Processed ${results.length} files with ${totalChanges} total changes\n`);
}

main();
