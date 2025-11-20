#!/usr/bin/env node

/**
 * Fix Syntax Errors from Previous Remediation
 * Restores proper line breaks and formatting
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import { execSync } from 'child_process';

const SRC_DIR = '/Users/julianclarkson/Documents/Grasshopper26.10/src';

// Get files with TypeScript errors
function getFilesWithErrors() {
  try {
    execSync('npx tsc --noEmit --skipLibCheck 2>&1', { 
      cwd: '/Users/julianclarkson/Documents/Grasshopper26.10',
      encoding: 'utf8'
    });
    return [];
  } catch (error) {
    const output = error.stdout || error.message;
    const fileRegex = /src\/([^\(]+)\(/g;
    const files = new Set();
    let match;
    
    while ((match = fileRegex.exec(output)) !== null) {
      files.add(join('/Users/julianclarkson/Documents/Grasshopper26.10/src', match[1]));
    }
    
    return Array.from(files);
  }
}

// Fix concatenated lines
function fixFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Fix 'use client'; export pattern
    content = content.replace(/'use client';\s*export/g, "'use client';\n\nexport");
    
    // Fix export const runtime = 'edge'; import pattern
    content = content.replace(/export const runtime = 'edge';\s*import/g, "export const runtime = 'edge';\n\nimport");
    
    // Fix } catch pattern at line start
    content = content.replace(/^(\s*)\} catch/gm, '$1} catch');
    
    // Fix } finally pattern at line start  
    content = content.replace(/^(\s*)\} finally/gm, '$1} finally');
    
    // Fix concatenated export default function
    content = content.replace(/;\s*export default function/g, ';\n\nexport default function');
    
    // Fix long lines by adding proper breaks before JSX elements
    const lines = content.split('\n');
    const fixedLines = [];
    
    for (const line of lines) {
      if (line.length > 500 && line.includes('<')) {
        // Try to break at logical JSX boundaries
        let remaining = line;
        while (remaining.length > 120) {
          // Find a good break point (after a closing tag or before an opening tag)
          let breakPoint = -1;
          
          // Try to break after a closing tag
          for (let i = 100; i < Math.min(remaining.length, 120); i++) {
            if (remaining[i] === '>' && remaining[i-1] !== '-') {
              breakPoint = i + 1;
              break;
            }
          }
          
          // If no good break point, just break at 120
          if (breakPoint === -1) {
            breakPoint = 120;
          }
          
          fixedLines.push(remaining.substring(0, breakPoint));
          remaining = remaining.substring(breakPoint).trim();
        }
        
        if (remaining) {
          fixedLines.push(remaining);
        }
      } else {
        fixedLines.push(line);
      }
    }
    
    content = fixedLines.join('\n');
    
    // Clean up multiple blank lines
    content = content.replace(/\n{3,}/g, '\n\n');
    
    if (content !== originalContent) {
      writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error fixing ${relative(SRC_DIR, filePath)}: ${error.message}`);
    return false;
  }
}

// Main execution
console.log('🔧 Fixing syntax errors...\n');

const errorFiles = getFilesWithErrors();
console.log(`Found ${errorFiles.length} files with errors\n`);

let fixed = 0;

for (const file of errorFiles) {
  const relativePath = relative(SRC_DIR, file);
  if (fixFile(file)) {
    fixed++;
    console.log(`✅ Fixed: ${relativePath}`);
  }
}

console.log(`\n✨ Fixed ${fixed} files`);
