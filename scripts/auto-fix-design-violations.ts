#!/usr/bin/env ts-node
/**
 * Automated Design Violation Fixer
 * Automatically fixes common design system violations
 * 
 * SAFE AUTOMATED FIXES:
 * - text-gray-* → semantic tokens
 * - bg-gray-* overrides → remove (use variant)
 * - Common spacing patterns → design tokens
 * 
 * MANUAL REVIEW REQUIRED:
 * - Complex color usage
 * - Custom component styling
 * - Platform-specific variants
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface Fix {
  file: string;
  changes: number;
  type: string;
}

interface ReplacementRule {
  pattern: RegExp;
  replacement: string | ((match: string, ...args: any[]) => string);
  description: string;
  safe: boolean;
}

const SAFE_REPLACEMENTS: ReplacementRule[] = [
  // Text color replacements
  {
    pattern: /text-gray-300\b/g,
    replacement: 'text-ghxst-text-secondary',
    description: 'text-gray-300 → text-ghxst-text-secondary',
    safe: true,
  },
  {
    pattern: /text-gray-400\b/g,
    replacement: 'text-ghxst-text-secondary',
    description: 'text-gray-400 → text-ghxst-text-secondary',
    safe: true,
  },
  {
    pattern: /text-gray-500\b/g,
    replacement: 'text-ghxst-text-secondary',
    description: 'text-gray-500 → text-ghxst-text-secondary',
    safe: true,
  },
  {
    pattern: /text-gray-600\b/g,
    replacement: 'text-ghxst-text-secondary',
    description: 'text-gray-600 → text-ghxst-text-secondary',
    safe: true,
  },
  {
    pattern: /text-gray-700\b/g,
    replacement: 'text-ghxst-text-primary',
    description: 'text-gray-700 → text-ghxst-text-primary',
    safe: true,
  },
  {
    pattern: /text-gray-800\b/g,
    replacement: 'text-ghxst-text-primary',
    description: 'text-gray-800 → text-ghxst-text-primary',
    safe: true,
  },
  {
    pattern: /text-gray-900\b/g,
    replacement: 'text-ghxst-text-primary',
    description: 'text-gray-900 → text-ghxst-text-primary',
    safe: true,
  },
  {
    pattern: /text-white\b/g,
    replacement: 'text-ghxst-text-inverse',
    description: 'text-white → text-ghxst-text-inverse',
    safe: true,
  },
  {
    pattern: /text-black\b/g,
    replacement: 'text-ghxst-text-primary',
    description: 'text-black → text-ghxst-text-primary',
    safe: true,
  },
  
  // Remove background overrides on Cards
  {
    pattern: /\s*bg-gray-\d+\/\d+/g,
    replacement: '',
    description: 'Remove bg-gray-* opacity overrides',
    safe: true,
  },
  {
    pattern: /\s*bg-gray-\d+\b/g,
    replacement: '',
    description: 'Remove bg-gray-* overrides',
    safe: true,
  },
  {
    pattern: /\s*bg-black\/\d+/g,
    replacement: '',
    description: 'Remove bg-black opacity overrides',
    safe: true,
  },
  {
    pattern: /\s*bg-white\/\d+/g,
    replacement: '',
    description: 'Remove bg-white opacity overrides',
    safe: true,
  },
  
  // Border color replacements
  {
    pattern: /border-gray-200\b/g,
    replacement: 'border-ghxst-border',
    description: 'border-gray-200 → border-ghxst-border',
    safe: true,
  },
  {
    pattern: /border-gray-300\b/g,
    replacement: 'border-ghxst-border',
    description: 'border-gray-300 → border-ghxst-border',
    safe: true,
  },
  {
    pattern: /border-gray-400\b/g,
    replacement: 'border-ghxst-border',
    description: 'border-gray-400 → border-ghxst-border',
    safe: true,
  },
];

class AutoFixer {
  private fixes: Fix[] = [];
  private totalChanges = 0;
  private filesProcessed = 0;
  private dryRun: boolean;

  constructor(dryRun = false) {
    this.dryRun = dryRun;
  }

  async fix(directory: string): Promise<void> {
    console.log(`🔧 ${this.dryRun ? 'DRY RUN - ' : ''}Fixing design violations...\n`);
    
    const files = await glob('**/*.{ts,tsx,js,jsx}', {
      cwd: directory,
      ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/.next/**',
        '**/coverage/**',
        '**/scripts/**',
        '**/design-system/tokens/**',
      ],
      absolute: true,
    });

    for (const file of files) {
      await this.fixFile(file);
    }

    this.printResults();
  }

  private async fixFile(filePath: string): Promise<void> {
    this.filesProcessed++;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    let changes = 0;

    for (const rule of SAFE_REPLACEMENTS) {
      const matches = content.match(rule.pattern);
      if (matches) {
        content = content.replace(rule.pattern, rule.replacement as string);
        changes += matches.length;
      }
    }

    if (changes > 0) {
      this.fixes.push({
        file: filePath,
        changes,
        type: 'automated',
      });
      this.totalChanges += changes;

      if (!this.dryRun) {
        fs.writeFileSync(filePath, content, 'utf-8');
      }
    }
  }

  private printResults(): void {
    console.log('\n' + '='.repeat(80));
    console.log(`${this.dryRun ? 'DRY RUN - ' : ''}AUTO-FIX RESULTS`);
    console.log('='.repeat(80) + '\n');

    if (this.fixes.length === 0) {
      console.log('✅ No violations found to fix!\n');
      console.log(`Files scanned: ${this.filesProcessed}`);
      return;
    }

    console.log(`${this.dryRun ? 'Would fix' : 'Fixed'} ${this.totalChanges} violations in ${this.fixes.length} files\n`);

    // Show top 10 files with most changes
    const topFixes = this.fixes
      .sort((a, b) => b.changes - a.changes)
      .slice(0, 10);

    console.log('Top files with changes:\n');
    for (const fix of topFixes) {
      const relativePath = path.relative(process.cwd(), fix.file);
      console.log(`  ${relativePath}: ${fix.changes} changes`);
    }

    if (this.fixes.length > 10) {
      console.log(`  ... and ${this.fixes.length - 10} more files\n`);
    }

    console.log('\n' + '='.repeat(80));
    
    if (this.dryRun) {
      console.log('\n💡 This was a DRY RUN. Run without --dry-run to apply changes.\n');
    } else {
      console.log('\n✅ Changes applied successfully!\n');
      console.log('Next steps:');
      console.log('1. Review changes with git diff');
      console.log('2. Run validation: npm run validate:tokens');
      console.log('3. Test the application');
      console.log('4. Commit changes\n');
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

// Run fixer
const fixer = new AutoFixer(dryRun);
const srcPath = path.join(process.cwd(), 'src');

fixer.fix(srcPath).catch((error) => {
  console.error('❌ Auto-fix failed:', error);
  process.exit(1);
});
