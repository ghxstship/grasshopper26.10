#!/usr/bin/env tsx
/**
 * Automated Violation Fixer
 * Systematically fixes atomic design violations across the codebase
 * 
 * Priority order:
 * 1. Fix atomic components (atoms, molecules, organisms)
 * 2. Fix templates
 * 3. Fix pages
 */

import * as fs from 'fs';
import * as path from 'path';

interface FileEdit {
  file: string;
  edits: number;
  success: boolean;
  error?: string;
}

const results: FileEdit[] = [];

/**
 * Fix raw font-family violations
 * Replace font-bebas, font-anton, font-oswald with Typography components
 */
function fixFontFamilyViolations(content: string, filePath: string): string {
  let modified = content;
  let hasChanges = false;

  // Check if Typography components are already imported
  const hasTypographyImport = content.includes("from '@/components/atoms/Typography'") ||
                               content.includes('from "@/components/atoms/Typography"');

  // Pattern 1: className="font-bebas ..." or className="font-anton ..." etc.
  // These need manual review as they should use Typography components
  // For now, we'll add a comment
  const fontClassPattern = /className="([^"]*)(font-bebas|font-anton|font-oswald)([^"]*)"/g;
  
  if (fontClassPattern.test(content)) {
    // Add a TODO comment at the top if not already present
    if (!content.includes('TODO: Replace raw font classes with Typography components')) {
      const importSection = content.indexOf('import');
      if (importSection !== -1) {
        const firstImportEnd = content.indexOf('\n', importSection);
        modified = content.slice(0, firstImportEnd + 1) +
          '// TODO: Replace raw font classes with Typography components from @/components/atoms/Typography\n' +
          '// font-bebas -> SectionHeader, font-anton -> HeroTitle, font-oswald -> SubsectionHeader\n' +
          content.slice(firstImportEnd + 1);
        hasChanges = true;
      }
    }
  }

  return hasChanges ? modified : content;
}

/**
 * Fix bg-gray violations in components
 * For atomic components, we need to be more careful
 */
function fixBgGrayInComponents(content: string, filePath: string): string {
  let modified = content;

  // Only fix if it's NOT already using Card component properly
  if (!content.includes('<Card') && !content.includes('variant=')) {
    // Add import if needed
    if (!content.includes("from '@/components/atoms/Card'")) {
      const importSection = content.indexOf('import');
      if (importSection !== -1) {
        const firstImportEnd = content.indexOf('\n', importSection);
        modified = content.slice(0, firstImportEnd + 1) +
          "import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';\n" +
          content.slice(firstImportEnd + 1);
      }
    }

    // Add TODO comment for manual review
    if (!content.includes('TODO: Replace bg-gray classes with Card component')) {
      const importSection = modified.indexOf('import');
      if (importSection !== -1) {
        const firstImportEnd = modified.indexOf('\n', importSection);
        modified = modified.slice(0, firstImportEnd + 1) +
          '// TODO: Replace bg-gray classes with Card component\n' +
          '// <div className="bg-gray-900"> -> <Card variant="default">\n' +
          modified.slice(firstImportEnd + 1);
      }
    }
  }

  return modified;
}

/**
 * Process a single file
 */
function processFile(filePath: string): void {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    let modified = content;
    let editCount = 0;

    // Determine file type
    const isComponent = filePath.includes('/components/');
    const isAtom = filePath.includes('/components/atoms/');
    const isMolecule = filePath.includes('/components/molecules/');
    const isOrganism = filePath.includes('/components/organisms/');
    const isTemplate = filePath.includes('/components/templates/');

    // Apply fixes based on file type
    if (isAtom || isMolecule || isOrganism || isTemplate) {
      const afterFontFix = fixFontFamilyViolations(modified, filePath);
      if (afterFontFix !== modified) {
        modified = afterFontFix;
        editCount++;
      }

      const afterBgFix = fixBgGrayInComponents(modified, filePath);
      if (afterBgFix !== modified) {
        modified = afterBgFix;
        editCount++;
      }
    }

    // Write back if changed
    if (modified !== content) {
      fs.writeFileSync(filePath, modified, 'utf-8');
      results.push({
        file: filePath,
        edits: editCount,
        success: true,
      });
    }
  } catch (error) {
    results.push({
      file: filePath,
      edits: 0,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Scan and process directory
 */
function processDirectory(dirPath: string, priority: 'high' | 'medium' | 'low'): void {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      processDirectory(fullPath, priority);
    } else if (entry.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx'))) {
      processFile(fullPath);
    }
  }
}

function generateReport(): string {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const totalEdits = successful.reduce((sum, r) => sum + r.edits, 0);

  let report = `
╔═══════════════════════════════════════════════════════════════════════════╗
║                    AUTOMATED FIX EXECUTION REPORT                         ║
╚═══════════════════════════════════════════════════════════════════════════╝

📊 SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Files Processed: ${results.length}
Successful: ${successful.length}
Failed: ${failed.length}
Total Edits Applied: ${totalEdits}

✅ SUCCESSFULLY MODIFIED FILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  successful.forEach(result => {
    const relativePath = path.relative(process.cwd(), result.file);
    report += `${result.edits.toString().padStart(2)} edits | ${relativePath}\n`;
  });

  if (failed.length > 0) {
    report += `\n❌ FAILED FILES\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    failed.forEach(result => {
      const relativePath = path.relative(process.cwd(), result.file);
      report += `${relativePath}\n  Error: ${result.error}\n`;
    });
  }

  report += `\n
⚠️  NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Review TODO comments added to files
2. Manually replace font classes with Typography components
3. Manually replace bg-gray divs with Card components
4. Run audit script again to verify progress
5. Continue with page-level fixes

This script added TODO comments and imports but requires manual component
replacement for safety. The atomic design system must be preserved.
`;

  return report;
}

function main() {
  console.log('🔧 Starting automated violation fixes...\n');

  // Priority 1: Atomic components
  console.log('📦 Processing atomic components (atoms, molecules, organisms)...');
  const componentsPath = path.join(process.cwd(), 'src/components');
  if (fs.existsSync(componentsPath)) {
    processDirectory(componentsPath, 'high');
  }

  const report = generateReport();
  console.log(report);

  const reportPath = path.join(process.cwd(), 'AUTO_FIX_REPORT.txt');
  fs.writeFileSync(reportPath, report);

  console.log(`\n📄 Report saved to: ${reportPath}\n`);
}

main();
