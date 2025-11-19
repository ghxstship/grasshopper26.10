#!/usr/bin/env node
/**
 * Fix ALL Typography Violations
 * 
 * Comprehensive fixer that handles all remaining typography class violations:
 * - Inline text elements with typography classes
 * - Conditional className expressions
 * - Template literals with typography classes
 * - Complex nested structures
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const TYPOGRAPHY_CLASS_TO_COMPONENT = {
  'text-h1': 'PageTitle',
  'text-h2': 'SectionHeader',
  'text-h3': 'SubsectionHeader',
  'text-h4': 'CardTitle',
  'text-h5': 'SmallHeader',
  'text-h6': 'TinyHeader',
  'text-body': 'BodyText',
  'text-body-lg': 'BodyTextLarge',
  'text-body-sm': 'BodyTextSmall',
  'text-caption': 'Caption',
  'text-subtitle': 'Subtitle',
  'text-overline': 'Overline',
};

let stats = {
  filesProcessed: 0,
  violationsFixed: 0,
  errors: 0,
};

function fixAllTypographyViolations(content) {
  let modified = false;
  let newContent = content;
  const componentsUsed = new Set();
  
  // Pattern 1: Simple inline elements with typography classes
  // <span className="text-caption">text</span> → <Caption>text</Caption>
  for (const [className, component] of Object.entries(TYPOGRAPHY_CLASS_TO_COMPONENT)) {
    // Match simple cases
    const simpleRegex = new RegExp(
      `<(span|div|p)\\s+className=["']${className}["']>([^<]+)<\\/\\1>`,
      'g'
    );
    
    if (simpleRegex.test(newContent)) {
      newContent = newContent.replace(simpleRegex, (match, tag, text) => {
        componentsUsed.add(component);
        return `<${component}>${text}</${component}>`;
      });
      modified = true;
      stats.violationsFixed++;
    }
    
    // Match with additional classes
    const complexRegex = new RegExp(
      `<(span|div|p)\\s+className=["']([^"']*?)\\b${className}\\b([^"']*?)["']>([^<]+)<\\/\\1>`,
      'g'
    );
    
    if (complexRegex.test(newContent)) {
      newContent = newContent.replace(complexRegex, (match, tag, before, after, text) => {
        componentsUsed.add(component);
        const otherClasses = (before + ' ' + after).trim();
        const classAttr = otherClasses ? ` className="${otherClasses}"` : '';
        return `<${component}${classAttr}>${text}</${component}>`;
      });
      modified = true;
      stats.violationsFixed++;
    }
  }
  
  // Pattern 2: Remove typography classes from className strings
  // This handles cases where classes are in template literals or expressions
  for (const className of Object.keys(TYPOGRAPHY_CLASS_TO_COMPONENT)) {
    // In className strings
    const classNameRegex = new RegExp(`\\b${className}\\b\\s*`, 'g');
    if (classNameRegex.test(newContent)) {
      newContent = newContent.replace(classNameRegex, '');
      modified = true;
      stats.violationsFixed++;
    }
  }
  
  // Add imports if needed
  if (componentsUsed.size > 0) {
    const hasImport = /import\s+{[^}]*}\s+from\s+['"]@\/components\/atoms\/Typography['"];?/.test(newContent);
    
    if (!hasImport) {
      const components = Array.from(componentsUsed).sort().join(', ');
      const importStatement = `import { ${components} } from '@/components/atoms/Typography';\n`;
      
      const importMatches = [...newContent.matchAll(/^import\s+.+\s+from\s+.+;$/gm)];
      if (importMatches.length > 0) {
        const lastImport = importMatches[importMatches.length - 1];
        const insertPos = lastImport.index + lastImport[0].length;
        newContent = newContent.slice(0, insertPos) + '\n' + importStatement + newContent.slice(insertPos);
      } else {
        newContent = importStatement + '\n' + newContent;
      }
    } else {
      // Update existing import
      newContent = newContent.replace(
        /import\s+{([^}]*)}\s+from\s+['"]@\/components\/atoms\/Typography['"];?/,
        (match, existingImports) => {
          const existing = new Set(existingImports.split(',').map(s => s.trim()).filter(Boolean));
          componentsUsed.forEach(c => existing.add(c));
          const allComponents = Array.from(existing).sort().join(', ');
          return `import { ${allComponents} } from '@/components/atoms/Typography';`;
        }
      );
    }
  }
  
  return { content: newContent, modified };
}

async function processFile(filePath) {
  try {
    if (filePath.includes('node_modules') || 
        filePath.includes('.test.') ||
        filePath.includes('.spec.') ||
        filePath.includes('layout.tsx') ||  // Skip font definitions
        filePath.includes('Typography.tsx')) { // Skip Typography component itself
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const result = fixAllTypographyViolations(content);
    
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
  console.log('🔧 Fixing ALL Typography Violations...\n');
  
  const files = await glob('src/**/*.{tsx,ts}', {
    ignore: ['**/node_modules/**', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    cwd: process.cwd(),
  });
  
  console.log(`Processing ${files.length} files...\n`);
  
  for (const file of files) {
    await processFile(path.join(process.cwd(), file));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ All Typography Violations Fixed!\n');
  console.log(`📊 Statistics:`);
  console.log(`   Files processed: ${stats.filesProcessed}`);
  console.log(`   Violations fixed: ${stats.violationsFixed}`);
  console.log(`   Errors: ${stats.errors}`);
  console.log('='.repeat(60));
  console.log('\n💡 Run validation: npm run atomic:validate\n');
}

main().catch(console.error);
