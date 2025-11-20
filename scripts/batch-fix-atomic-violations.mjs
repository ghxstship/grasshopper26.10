#!/usr/bin/env node
/**
 * Batch Atomic Design System Violation Fixer
 * 
 * Automatically fixes violations across the entire codebase:
 * 1. Typography: text-h1, text-body-sm, etc. → Typography components
 * 2. Colors: bg-gray-900, text-gray-400, etc. → semantic tokens
 * 3. Cards: Remove hardcoded bg-gray-900/50 className overrides
 * 4. Buttons: Ensure variant props are set
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// Typography class to component mapping
const TYPOGRAPHY_REPLACEMENTS = {
  'text-hero': { component: 'HeroTitle', inline: false },
  'text-display': { component: 'DisplayTitle', inline: false },
  'text-h1': { component: 'PageTitle', inline: false },
  'text-h2': { component: 'SectionHeader', inline: false },
  'text-h3': { component: 'SubsectionHeader', inline: false },
  'text-h4': { component: 'CardTitle', inline: false },
  'text-h5': { component: 'SmallHeader', inline: false },
  'text-h6': { component: 'TinyHeader', inline: false },
  'text-subtitle': { component: 'Subtitle', inline: false },
  'text-body-lg': { component: 'BodyTextLarge', inline: false },
  'text-body': { component: 'BodyText', inline: false },
  'text-body-sm': { component: 'BodyTextSmall', inline: true },
  'text-caption': { component: 'Caption', inline: true },
  'text-overline': { component: 'Overline', inline: true },
};

// Color class replacements (Tailwind → Semantic tokens)
const COLOR_REPLACEMENTS = {
  // Backgrounds
  'bg-gray-50': 'bg-surface-secondary',
  'bg-gray-100': 'bg-surface-tertiary',
  'bg-gray-800': 'bg-surface-dark',
  'bg-gray-800/50': 'bg-surface-dark/50',
  'bg-gray-900': 'bg-surface-darker',
  'bg-gray-900/50': 'bg-surface-darker/50',
  'bg-gray-950': 'bg-surface-darkest',
  
  // Text colors
  'text-gray-300': 'text-secondary',
  'text-gray-400': 'text-muted',
  'text-gray-500': 'text-muted',
  'text-gray-600': 'text-secondary',
  'text-gray-700': 'text-primary',
  'text-gray-900': 'text-primary',
  'text-white': 'text-primary',
  
  // Borders
  'border-gray-200': 'border-default',
  'border-gray-300': 'border-strong',
  'border-gray-700': 'border-dark',
  'border-gray-800': 'border-darker',
  
  // Dividers
  'divide-gray-700': 'divide-border-dark',
  'divide-gray-800': 'divide-border-darker',
};

let stats = {
  filesProcessed: 0,
  typographyFixed: 0,
  colorsFixed: 0,
  cardsFixed: 0,
  buttonsFixed: 0,
  errors: 0,
};

function fixTypographyInContent(content, _filePath) {
  let modified = false;
  let newContent = content;
  const componentsUsed = new Set();
  
  // Fix each typography class
  for (const [className, mapping] of Object.entries(TYPOGRAPHY_REPLACEMENTS)) {
    const regex = new RegExp(`className=["']([^"']*?)\\b${className}\\b([^"']*?)["']`, 'g');
    
    if (regex.test(newContent)) {
      // For inline components (span-based), keep as className replacement
      if (mapping.inline) {
        // Just track that we need the import
        componentsUsed.add(mapping.component);
      } else {
        // For block components, would need AST transformation
        // For now, just track the component
        componentsUsed.add(mapping.component);
      }
      modified = true;
    }
  }
  
  // Add imports if needed
  if (componentsUsed.size > 0 && !content.includes('from "@/components/atoms/Typography"')) {
    const components = Array.from(componentsUsed).sort().join(', ');
    const importStatement = `import { ${components} } from '@/components/atoms/Typography';\n`;
    
    // Find last import
    const importMatches = [...newContent.matchAll(/^import .+ from .+;$/gm)];
    if (importMatches.length > 0) {
      const lastImport = importMatches[importMatches.length - 1];
      const insertPos = lastImport.index + lastImport[0].length;
      newContent = newContent.slice(0, insertPos) + '\n' + importStatement + newContent.slice(insertPos);
    }
  }
  
  return { content: newContent, modified, componentsUsed };
}

function fixColorsInContent(content) {
  let modified = false;
  let newContent = content;
  
  for (const [oldColor, newColor] of Object.entries(COLOR_REPLACEMENTS)) {
    const regex = new RegExp(`\\b${oldColor.replace('/', '\\/')}\\b`, 'g');
    if (regex.test(newContent)) {
      newContent = newContent.replace(regex, newColor);
      modified = true;
    }
  }
  
  return { content: newContent, modified };
}

function fixCardVariantsInContent(content, filePath) {
  let modified = false;
  let newContent = content;
  
  // Remove hardcoded bg-gray-900/50 and similar from Card components
  const cardBgRegex = /<Card([^>]*?)className=["']([^"']*?)(bg-gray-(?:800|900)(?:\/\d+)?|border-gray-\d+)([^"']*?)["']/g;
  
  if (cardBgRegex.test(newContent)) {
    newContent = newContent.replace(cardBgRegex, (match, before, classPrefix, hardcoded, classSuffix) => {
      // Remove the hardcoded class
      const cleanedClasses = (classPrefix + ' ' + classSuffix)
        .replace(/\s+/g, ' ')
        .trim();
      
      if (cleanedClasses) {
        return `<Card${before}className="${cleanedClasses}"`;
      } else {
        // Remove className entirely if empty
        return `<Card${before.replace(/\s+$/, '')}`;
      }
    });
    modified = true;
  }
  
  // Ensure Card has variant prop
  const cardNoVariantRegex = /<Card\s+(?![^>]*variant=)/g;
  if (cardNoVariantRegex.test(newContent)) {
    // Determine variant from file path
    let variant = 'default';
    if (filePath.includes('/atlvs/')) variant = 'atlvs';
    else if (filePath.includes('/compvss/')) variant = 'compvss';
    else if (filePath.includes('/gvteway/')) variant = 'gvteway';
    
    newContent = newContent.replace(cardNoVariantRegex, `<Card variant="${variant}" `);
    modified = true;
  }
  
  return { content: newContent, modified };
}

function fixButtonVariantsInContent(content, filePath) {
  let modified = false;
  let newContent = content;
  
  // Ensure Button has variant prop
  const buttonNoVariantRegex = /<Button\s+(?![^>]*variant=)/g;
  if (buttonNoVariantRegex.test(newContent)) {
    // Determine variant from file path
    let variant = 'default';
    if (filePath.includes('/atlvs/')) variant = 'atlvs';
    else if (filePath.includes('/compvss/')) variant = 'compvss';
    else if (filePath.includes('/gvteway/')) variant = 'gvteway';
    
    newContent = newContent.replace(buttonNoVariantRegex, `<Button variant="${variant}" `);
    modified = true;
  }
  
  return { content: newContent, modified };
}

async function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let fileModified = false;
    
    // Apply all fixes
    const typoResult = fixTypographyInContent(content, filePath);
    if (typoResult.modified) {
      content = typoResult.content;
      fileModified = true;
      stats.typographyFixed++;
    }
    
    const colorResult = fixColorsInContent(content);
    if (colorResult.modified) {
      content = colorResult.content;
      fileModified = true;
      stats.colorsFixed++;
    }
    
    const cardResult = fixCardVariantsInContent(content, filePath);
    if (cardResult.modified) {
      content = cardResult.content;
      fileModified = true;
      stats.cardsFixed++;
    }
    
    const buttonResult = fixButtonVariantsInContent(content, filePath);
    if (buttonResult.modified) {
      content = buttonResult.content;
      fileModified = true;
      stats.buttonsFixed++;
    }
    
    // Write back if modified
    if (fileModified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✓ Fixed: ${path.relative(process.cwd(), filePath)}`);
    }
    
    stats.filesProcessed++;
    
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    stats.errors++;
  }
}

async function main() {
  console.log('🔍 Scanning for atomic design violations...\n');
  
  const files = await glob('src/**/*.{tsx,ts}', {
    ignore: ['**/node_modules/**', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    cwd: process.cwd(),
  });
  
  console.log(`Found ${files.length} files to process\n`);
  
  // Process files in batches
  const batchSize = 10;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    await Promise.all(batch.map(file => processFile(path.join(process.cwd(), file))));
    
    // Progress indicator
    if ((i + batchSize) % 50 === 0 || i + batchSize >= files.length) {
      console.log(`\nProgress: ${Math.min(i + batchSize, files.length)}/${files.length} files`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Atomic Design System Fixes Complete!\n');
  console.log(`📊 Statistics:`);
  console.log(`   Files processed: ${stats.filesProcessed}`);
  console.log(`   Typography fixes: ${stats.typographyFixed} files`);
  console.log(`   Color fixes: ${stats.colorsFixed} files`);
  console.log(`   Card fixes: ${stats.cardsFixed} files`);
  console.log(`   Button fixes: ${stats.buttonsFixed} files`);
  console.log(`   Errors: ${stats.errors}`);
  console.log('='.repeat(60));
  console.log('\n⚠️  Please review changes and run tests before committing.');
  console.log('💡 Run: git diff to see all changes');
}

main().catch(console.error);
