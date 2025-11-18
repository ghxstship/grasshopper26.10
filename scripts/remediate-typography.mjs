#!/usr/bin/env node

/**
 * Typography Remediation Script
 * 
 * This script automatically remediates hardcoded typography values across the codebase
 * by replacing them with semantic typography tokens from the design system.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

// Typography mapping rules - from hardcoded values to semantic tokens
const TYPOGRAPHY_MAPPINGS = [
  // Font sizes - exact matches
  { pattern: /text-9xl/g, replacement: 'text-hero', description: 'text-9xl → text-hero' },
  { pattern: /text-8xl/g, replacement: 'text-hero', description: 'text-8xl → text-hero' },
  { pattern: /text-7xl/g, replacement: 'text-display', description: 'text-7xl → text-display' },
  { pattern: /text-6xl/g, replacement: 'text-h1', description: 'text-6xl → text-h1' },
  { pattern: /text-5xl/g, replacement: 'text-h1', description: 'text-5xl → text-h1' },
  { pattern: /text-4xl/g, replacement: 'text-h2', description: 'text-4xl → text-h2' },
  { pattern: /text-3xl/g, replacement: 'text-h3', description: 'text-3xl → text-h3' },
  { pattern: /text-2xl/g, replacement: 'text-h4', description: 'text-2xl → text-h4' },
  { pattern: /text-xl/g, replacement: 'text-h5', description: 'text-xl → text-h5' },
  { pattern: /text-lg/g, replacement: 'text-h6', description: 'text-lg → text-h6' },
  { pattern: /text-base/g, replacement: 'text-body', description: 'text-base → text-body' },
  { pattern: /text-sm/g, replacement: 'text-body-sm', description: 'text-sm → text-body-sm' },
  { pattern: /text-xs/g, replacement: 'text-caption', description: 'text-xs → text-caption' },
  
  // Font weights - remove hardcoded weights (handled by semantic tokens)
  { pattern: /\s+font-black/g, replacement: '', description: 'Removed font-black (handled by semantic token)' },
  { pattern: /\s+font-extrabold/g, replacement: '', description: 'Removed font-extrabold (handled by semantic token)' },
  { pattern: /\s+font-bold/g, replacement: '', description: 'Removed font-bold (handled by semantic token)' },
  { pattern: /\s+font-semibold/g, replacement: '', description: 'Removed font-semibold (handled by semantic token)' },
  { pattern: /\s+font-medium/g, replacement: '', description: 'Removed font-medium (handled by semantic token)' },
  { pattern: /\s+font-normal/g, replacement: '', description: 'Removed font-normal (handled by semantic token)' },
  { pattern: /\s+font-light/g, replacement: '', description: 'Removed font-light (handled by semantic token)' },
  { pattern: /\s+font-extralight/g, replacement: '', description: 'Removed font-extralight (handled by semantic token)' },
  { pattern: /\s+font-thin/g, replacement: '', description: 'Removed font-thin (handled by semantic token)' },
  
  // Line heights - remove hardcoded line heights (handled by semantic tokens)
  { pattern: /\s+leading-none/g, replacement: '', description: 'Removed leading-none (handled by semantic token)' },
  { pattern: /\s+leading-tight/g, replacement: '', description: 'Removed leading-tight (handled by semantic token)' },
  { pattern: /\s+leading-snug/g, replacement: '', description: 'Removed leading-snug (handled by semantic token)' },
  { pattern: /\s+leading-normal/g, replacement: '', description: 'Removed leading-normal (handled by semantic token)' },
  { pattern: /\s+leading-relaxed/g, replacement: '', description: 'Removed leading-relaxed (handled by semantic token)' },
  { pattern: /\s+leading-loose/g, replacement: '', description: 'Removed leading-loose (handled by semantic token)' },
  
  // Letter spacing - remove hardcoded letter spacing (handled by semantic tokens)
  { pattern: /\s+tracking-tighter/g, replacement: '', description: 'Removed tracking-tighter (handled by semantic token)' },
  { pattern: /\s+tracking-tight/g, replacement: '', description: 'Removed tracking-tight (handled by semantic token)' },
  { pattern: /\s+tracking-normal/g, replacement: '', description: 'Removed tracking-normal (handled by semantic token)' },
  { pattern: /\s+tracking-wide/g, replacement: '', description: 'Removed tracking-wide (handled by semantic token)' },
  { pattern: /\s+tracking-wider/g, replacement: '', description: 'Removed tracking-wider (handled by semantic token)' },
  { pattern: /\s+tracking-widest/g, replacement: '', description: 'Removed tracking-widest (handled by semantic token)' },
];

// Responsive typography patterns to remove (handled by CSS variables)
const RESPONSIVE_PATTERNS = [
  { pattern: /\s+md:text-\w+/g, replacement: '', description: 'Removed responsive md:text-* (handled by CSS variables)' },
  { pattern: /\s+lg:text-\w+/g, replacement: '', description: 'Removed responsive lg:text-* (handled by CSS variables)' },
  { pattern: /\s+xl:text-\w+/g, replacement: '', description: 'Removed responsive xl:text-* (handled by CSS variables)' },
  { pattern: /\s+2xl:text-\w+/g, replacement: '', description: 'Removed responsive 2xl:text-* (handled by CSS variables)' },
  { pattern: /\s+sm:text-\w+/g, replacement: '', description: 'Removed responsive sm:text-* (handled by CSS variables)' },
];

// Statistics
const stats = {
  filesProcessed: 0,
  filesModified: 0,
  totalReplacements: 0,
  replacementsByType: {},
};

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    let modifiedContent = content;
    let fileModified = false;
    let fileReplacements = 0;

    // Apply typography mappings
    for (const mapping of TYPOGRAPHY_MAPPINGS) {
      const matches = modifiedContent.match(mapping.pattern);
      if (matches) {
        modifiedContent = modifiedContent.replace(mapping.pattern, mapping.replacement);
        const count = matches.length;
        fileReplacements += count;
        stats.totalReplacements += count;
        stats.replacementsByType[mapping.description] = 
          (stats.replacementsByType[mapping.description] || 0) + count;
        fileModified = true;
      }
    }

    // Apply responsive pattern removal
    for (const pattern of RESPONSIVE_PATTERNS) {
      const matches = modifiedContent.match(pattern.pattern);
      if (matches) {
        modifiedContent = modifiedContent.replace(pattern.pattern, pattern.replacement);
        const count = matches.length;
        fileReplacements += count;
        stats.totalReplacements += count;
        stats.replacementsByType[pattern.description] = 
          (stats.replacementsByType[pattern.description] || 0) + count;
        fileModified = true;
      }
    }

    // Clean up multiple spaces
    if (fileModified) {
      modifiedContent = modifiedContent.replace(/className="([^"]*)"/g, (match, classes) => {
        const cleanedClasses = classes.replace(/\s+/g, ' ').trim();
        return `className="${cleanedClasses}"`;
      });
      
      modifiedContent = modifiedContent.replace(/className={cn\("([^"]*)"/g, (match, classes) => {
        const cleanedClasses = classes.replace(/\s+/g, ' ').trim();
        return `className={cn("${cleanedClasses}"`;
      });
    }

    if (fileModified) {
      writeFileSync(filePath, modifiedContent, 'utf8');
      stats.filesModified++;
      console.log(`✓ Modified: ${filePath} (${fileReplacements} replacements)`);
    }

    stats.filesProcessed++;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

/**
 * Recursively process directory
 */
