#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

/**
 * Script to fix implicit any type errors by adding type annotations
 * This handles common patterns like .map(), .filter(), .reduce() callbacks
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get list of files with implicit any errors
const output = execSync('npx tsc --noEmit 2>&1 | grep "implicitly has an \'any\' type"', {
  encoding: 'utf-8',
  cwd: process.cwd()
});

const errors = output.split('\n').filter(Boolean);
const fileErrors = new Map();

// Parse errors and group by file
errors.forEach(line => {
  const match = line.match(/^(.+?)\((\d+),(\d+)\):/);
  if (match) {
    const [, filePath, lineNum] = match;
    if (!fileErrors.has(filePath)) {
      fileErrors.set(filePath, []);
    }
    fileErrors.get(filePath).push(parseInt(lineNum));
  }
});

console.log(`Found ${fileErrors.size} files with implicit any errors`);
console.log(`Total errors: ${errors.length}`);

// For now, just report - actual fixes need to be done carefully per file
fileErrors.forEach((lines, file) => {
  console.log(`${file}: ${lines.length} errors on lines ${lines.slice(0, 5).join(', ')}${lines.length > 5 ? '...' : ''}`);
});

console.log('\nTo fix these, add proper type annotations to callback parameters.');
console.log('Example: array.map(item => ...) → array.map((item: Type) => ...)');
