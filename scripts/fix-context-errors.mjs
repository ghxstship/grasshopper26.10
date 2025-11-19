#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Get all files with TS2448 errors
const output = execSync('npx tsc --noEmit 2>&1', { encoding: 'utf-8' });
const lines = output.split('\n');

const filesWithErrors = new Set();
for (const line of lines) {
  if (line.includes('TS2448') && line.includes('context')) {
    const match = line.match(/(src\/app\/api\/[^(]+\.ts)/);
    if (match) {
      filesWithErrors.add(match[1]);
    }
  }
}

console.log(`Found ${filesWithErrors.size} files with context-before-declaration errors`);

let fixedCount = 0;
for (const filePath of filesWithErrors) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Find all functions in the file
    const functions = [];
    let currentFunction = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect function start
      if (line.match(/^export async function (GET|POST|PUT|PATCH|DELETE)\(/)) {
        if (currentFunction) {
          currentFunction.end = i - 1;
          functions.push(currentFunction);
        }
        currentFunction = {
          name: line.match(/(GET|POST|PUT|PATCH|DELETE)/)[1],
          start: i,
          end: null
        };
      }
    }
    
    if (currentFunction) {
      currentFunction.end = lines.length - 1;
      functions.push(currentFunction);
    }
    
    // Fix each function
    let modified = false;
    for (const func of functions) {
      const funcLines = lines.slice(func.start, func.end + 1);
      
      // Find where context is used and where it's declared
      let contextUseLine = -1;
      let contextDeclLine = -1;
      let rateLimitBlock = { start: -1, end: -1 };
      
      for (let i = 0; i < funcLines.length; i++) {
        const line = funcLines[i];
        
        if (line.includes('context.userId') && contextUseLine === -1) {
          contextUseLine = i;
          // Find the rate limit block
          let j = i;
          while (j >= 0 && !funcLines[j].trim().startsWith('if (')) {
            j--;
          }
          rateLimitBlock.start = j;
          j = i;
          while (j < funcLines.length && !funcLines[j].includes(')')) {
            j++;
          }
          while (j < funcLines.length && !funcLines[j].includes('}')) {
            j++;
          }
          rateLimitBlock.end = j;
        }
        
        if (line.includes('const context = await validateRequest') && contextDeclLine === -1) {
          contextDeclLine = i;
        }
      }
      
      // If context is used before declaration, move the declaration up
      if (contextUseLine !== -1 && contextDeclLine !== -1 && contextUseLine < contextDeclLine) {
        // Extract context declaration and requireAuth
        const contextDecl = funcLines[contextDeclLine];
        let requireAuthLine = '';
        if (contextDeclLine + 1 < funcLines.length && funcLines[contextDeclLine + 1].includes('requireAuth')) {
          requireAuthLine = funcLines[contextDeclLine + 1];
        }
        
        // Remove from old position
        if (requireAuthLine) {
          funcLines.splice(contextDeclLine, 2);
        } else {
          funcLines.splice(contextDeclLine, 1);
        }
        
        // Find insertion point (after try { and before rate limiting)
        let insertPos = 1; // After "try {"
        while (insertPos < funcLines.length && funcLines[insertPos].trim() === '') {
          insertPos++;
        }
        
        // Insert at new position
        const toInsert = requireAuthLine ? [contextDecl, requireAuthLine, ''] : [contextDecl, ''];
        funcLines.splice(insertPos, 0, ...toInsert);
        
        // Update lines array
        for (let i = 0; i < funcLines.length; i++) {
          lines[func.start + i] = funcLines[i];
        }
        
        modified = true;
      }
    }
    
    if (modified) {
      writeFileSync(filePath, lines.join('\n'));
      fixedCount++;
      console.log(`✓ Fixed ${filePath}`);
    }
  } catch (error) {
    console.error(`✗ Error fixing ${filePath}:`, error.message);
  }
}

console.log(`\nFixed ${fixedCount} files`);
