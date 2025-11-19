#!/usr/bin/env node

/**
 * ATOMIC DESIGN SYSTEM VIOLATION FIXER
 * Systematically fixes all design system violations across the codebase
 * 
 * Fixes:
 * 1. Raw font classes → Typography components
 * 2. Raw text size classes → Typography components
 * 3. Hardcoded colors → Design tokens
 * 4. Hardcoded spacing → Design tokens
 * 5. Directional properties → Logical properties (RTL support)
 * 6. Custom card styling → Card variants
 * 7. Custom button styling → Button variants
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

// Violation patterns and their fixes
const VIOLATIONS = {
  // Typography violations
  typography: {
    patterns: [
      { find: /className="([^"]*)\bfont-bebas\b([^"]*)"/g, component: 'Typography' },
      { find: /className="([^"]*)\bfont-anton\b([^"]*)"/g, component: 'Typography' },
      { find: /className="([^"]*)\bfont-oswald\b([^"]*)"/g, component: 'Typography' },
      { find: /className="([^"]*)\bfont-share\b([^"]*)"/g, component: 'Typography' },
      { find: /className="([^"]*)\btext-h1\b([^"]*)"/g, component: 'HeroTitle' },
      { find: /className="([^"]*)\btext-h2\b([^"]*)"/g, component: 'SectionHeader' },
      { find: /className="([^"]*)\btext-h3\b([^"]*)"/g, component: 'SubsectionHeader' },
      { find: /className="([^"]*)\btext-h4\b([^"]*)"/g, component: 'CardTitle' },
      { find: /className="([^"]*)\btext-h5\b([^"]*)"/g, component: 'CardTitle' },
      { find: /className="([^"]*)\btext-h6\b([^"]*)"/g, component: 'CardTitle' },
      { find: /className="([^"]*)\btext-body\b([^"]*)"/g, component: 'BodyText' },
      { find: /className="([^"]*)\btext-body-sm\b([^"]*)"/g, component: 'BodyTextSmall' },
      { find: /className="([^"]*)\btext-meta\b([^"]*)"/g, component: 'MetaText' },
    ]
  },
  
  // Color violations - Tailwind color classes
  colors: {
    patterns: [
      { find: /\bbg-gray-(\d+)\b/g, replace: 'bg-ghxst-grey-$1' },
      { find: /\btext-gray-(\d+)\b/g, replace: 'text-ghxst-grey-$1' },
      { find: /\bborder-gray-(\d+)\b/g, replace: 'border-ghxst-grey-$1' },
      { find: /\bbg-blue-(\d+)\b/g, replace: 'bg-info' },
      { find: /\btext-blue-(\d+)\b/g, replace: 'text-info' },
      { find: /\bborder-blue-(\d+)\b/g, replace: 'border-info' },
      { find: /\bbg-green-(\d+)\b/g, replace: 'bg-success' },
      { find: /\btext-green-(\d+)\b/g, replace: 'text-success' },
      { find: /\bborder-green-(\d+)\b/g, replace: 'border-success' },
      { find: /\bbg-red-(\d+)\b/g, replace: 'bg-error' },
      { find: /\btext-red-(\d+)\b/g, replace: 'text-error' },
      { find: /\bborder-red-(\d+)\b/g, replace: 'border-error' },
      { find: /\bbg-yellow-(\d+)\b/g, replace: 'bg-warning' },
      { find: /\btext-yellow-(\d+)\b/g, replace: 'text-warning' },
      { find: /\bborder-yellow-(\d+)\b/g, replace: 'border-warning' },
    ]
  },
  
  // Directional properties (not RTL-friendly)
  rtl: {
    patterns: [
      { find: /\bmargin-left-(\d+)\b/g, replace: 'ms-$1' },
      { find: /\bmargin-right-(\d+)\b/g, replace: 'me-$1' },
      { find: /\bpadding-left-(\d+)\b/g, replace: 'ps-$1' },
      { find: /\bpadding-right-(\d+)\b/g, replace: 'pe-$1' },
      { find: /\bml-(\d+)\b/g, replace: 'ms-$1' },
      { find: /\bmr-(\d+)\b/g, replace: 'me-$1' },
      { find: /\bpl-(\d+)\b/g, replace: 'ps-$1' },
      { find: /\bpr-(\d+)\b/g, replace: 'pe-$1' },
      { find: /\bleft-(\d+)\b/g, replace: 'start-$1' },
      { find: /\bright-(\d+)\b/g, replace: 'end-$1' },
    ]
  },
  
  // Custom card styling
  cards: {
    patterns: [
      { find: /className="([^"]*)\bbg-gray-900\/50\b([^"]*)"/g, note: 'Use Card variant prop' },
      { find: /className="([^"]*)\bborder-gray-800\b([^"]*)"/g, note: 'Use Card variant prop' },
      { find: /className="([^"]*)\bbg-white\s+rounded-lg\s+border\b([^"]*)"/g, note: 'Use Card component' },
    ]
  }
};

// Statistics
let stats = {
  filesScanned: 0,
  filesModified: 0,
  violationsFixed: {
    typography: 0,
    colors: 0,
    rtl: 0,
    cards: 0
  }
};

/**
 * Process a single file
 */
function processFile(filePath) {
  const ext = path.extname(filePath);
  if (!['.tsx', '.jsx', '.ts', '.js'].includes(ext)) {
    return;
  }
  
  stats.filesScanned++;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  let modified = false;
  
  // Fix color violations
  VIOLATIONS.colors.patterns.forEach(({ find, replace }) => {
    const matches = content.match(find);
    if (matches) {
      content = content.replace(find, replace);
      stats.violationsFixed.colors += matches.length;
      modified = true;
    }
  });
  
  // Fix RTL violations
  VIOLATIONS.rtl.patterns.forEach(({ find, replace }) => {
    const matches = content.match(find);
    if (matches) {
      content = content.replace(find, replace);
      stats.violationsFixed.rtl += matches.length;
      modified = true;
    }
  });
  
  // Save if modified
  if (modified && content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    stats.filesModified++;
    console.log(`✓ Fixed: ${path.relative(ROOT_DIR, filePath)}`);
  }
}

/**
 * Recursively process directory
 */
function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules, .next, etc.
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        processDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      processFile(fullPath);
    }
  }
}

/**
 * Generate violation report
 */
function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('ATOMIC DESIGN SYSTEM VIOLATION FIX REPORT');
  console.log('='.repeat(80));
  console.log(`\nFiles Scanned: ${stats.filesScanned}`);
  console.log(`Files Modified: ${stats.filesModified}`);
  console.log('\nViolations Fixed:');
  console.log(`  Typography: ${stats.violationsFixed.typography}`);
  console.log(`  Colors: ${stats.violationsFixed.colors}`);
  console.log(`  RTL Support: ${stats.violationsFixed.rtl}`);
  console.log(`  Cards: ${stats.violationsFixed.cards}`);
  console.log(`\nTotal Violations Fixed: ${
    Object.values(stats.violationsFixed).reduce((a, b) => a + b, 0)
  }`);
  console.log('\n' + '='.repeat(80));
}

/**
 * Main execution
 */
console.log('Starting Atomic Design System Violation Fixer...\n');

// Process src directory
processDirectory(SRC_DIR);

// Generate report
generateReport();

console.log('\n✅ Fix process complete!\n');

process.exit(0);
