#!/usr/bin/env node
/**
 * Final Typography Cleanup
 * 
 * Removes redundant typography classes from Typography components:
 * <Caption className="text-caption"> → <Caption>
 * <SectionHeader className="text-h4"> → <SectionHeader>
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const TYPOGRAPHY_COMPONENTS = [
  'HeroTitle', 'DisplayTitle', 'PageTitle', 'SectionHeader', 'SubsectionHeader',
  'CardTitle', 'SmallHeader', 'TinyHeader', 'Subtitle', 'BodyText',
  'BodyTextLarge', 'BodyTextSmall', 'Caption', 'Metadata', 'Overline'
];

const TYPOGRAPHY_CLASSES = [
  'text-hero', 'text-display', 'text-h1', 'text-h2', 'text-h3', 'text-h4',
  'text-h5', 'text-h6', 'text-subtitle', 'text-body-lg', 'text-body',
  'text-body-sm', 'text-caption', 'text-overline'
];

let stats = {
  filesProcessed: 0,
  classesRemoved: 0,
  errors: 0,
};

function removeRedundantTypographyClasses(content) {
  let modified = false;
  let newContent = content;
  
  // For each Typography component
  for (const component of TYPOGRAPHY_COMPONENTS) {
    // Find all instances of the component with className
    const regex = new RegExp(
      `<${component}\\s+className=["']([^"']+)["']`,
      'g'
    );
    
    newContent = newContent.replace(regex, (match, classNames) => {
      let updatedClasses = classNames;
      let changed = false;
      
      // Remove all typography classes
      for (const typographyClass of TYPOGRAPHY_CLASSES) {
        const classRegex = new RegExp(`\\b${typographyClass}\\b\\s*`, 'g');
        if (classRegex.test(updatedClasses)) {
          updatedClasses = updatedClasses.replace(classRegex, '');
          changed = true;
          modified = true;
          stats.classesRemoved++;
        }
      }
      
      if (changed) {
        // Clean up extra spaces
        updatedClasses = updatedClasses.replace(/\s+/g, ' ').trim();
        
        if (updatedClasses) {
          return `<${component} className="${updatedClasses}"`;
        } else {
          // Remove className entirely if empty
          return `<${component}`;
        }
      }
      
      return match;
    });
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
    const result = removeRedundantTypographyClasses(content);
    
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
  console.log('🧹 Final Typography Cleanup...\n');
  
  const files = await glob('src/**/*.{tsx,ts}', {
    ignore: ['**/node_modules/**', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    cwd: process.cwd(),
  });
  
  console.log(`Processing ${files.length} files...\n`);
  
  for (const file of files) {
    await processFile(path.join(process.cwd(), file));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Typography Cleanup Complete!\n');
  console.log(`📊 Statistics:`);
  console.log(`   Files processed: ${stats.filesProcessed}`);
  console.log(`   Redundant classes removed: ${stats.classesRemoved}`);
  console.log(`   Errors: ${stats.errors}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
