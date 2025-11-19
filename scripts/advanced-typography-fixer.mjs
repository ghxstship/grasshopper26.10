#!/usr/bin/env node
/**
 * Advanced Typography Fixer
 * 
 * Uses regex patterns to replace typography classes with Typography components
 * Handles complex cases like:
 * - <div className="text-h1"> → <PageTitle>
 * - <span className="text-caption text-gray-400"> → <Caption className="text-muted">
 * - <p className="text-body-sm mb-4"> → <BodyTextSmall className="mb-4">
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const TYPOGRAPHY_MAPPINGS = {
  'text-hero': { component: 'HeroTitle', tag: 'h1' },
  'text-display': { component: 'DisplayTitle', tag: 'h1' },
  'text-h1': { component: 'PageTitle', tag: 'h1' },
  'text-h2': { component: 'SectionHeader', tag: 'h2' },
  'text-h3': { component: 'SubsectionHeader', tag: 'h3' },
  'text-h4': { component: 'CardTitle', tag: 'h4' },
  'text-h5': { component: 'SmallHeader', tag: 'h5' },
  'text-h6': { component: 'TinyHeader', tag: 'h6' },
  'text-subtitle': { component: 'Subtitle', tag: 'p' },
  'text-body-lg': { component: 'BodyTextLarge', tag: 'p' },
  'text-body': { component: 'BodyText', tag: 'p' },
  'text-body-sm': { component: 'BodyTextSmall', tag: 'p' },
  'text-caption': { component: 'Caption', tag: 'span' },
  'text-overline': { component: 'Overline', tag: 'span' },
};

let stats = {
  filesProcessed: 0,
  replacements: 0,
  errors: 0,
};

function fixTypographyClasses(content) {
  let modified = false;
  let newContent = content;
  const componentsUsed = new Set();
  
  // Process each typography class
  for (const [className, mapping] of Object.entries(TYPOGRAPHY_MAPPINGS)) {
    // Pattern 1: Simple elements with only typography class
    // <div className="text-h1">content</div> → <PageTitle>content</PageTitle>
    const simplePattern = new RegExp(
      `<(div|span|p|h[1-6])\\s+className=["']${className}["']([^>]*)>([\\s\\S]*?)<\\/\\1>`,
      'g'
    );
    
    if (simplePattern.test(newContent)) {
      newContent = newContent.replace(simplePattern, (match, tag, attrs, content) => {
        componentsUsed.add(mapping.component);
        return `<${mapping.component}${attrs}>${content}</${mapping.component}>`;
      });
      modified = true;
    }
    
    // Pattern 2: Elements with typography class + other classes
    // <div className="text-h1 mb-4 text-center">content</div> → <PageTitle className="mb-4 text-center">content</PageTitle>
    const complexPattern = new RegExp(
      `<(div|span|p|h[1-6])\\s+className=["']([^"']*?)\\b${className}\\b([^"']*?)["']([^>]*)>([\\s\\S]*?)<\\/\\1>`,
      'g'
    );
    
    if (complexPattern.test(newContent)) {
      newContent = newContent.replace(complexPattern, (match, tag, before, after, attrs, content) => {
        componentsUsed.add(mapping.component);
        const otherClasses = (before + ' ' + after).trim();
        const classAttr = otherClasses ? ` className="${otherClasses}"` : '';
        return `<${mapping.component}${classAttr}${attrs}>${content}</${mapping.component}>`;
      });
      modified = true;
    }
    
    // Pattern 3: Self-closing or inline elements
    // <span className="text-caption">text</span> → <Caption>text</Caption>
    const inlinePattern = new RegExp(
      `<(span|div)\\s+className=["']([^"']*?)\\b${className}\\b([^"']*?)["']([^>]*)>([^<]+)<\\/\\1>`,
      'g'
    );
    
    if (inlinePattern.test(newContent)) {
      newContent = newContent.replace(inlinePattern, (match, tag, before, after, attrs, text) => {
        componentsUsed.add(mapping.component);
        const otherClasses = (before + ' ' + after).trim();
        const classAttr = otherClasses ? ` className="${otherClasses}"` : '';
        return `<${mapping.component}${classAttr}${attrs}>${text}</${mapping.component}>`;
      });
      modified = true;
    }
  }
  
  // Add imports if components were used
  if (componentsUsed.size > 0) {
    const hasImport = /import\s+{[^}]*}\s+from\s+['"]@\/components\/atoms\/Typography['"];?/.test(newContent);
    
    if (!hasImport) {
      const components = Array.from(componentsUsed).sort().join(', ');
      const importStatement = `import { ${components} } from '@/components/atoms/Typography';\n`;
      
      // Find last import
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
  
  return { content: newContent, modified, componentsUsed };
}

async function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const result = fixTypographyClasses(content);
    
    if (result.modified) {
      fs.writeFileSync(filePath, result.content, 'utf-8');
      stats.replacements++;
      console.log(`✓ Fixed: ${path.relative(process.cwd(), filePath)} (${result.componentsUsed.size} components)`);
    }
    
    stats.filesProcessed++;
  } catch (error) {
    console.error(`✗ Error: ${filePath}:`, error.message);
    stats.errors++;
  }
}

async function main() {
  console.log('🔧 Advanced Typography Fixer\n');
  
  const files = await glob('src/**/*.{tsx,ts}', {
    ignore: ['**/node_modules/**', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    cwd: process.cwd(),
  });
  
  console.log(`Processing ${files.length} files...\n`);
  
  for (const file of files) {
    await processFile(path.join(process.cwd(), file));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Typography Fixes Complete!\n');
  console.log(`📊 Statistics:`);
  console.log(`   Files processed: ${stats.filesProcessed}`);
  console.log(`   Files modified: ${stats.replacements}`);
  console.log(`   Errors: ${stats.errors}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