function processDirectory(dirPath, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const entries = readdirSync(dirPath);

  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules, .git, and other non-source directories
      if (!['node_modules', '.git', '.next', 'dist', 'build', '.swc'].includes(entry)) {
        processDirectory(fullPath, extensions);
      }
    } else if (stat.isFile()) {
      const ext = extname(fullPath);
      if (extensions.includes(ext)) {
        processFile(fullPath);
      }
    }
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🎨 Typography Remediation Script');
  console.log('==================================\n');

  const srcPath = join(process.cwd(), 'src');
  
  console.log(`Processing directory: ${srcPath}\n`);
  
  const startTime = Date.now();
  processDirectory(srcPath);
  const endTime = Date.now();

  console.log('\n==================================');
  console.log('📊 Remediation Summary');
  console.log('==================================');
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`Total replacements: ${stats.totalReplacements}`);
  console.log(`Time elapsed: ${((endTime - startTime) / 1000).toFixed(2)}s`);
  
  if (Object.keys(stats.replacementsByType).length > 0) {
    console.log('\n📝 Replacements by type:');
    Object.entries(stats.replacementsByType)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        console.log(`  ${count.toString().padStart(4)} × ${type}`);
      });
  }
  
  console.log('\n✅ Typography remediation complete!');
}

main();
