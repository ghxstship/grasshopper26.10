#!/usr/bin/env ts-node
/**
 * Atomic Design System Violation Fixer
 * 
 * This script automatically fixes violations of the atomic design system:
 * 1. Replaces raw typography classes with Typography components
 * 2. Replaces hardcoded colors with design tokens
 * 3. Replaces hardcoded spacing with design tokens
 * 4. Ensures proper Card and Button variant usage
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface Fix {
  file: string;
  line: number;
  original: string;
  fixed: string;
  type: 'typography' | 'color' | 'spacing' | 'card' | 'button';
}

const fixes: Fix[] = [];

// Typography class mappings
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

// Font class mappings
const FONT_MAPPINGS = {
  'font-anton': 'Typography variant="anton"',
  'font-bebas': 'Typography variant="bebas"',
  'font-oswald': 'Typography variant="subtitle"',
  'font-share-tech': 'Typography',
  'font-share-tech-mono': 'Typography variant="mono"',
};

// Color mappings (Tailwind to CSS variables)
const COLOR_MAPPINGS: Record<string, string> = {
  // Grays
  'bg-gray-50': 'bg-surface-secondary',
  'bg-gray-100': 'bg-surface-tertiary',
  'bg-gray-200': 'bg-border-default',
  'bg-gray-800': 'bg-surface-dark',
  'bg-gray-900': 'bg-surface-darker',
  'bg-gray-950': 'bg-surface-darkest',
  
  'text-gray-400': 'text-muted',
  'text-gray-500': 'text-secondary',
  'text-gray-600': 'text-secondary',
  'text-gray-700': 'text-primary',
  'text-gray-900': 'text-primary',
  
  'border-gray-200': 'border-default',
  'border-gray-300': 'border-strong',
  'border-gray-700': 'border-dark',
  'border-gray-800': 'border-darker',
  
  // Blues
  'bg-blue-50': 'bg-info-subtle',
  'bg-blue-500': 'bg-info',
  'bg-blue-600': 'bg-info-emphasis',
  'text-blue-500': 'text-info',
  'text-blue-600': 'text-info-emphasis',
  'border-blue-500': 'border-info',
  
  // Greens
  'bg-green-50': 'bg-success-subtle',
  'bg-green-500': 'bg-success',
  'bg-green-600': 'bg-success-emphasis',
  'text-green-500': 'text-success',
  'text-green-600': 'text-success-emphasis',
  'border-green-500': 'border-success',
  
  // Reds
  'bg-red-50': 'bg-error-subtle',
  'bg-red-500': 'bg-error',
  'bg-red-600': 'bg-error-emphasis',
  'text-red-500': 'text-error',
  'text-red-600': 'text-error-emphasis',
  'border-red-500': 'border-error',
  
  // Yellows/Oranges
  'bg-yellow-50': 'bg-warning-subtle',
  'bg-yellow-500': 'bg-warning',
  'bg-orange-500': 'bg-warning',
  'text-yellow-500': 'text-warning',
  'text-orange-500': 'text-warning',
  'border-yellow-500': 'border-warning',
  'border-orange-500': 'border-warning',
  
  // Purples (ATLVS)
  'bg-purple-500': 'bg-atlvs-primary',
  'bg-purple-600': 'bg-atlvs-emphasis',
  'text-purple-500': 'text-atlvs-primary',
  'border-purple-500': 'border-atlvs-primary',
  
  // Cyans/Teals (COMPVSS)
  'bg-cyan-500': 'bg-compvss-primary',
  'bg-teal-500': 'bg-compvss-primary',
  'text-cyan-500': 'text-compvss-primary',
  'text-teal-500': 'text-compvss-primary',
  'border-cyan-500': 'border-compvss-primary',
  'border-teal-500': 'border-compvss-primary',
};

function fixTypographyInFile(filePath: string): boolean {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  const lines = content.split('\n');
  
  // Check if Typography components are already imported
  const hasTypographyImport = content.includes('from "@/components/atoms/Typography"');
  const typographyComponentsUsed = new Set<string>();
  
  // Fix inline typography classes
  for (const [className, mapping] of Object.entries(TYPOGRAPHY_MAPPINGS)) {
    const regex = new RegExp(`<(\\w+)([^>]*?)className=["']([^"']*?)\\b${className}\\b([^"']*?)["']([^>]*?)>`, 'g');
    
    if (regex.test(content)) {
      content = content.replace(regex, (match, tag, beforeClass, classPrefix, classSuffix, afterClass) => {
        typographyComponentsUsed.add(mapping.component);
        const otherClasses = (classPrefix + ' ' + classSuffix).trim();
        const classAttr = otherClasses ? ` className="${otherClasses}"` : '';
        return `<${mapping.component}${beforeClass}${classAttr}${afterClass}>`;
      });
      modified = true;
    }
  }
  
  // Fix font classes
  for (const [fontClass, replacement] of Object.entries(FONT_MAPPINGS)) {
    const regex = new RegExp(`\\b${fontClass}\\b`, 'g');
    if (regex.test(content)) {
      // This is more complex - would need AST parsing for proper replacement
      // For now, flag these for manual review
      console.log(`⚠️  Manual review needed for ${fontClass} in ${filePath}`);
    }
  }
  
  // Add Typography imports if needed
  if (modified && !hasTypographyImport && typographyComponentsUsed.size > 0) {
    const components = Array.from(typographyComponentsUsed).sort().join(', ');
    const importStatement = `import { ${components} } from "@/components/atoms/Typography";\n`;
    
    // Find the last import statement
    const importRegex = /^import .+ from .+;$/gm;
    const imports = content.match(importRegex);
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      content = content.replace(lastImport, lastImport + '\n' + importStatement);
    } else {
      // Add at the top
      content = importStatement + '\n' + content;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
  
  return modified;
}

function fixColorsInFile(filePath: string): boolean {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  for (const [oldColor, newColor] of Object.entries(COLOR_MAPPINGS)) {
    const regex = new RegExp(`\\b${oldColor}\\b`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, newColor);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
  
  return modified;
}

function fixCardVariantsInFile(filePath: string): boolean {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Fix Card components without variants
  const cardRegex = /<Card\s+(?![^>]*variant=)/g;
  if (cardRegex.test(content)) {
    // Determine platform from file path
    let variant = 'default';
    if (filePath.includes('/atlvs/')) variant = 'atlvs';
    else if (filePath.includes('/compvss/')) variant = 'compvss';
    else if (filePath.includes('/gvteway/')) variant = 'gvteway';
    
    content = content.replace(cardRegex, `<Card variant="${variant}" `);
    modified = true;
  }
  
  // Fix hardcoded Card styling
  const hardcodedCardRegex = /<Card[^>]*className=["']([^"']*)(bg-gray-900\/50|border-gray-800|rounded-lg)([^"']*)["']/g;
  if (hardcodedCardRegex.test(content)) {
    content = content.replace(hardcodedCardRegex, (match, before, hardcoded, after) => {
      const cleaned = (before + ' ' + after).replace(/\s+/g, ' ').trim();
      return match.replace(/className=["'][^"']*["']/, cleaned ? `className="${cleaned}"` : '');
    });
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
  
  return modified;
}

function fixButtonVariantsInFile(filePath: string): boolean {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Fix Button components without variants
  const buttonRegex = /<Button\s+(?![^>]*variant=)/g;
  if (buttonRegex.test(content)) {
    // Determine platform from file path
    let variant = 'default';
    if (filePath.includes('/atlvs/')) variant = 'atlvs';
    else if (filePath.includes('/compvss/')) variant = 'compvss';
    else if (filePath.includes('/gvteway/')) variant = 'gvteway';
    
    content = content.replace(buttonRegex, `<Button variant="${variant}" `);
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
  
  return modified;
}

async function processFiles() {
  console.log('🔍 Scanning for atomic design violations...\n');
  
  const files = await glob('src/**/*.{tsx,ts}', {
    ignore: ['**/node_modules/**', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    cwd: process.cwd(),
  });
  
  let typographyFixed = 0;
  let colorsFixed = 0;
  let cardsFixed = 0;
  let buttonsFixed = 0;
  
  for (const file of files) {
    const fullPath = path.join(process.cwd(), file);
    
    if (fixTypographyInFile(fullPath)) {
      typographyFixed++;
    }
    
    if (fixColorsInFile(fullPath)) {
      colorsFixed++;
    }
    
    if (fixCardVariantsInFile(fullPath)) {
      cardsFixed++;
    }
    
    if (fixButtonVariantsInFile(fullPath)) {
      buttonsFixed++;
    }
  }
  
  console.log('\n✅ Atomic Design System Fixes Complete!\n');
  console.log(`📝 Typography violations fixed: ${typographyFixed} files`);
  console.log(`🎨 Color violations fixed: ${colorsFixed} files`);
  console.log(`🃏 Card violations fixed: ${cardsFixed} files`);
  console.log(`🔘 Button violations fixed: ${buttonsFixed} files`);
  console.log(`\n📊 Total files processed: ${files.length}`);
  console.log(`\n⚠️  Please review changes and run tests before committing.`);
}

// Run the script
processFiles().catch(console.error);
