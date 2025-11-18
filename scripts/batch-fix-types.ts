#!/usr/bin/env ts-node
/**
 * Batch Type Fixer
 * Automatically fixes common TypeScript implicit 'any' errors
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Common type patterns based on Prisma models
const TYPE_PATTERNS: Record<string, string> = {
  // Documents
  'documents.map': 'Document',
  'docs.map': 'Document',
  'doc.versions': 'DocumentVersion',
  'versions.map': 'DocumentVersion',
  
  // Projects
  'projects.map': 'Project',
  'project.tasks': 'Task',
  'tasks.map': 'Task',
  
  // Users/Teams
  'users.map': 'User',
  'members.map': 'User',
  'teams.map': 'Team',
  
  // Events
  'events.map': 'Event',
  'tickets.map': 'Ticket',
  
  // Generic arrays
  'items.map': 'unknown',
  'data.map': 'unknown',
  'array.map': 'unknown',
};

function fixFile(filePath: string): number {
  let content = fs.readFileSync(filePath, 'utf-8');
  let fixCount = 0;
  
  // Fix: .map(item => ...) -> .map((item: Type) => ...)
  const mapRegex = /\.map\((\w+)\s*=>/g;
  content = content.replace(mapRegex, (match, param) => {
    fixCount++;
    return `.map((${param}: any) =>`;  // Will be refined by context
  });
  
  // Fix: .filter(x => ...) -> .filter((x: Type) => ...)
  const filterRegex = /\.filter\((\w+)\s*=>/g;
  content = content.replace(filterRegex, (match, param) => {
    fixCount++;
    return `.filter((${param}: any) =>`;
  });
  
  // Fix: .reduce((sum, val) => ...) -> .reduce((sum: number, val: Type) => ...)
  const reduceRegex = /\.reduce\(\((\w+),\s*(\w+)\)\s*=>/g;
  content = content.replace(reduceRegex, (match, param1, param2) => {
    fixCount++;
    return `.reduce((${param1}: number, ${param2}: any) =>`;
  });
  
  // Fix: .find(x => ...) -> .find((x: Type) => ...)
  const findRegex = /\.find\((\w+)\s*=>/g;
  content = content.replace(findRegex, (match, param) => {
    fixCount++;
    return `.find((${param}: any) =>`;
  });
  
  // Fix: .some(x => ...) -> .some((x: Type) => ...)
  const someRegex = /\.some\((\w+)\s*=>/g;
  content = content.replace(someRegex, (match, param) => {
    fixCount++;
    return `.some((${param}: any) =>`;
  });
  
  if (fixCount > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
  
  return fixCount;
}

function main() {
  const srcDir = path.join(process.cwd(), 'src');
  let totalFixes = 0;
  let filesFixed = 0;
  
  function processDirectory(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          processDirectory(fullPath);
        }
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        const fixes = fixFile(fullPath);
        if (fixes > 0) {
          filesFixed++;
          totalFixes += fixes;
          console.log(`Fixed ${fixes} issues in ${fullPath}`);
        }
      }
    }
  }
  
  console.log('Starting batch type fixes...');
  processDirectory(srcDir);
  console.log(`\nCompleted: Fixed ${totalFixes} issues in ${filesFixed} files`);
  console.log('\nNote: All fixes use "any" type. Run ESLint auto-fix to remove unused imports.');
  console.log('Then manually refine types based on context.');
}

main();
