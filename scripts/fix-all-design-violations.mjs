#!/usr/bin/env node

/**
 * Comprehensive Design System Violation Fixer
 * Fixes all typography, color, and component violations across src directory
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const SRC_DIR = '/Users/julianclarkson/Documents/Grasshopper26.10/src/app';

// Typography component mappings
const TYPOGRAPHY_MAPPINGS = {
  h1: 'HeroTitle',
  h2: 'SectionHeader',
  h3: 'SubsectionHeader',
  h4: 'CardTitle',
  h5: 'CardTitle',
  h6: 'CardTitle',
  p: 'BodyText',
  span: 'BodyText'
};

// Collect all TSX files
function getAllTsxFiles(dir, files = []) {
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      getAllTsxFiles(fullPath, files);
    } else if (extname(fullPath) === '.tsx') {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Fix a single file
function fixFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check if file already has Typography imports
  const hasTypographyImport = content.includes('from "@/components/atoms/Typography"');
  
  // Track which typography components we need
  const neededComponents = new Set();
  
  // Fix 1: Replace raw HTML headings and text elements with Typography components
  const htmlElementRegex = /<(h[1-6]|p|span)(\s+[^>]*)?>(.*?)<\/\1>/gs;
  
  content = content.replace(htmlElementRegex, (match, tag, attrs, innerContent) => {
    // Skip if it's already a component or has complex JSX
    if (innerContent.includes('<') && innerContent.includes('>')) {
      return match;
    }
    
    // Skip if attributes contain event handlers or refs
    if (attrs && (attrs.includes('onClick') || attrs.includes('ref='))) {
      return match;
    }
    
    const component = TYPOGRAPHY_MAPPINGS[tag] || 'BodyText';
    neededComponents.add(component);
    
    // Extract className if present
    const classMatch = attrs?.match(/className="([^"]*)"/);
    const className = classMatch ? classMatch[1] : '';
    
    // Determine variant from className or context
    let variant = 'default';
    if (className.includes('gvteway') || filePath.includes('/gvteway/')) {
      variant = 'gvteway';
    } else if (className.includes('compvss') || filePath.includes('/compvss/')) {
      variant = 'compvss';
    } else if (className.includes('atlvs') || filePath.includes('/atlvs/')) {
      variant = 'atlvs';
    }
    
    // Build the replacement
    const cleanClassName = className
      .replace(/font-(bebas|anton|oswald|share)/g, '')
      .replace(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/g, '')
      .replace(/text-h[1-6]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    const classNameProp = cleanClassName ? ` className="${cleanClassName}"` : '';
    const variantProp = variant !== 'default' ? ` variant="${variant}"` : '';
    
    modified = true;
    return `<${component}${variantProp}${classNameProp}>${innerContent}</${component}>`;
  });
  
  // Fix 2: Remove gradient classes (violates monochromatic system)
  content = content.replace(/bg-gradient-to-[a-z]+/g, 'bg-black');
  content = content.replace(/from-[a-z]+-[0-9]+\/[0-9]+/g, '');
  content = content.replace(/via-[a-z]+-[0-9]+\/[0-9]+/g, '');
  content = content.replace(/to-[a-z]+-[0-9]+\/[0-9]+/g, '');
  
  // Fix 3: Fix malformed rounded classes
  content = content.replace(/rounded-none-none-none/g, 'rounded-none');
  content = content.replace(/rounded-none-none-full/g, 'rounded-full');
  
  // Fix 4: Replace gray- with grey- for consistency
  content = content.replace(/gray-([0-9]+)/g, 'grey-$1');
  
  // Fix 5: Add Typography import if needed
  if (neededComponents.size > 0 && !hasTypographyImport) {
    const importStatement = `import { ${Array.from(neededComponents).sort().join(', ')} } from "@/components/atoms/Typography";\n`;
    
    // Find the last import statement
    const importRegex = /import\s+.*?from\s+['"].*?['"];?\n/g;
    const imports = content.match(importRegex);
    
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport);
      content = content.slice(0, lastImportIndex + lastImport.length) + importStatement + content.slice(lastImportIndex + lastImport.length);
      modified = true;
    }
  }
  
  // Fix 6: Clean up multiple spaces in classNames
  content = content.replace(/className="([^"]*)"/g, (match, className) => {
    const cleaned = className.replace(/\s+/g, ' ').trim();
    return `className="${cleaned}"`;
  });
  
  if (modified) {
    writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

// Main execution
console.log('🔧 Starting comprehensive design system violation fixes...\n');

const files = getAllTsxFiles(SRC_DIR);
console.log(`📁 Found ${files.length} TSX files to process\n`);

let fixedCount = 0;
let errorCount = 0;

for (const file of files) {
  try {
    const relativePath = file.replace(SRC_DIR, '');
    if (fixFile(file)) {
      fixedCount++;
      console.log(`✅ Fixed: ${relativePath}`);
    }
  } catch (error) {
    errorCount++;
    console.error(`❌ Error fixing ${file}:`, error.message);
  }
}

console.log(`\n✨ Complete!`);
console.log(`   Fixed: ${fixedCount} files`);
console.log(`   Errors: ${errorCount} files`);
console.log(`   Total: ${files.length} files processed`);
