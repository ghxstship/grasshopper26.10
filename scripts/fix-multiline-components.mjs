#!/usr/bin/env node
/**
 * Fix Multi-line Component Declarations
 * 
 * Handles cases where component opening tags span multiple lines:
 * <Card 
 *   variant="atlvs"
 * >
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

let stats = {
  filesProcessed: 0,
  cardsFixed: 0,
  buttonsFixed: 0,
  errors: 0,
};

function fixMultilineComponents(content, filePath) {
  let modified = false;
  let newContent = content;
  
  // Determine variant from file path
  let variant = 'default';
  if (filePath.includes('/atlvs/')) variant = 'atlvs';
  else if (filePath.includes('/compvss/')) variant = 'compvss';
  else if (filePath.includes('/gvteway/')) variant = 'gvteway';
  
  // Fix Card components - check if variant exists in next few lines
  const cardMatches = [...newContent.matchAll(/<Card\s*\n/g)];
  for (const match of cardMatches.reverse()) { // Reverse to maintain indices
    const startPos = match.index;
    const nextLines = newContent.slice(startPos, startPos + 200);
    
    // Check if variant already exists in the next few lines
    if (!nextLines.includes('variant=')) {
      // Insert variant on the same line
      newContent = newContent.slice(0, startPos) + 
                   `<Card variant="${variant}"\n` +
                   newContent.slice(startPos + match[0].length);
      modified = true;
      stats.cardsFixed++;
    }
  }
  
  // Fix Button components
  const buttonMatches = [...newContent.matchAll(/<Button\s*\n/g)];
  for (const match of buttonMatches.reverse()) {
    const startPos = match.index;
    const nextLines = newContent.slice(startPos, startPos + 200);
    
    if (!nextLines.includes('variant=')) {
      newContent = newContent.slice(0, startPos) +
                   `<Button variant="${variant}"\n` +
                   newContent.slice(startPos + match[0].length);
      modified = true;
      stats.buttonsFixed++;
    }
  }
  
  return { content: newContent, modified };
}

async function processFile(filePath) {
  try {
    if (filePath.includes('node_modules') || 
        filePath.includes('.test.') ||
        filePath.includes('.spec.')) {
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const result = fixMultilineComponents(content, filePath);
    
    if (result.modified) {
      fs.writeFileSync(filePath, result.content, 'utf-8');
      console.log(`✓ Fixed: ${path.relative(process.cwd(), filePath)}`);
    }
    
    stats.filesProcessed++;
    
  } catch (error) {
    console.error(`✗ Error: ${filePath}:`, error.message);
    stats.errors++;
  }
}

async function main() {
  console.log('🔧 Fixing Multi-line Component Declarations...\n');
  
  const files = await glob('src/**/*.{tsx,ts}', {
    ignore: ['**/node_modules/**', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    cwd: process.cwd(),
  });
  
  console.log(`Processing ${files.length} files...\n`);
  
  for (const file of files) {
    await processFile(path.join(process.cwd(), file));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Multi-line Components Fixed!\n');
  console.log(`📊 Statistics:`);
  console.log(`   Files processed: ${stats.filesProcessed}`);
  console.log(`   Cards fixed: ${stats.cardsFixed}`);
  console.log(`   Buttons fixed: ${stats.buttonsFixed}`);
  console.log(`   Errors: ${stats.errors}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
