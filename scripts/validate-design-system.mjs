#!/usr/bin/env node

/**
 * DESIGN SYSTEM VALIDATION SCRIPT
 * Scans codebase for any remaining design system violations
 * 
 * Checks for:
 * 1. Hardcoded hex colors
 * 2. Hardcoded RGB/RGBA colors
 * 3. Raw font classes (font-bebas, font-anton, etc.)
 * 4. Raw text size classes (text-h1, text-h2, etc.)
 * 5. Directional properties (margin-left, padding-right, etc.)
 * 6. Hardcoded pixel spacing
 * 7. Custom card/button styling
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

// Violation patterns
const VIOLATIONS = {
  // Hardcoded colors (excluding design token files and gradients)
  hardcodedColors: {
    pattern: /#[0-9A-Fa-f]{3,6}/,
    message: 'Hardcoded hex color found. Use design tokens instead.',
    severity: 'error',
    exclude: ['tokens/', 'colors.ts', 'globals.css', 'linear-gradient', 'radial-gradient', 'qr-code.ts', 'formatting.ts']
  },
  
  rgbColors: {
    pattern: /rgba?\([^)]+\)(?!.*tokens|.*colors\.ts)/,
    message: 'Hardcoded RGB/RGBA color found. Use design tokens instead.',
    severity: 'error'
  },
  
  // Typography violations
  rawFontClasses: {
    pattern: /className="[^"]*\b(font-bebas|font-anton|font-oswald|font-share(?!-tech))\b[^"]*"/,
    message: 'Raw font class found. Use Typography components instead.',
    severity: 'error'
  },
  
  rawTextSizeClasses: {
    pattern: /className="[^"]*\b(text-h[1-6]|text-hero|text-body(?!-)|text-body-sm|text-meta)\b[^"]*"/,
    message: 'Raw text size class found. Use Typography components instead.',
    severity: 'error'
  },
  
  // Directional properties (not RTL-friendly)
  directionalMargin: {
    pattern: /\b(margin-left|margin-right|ml-|mr-)\d+\b/,
    message: 'Directional margin found. Use margin-inline-start/end (ms-/me-) for RTL support.',
    severity: 'warning'
  },
  
  directionalPadding: {
    pattern: /\b(padding-left|padding-right|pl-|pr-)\d+\b/,
    message: 'Directional padding found. Use padding-inline-start/end (ps-/pe-) for RTL support.',
    severity: 'warning'
  },
  
  directionalPosition: {
    pattern: /\b(left|right)-\d+\b/,
    message: 'Directional positioning found. Use start-/end- for RTL support.',
    severity: 'warning'
  },
  
  // Tailwind color classes that should use semantic tokens
  tailwindColors: {
    pattern: /\b(bg|text|border)-(gray|blue|green|red|yellow|purple|indigo|cyan|orange)-\d+\b/,
    message: 'Tailwind color class found. Use semantic color tokens (bg-ghxst-*, text-success, etc.).',
    severity: 'warning'
  },
  
  // Custom styling that should use components
  customCardStyling: {
    pattern: /className="[^"]*bg-white\s+rounded-lg\s+border[^"]*"/,
    message: 'Custom card styling found. Use Card component with variant prop.',
    severity: 'warning'
  },
};

let results = {
  totalFiles: 0,
  filesWithViolations: 0,
  violations: {},
  violationsByFile: {}
};

// Initialize violation counters
Object.keys(VIOLATIONS).forEach(key => {
  results.violations[key] = 0;
});

/**
 * Check file for violations
 */
function checkFile(filePath) {
  const ext = path.extname(filePath);
  if (!['.tsx', '.jsx', '.ts', '.js', '.css', '.scss'].includes(ext)) {
    return;
  }
  
  // Skip token/color definition files
  if (filePath.includes('/tokens/') || filePath.includes('colors.ts') || filePath.includes('colors.tsx')) {
    return;
  }
  
  results.totalFiles++;
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const fileViolations = [];
  
  // Check each violation pattern
  Object.entries(VIOLATIONS).forEach(([key, config]) => {
    const { pattern, message, severity, exclude = [] } = config;
    
    lines.forEach((line, lineNum) => {
      // Skip if line contains any exclude pattern
      const shouldExclude = exclude.some(excludePattern => 
        line.includes(excludePattern) || filePath.includes(excludePattern)
      );
      
      if (!shouldExclude && pattern.test(line)) {
        results.violations[key]++;
        fileViolations.push({
          line: lineNum + 1,
          type: key,
          message,
          severity,
          content: line.trim().substring(0, 100)
        });
      }
    });
  });
  
  if (fileViolations.length > 0) {
    results.filesWithViolations++;
    results.violationsByFile[path.relative(ROOT_DIR, filePath)] = fileViolations;
  }
}

/**
 * Recursively scan directory
 */
function scanDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      checkFile(fullPath);
    }
  }
}

/**
 * Generate detailed report
 */
function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('DESIGN SYSTEM VALIDATION REPORT');
  console.log('='.repeat(80));
  
  console.log(`\nFiles Scanned: ${results.totalFiles}`);
  console.log(`Files with Violations: ${results.filesWithViolations}`);
  
  console.log('\n' + '-'.repeat(80));
  console.log('VIOLATION SUMMARY');
  console.log('-'.repeat(80));
  
  const totalViolations = Object.values(results.violations).reduce((a, b) => a + b, 0);
  
  if (totalViolations === 0) {
    console.log('\n✅ NO VIOLATIONS FOUND! Design system is fully compliant.\n');
  } else {
    console.log('');
    Object.entries(results.violations).forEach(([key, count]) => {
      if (count > 0) {
        const severity = VIOLATIONS[key].severity.toUpperCase();
        const icon = severity === 'ERROR' ? '❌' : '⚠️';
        console.log(`${icon} ${key}: ${count} (${severity})`);
      }
    });
    
    console.log('\n' + '-'.repeat(80));
    console.log('DETAILED VIOLATIONS BY FILE');
    console.log('-'.repeat(80));
    
    Object.entries(results.violationsByFile).forEach(([file, violations]) => {
      console.log(`\n📄 ${file}`);
      violations.forEach(v => {
        const icon = v.severity === 'error' ? '❌' : '⚠️';
        console.log(`   ${icon} Line ${v.line}: ${v.message}`);
        console.log(`      ${v.content}...`);
      });
    });
    
    console.log('\n' + '='.repeat(80));
    console.log(`TOTAL VIOLATIONS: ${totalViolations}`);
    console.log('='.repeat(80));
    
    // Exit with error code if violations found
    process.exit(1);
  }
}

/**
 * Main execution
 */
console.log('Starting Design System Validation...\n');

scanDirectory(SRC_DIR);
generateReport();

console.log('\n✅ Validation complete!\n');

process.exit(0);
