#!/usr/bin/env node

/**
 * Button Validation Script
 * Validates that all buttons in the UI are properly implemented with handlers
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, relative } from 'path';

const ROOT_DIR = process.cwd();
const SRC_DIR = join(ROOT_DIR, 'src');
const REPORT_FILE = join(ROOT_DIR, 'BUTTON_VALIDATION_REPORT.json');

// Button patterns to search for
const BUTTON_PATTERNS = [
  /<Button\s+/g,
  /<button\s+/g,
  /IconButton/g,
];

// Handler patterns
const HANDLER_PATTERNS = [
  /onClick\s*=\s*\{/,
  /onSubmit\s*=\s*\{/,
  /href\s*=\s*["'`]/,
  /to\s*=\s*["'`]/,
  /type\s*=\s*["']submit["']/,
];

const results = {
  timestamp: new Date().toISOString(),
  summary: {
    totalFiles: 0,
    filesWithButtons: 0,
    totalButtons: 0,
    buttonsWithHandlers: 0,
    buttonsWithoutHandlers: 0,
    byPlatform: {
      atlvs: { files: 0, buttons: 0, withHandlers: 0, withoutHandlers: 0 },
      compvss: { files: 0, buttons: 0, withHandlers: 0, withoutHandlers: 0 },
      gvteway: { files: 0, buttons: 0, withHandlers: 0, withoutHandlers: 0 },
      shared: { files: 0, buttons: 0, withHandlers: 0, withoutHandlers: 0 },
    },
  },
  files: [],
  issues: [],
};

function getPlatform(filePath) {
  if (filePath.includes('/atlvs/')) return 'atlvs';
  if (filePath.includes('/compvss/')) return 'compvss';
  if (filePath.includes('/gvteway/')) return 'gvteway';
  return 'shared';
}

function getAllFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        getAllFiles(filePath, fileList);
      }
    } else if (file.match(/\.(tsx|jsx)$/)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function extractButtonContext(content, index, contextSize = 200) {
  const start = Math.max(0, index - contextSize);
  const end = Math.min(content.length, index + contextSize);
  return content.substring(start, end).replace(/\n/g, ' ').trim();
}

function hasHandler(buttonContext) {
  return HANDLER_PATTERNS.some(pattern => pattern.test(buttonContext));
}

function analyzeFile(filePath) {
  results.summary.totalFiles++;
  
  const content = readFileSync(filePath, 'utf-8');
  const relativePath = relative(ROOT_DIR, filePath);
  const platform = getPlatform(relativePath);
  
  const buttons = [];
  let hasButtons = false;

  // Find all button instances
  BUTTON_PATTERNS.forEach(pattern => {
    const matches = [...content.matchAll(pattern)];
    matches.forEach(match => {
      hasButtons = true;
      const index = match.index;
      const context = extractButtonContext(content, index);
      const hasHandlerAttached = hasHandler(context);
      
      // Get line number
      const lineNumber = content.substring(0, index).split('\n').length;
      
      buttons.push({
        line: lineNumber,
        type: match[0].trim(),
        context: context.substring(0, 150) + '...',
        hasHandler: hasHandlerAttached,
      });

      results.summary.totalButtons++;
      results.summary.byPlatform[platform].buttons++;

      if (hasHandlerAttached) {
        results.summary.buttonsWithHandlers++;
        results.summary.byPlatform[platform].withHandlers++;
      } else {
        results.summary.buttonsWithoutHandlers++;
        results.summary.byPlatform[platform].withoutHandlers++;
        
        results.issues.push({
          file: relativePath,
          line: lineNumber,
          platform,
          issue: 'Button without handler',
          context: context.substring(0, 100),
        });
      }
    });
  });

  if (hasButtons) {
    results.summary.filesWithButtons++;
    results.summary.byPlatform[platform].files++;
    
    results.files.push({
      path: relativePath,
      platform,
      buttonCount: buttons.length,
      buttons,
    });
  }
}

function generateReport() {
  console.log('\n🔍 Button Validation Report\n');
  console.log('=' .repeat(80));
  
  console.log('\n📊 Summary:');
  console.log(`  Total Files Scanned: ${results.summary.totalFiles}`);
  console.log(`  Files with Buttons: ${results.summary.filesWithButtons}`);
  console.log(`  Total Buttons: ${results.summary.totalButtons}`);
  console.log(`  ✅ Buttons with Handlers: ${results.summary.buttonsWithHandlers}`);
  console.log(`  ❌ Buttons without Handlers: ${results.summary.buttonsWithoutHandlers}`);
  
  const percentage = results.summary.totalButtons > 0 
    ? ((results.summary.buttonsWithHandlers / results.summary.totalButtons) * 100).toFixed(2)
    : 0;
  console.log(`  📈 Implementation Rate: ${percentage}%`);

  console.log('\n🎯 By Platform:');
  Object.entries(results.summary.byPlatform).forEach(([platform, stats]) => {
    if (stats.buttons > 0) {
      const platformPercentage = ((stats.withHandlers / stats.buttons) * 100).toFixed(2);
      console.log(`\n  ${platform.toUpperCase()}:`);
      console.log(`    Files: ${stats.files}`);
      console.log(`    Total Buttons: ${stats.buttons}`);
      console.log(`    With Handlers: ${stats.withHandlers}`);
      console.log(`    Without Handlers: ${stats.withoutHandlers}`);
      console.log(`    Implementation Rate: ${platformPercentage}%`);
    }
  });

  if (results.issues.length > 0) {
    console.log('\n⚠️  Issues Found:');
    console.log(`  ${results.issues.length} buttons without handlers\n`);
    
    // Group by platform
    const issuesByPlatform = results.issues.reduce((acc, issue) => {
      if (!acc[issue.platform]) acc[issue.platform] = [];
      acc[issue.platform].push(issue);
      return acc;
    }, {});

    Object.entries(issuesByPlatform).forEach(([platform, issues]) => {
      console.log(`\n  ${platform.toUpperCase()} (${issues.length} issues):`);
      issues.slice(0, 10).forEach(issue => {
        console.log(`    - ${issue.file}:${issue.line}`);
      });
      if (issues.length > 10) {
        console.log(`    ... and ${issues.length - 10} more`);
      }
    });
  } else {
    console.log('\n✅ All buttons have handlers!');
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\n📄 Full report saved to: ${relative(ROOT_DIR, REPORT_FILE)}\n`);
}

// Main execution
console.log('🚀 Starting button validation...\n');

const files = getAllFiles(SRC_DIR);
console.log(`Found ${files.length} component files to analyze\n`);

files.forEach(file => {
  try {
    analyzeFile(file);
  } catch (error) {
    console.error(`Error analyzing ${file}:`, error.message);
  }
});

// Write detailed report
writeFileSync(REPORT_FILE, JSON.stringify(results, null, 2));

// Generate console report
generateReport();

// Exit with error code if issues found
process.exit(results.summary.buttonsWithoutHandlers > 0 ? 1 : 0);
