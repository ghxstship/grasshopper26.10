#!/usr/bin/env node

/**
 * Fix Duplicate Imports
 * Removes duplicate Typography component imports from Card imports
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';

const SRC_DIR = '/Users/julianclarkson/Documents/Grasshopper26.10/src';
const EXCLUDED_DIRS = ['__tests__', 'design-system'];

// Typography components that might be duplicated
const TYPOGRAPHY_COMPONENTS = [
  'HeroTitle', 'SectionHeader', 'SubsectionHeader', 'CardTitle', 
  'BodyText', 'BodyTextSmall', 'BodyTextLarge', 'MetadataText'
];

let filesFixed = 0;
let duplicatesRemoved = 0;

function getAllTsxFiles(dir, files = []) {
  const items = readdirSync(dir);
  
  for (const item of items) {
    if (EXCLUDED_DIRS.includes(item)) continue;
    
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

function fixFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Check if file has both Card and Typography imports
    const hasCardImport = content.includes('from "@/components/atoms/Card"');
    const hasTypographyImport = content.includes('from "@/components/atoms/Typography"');
    
    if (!hasCardImport || !hasTypographyImport) {
      return false;
    }
    
    // Extract Card import line
    const cardImportRegex = /import\s*{([^}]*)}\s*from\s*["']@\/components\/atoms\/Card["'];?/;
    const cardMatch = content.match(cardImportRegex);
    
    if (!cardMatch) return false;
    
    const cardImports = cardMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    
    // Check for Typography components in Card import
    const typographyInCard = cardImports.filter(imp => 
      TYPOGRAPHY_COMPONENTS.some(comp => imp === comp)
    );
    
    if (typographyInCard.length === 0) {
      return false;
    }
    
    // Remove Typography components from Card import
    const cleanedCardImports = cardImports.filter(imp => 
      !TYPOGRAPHY_COMPONENTS.some(comp => imp === comp)
    );
    
    if (cleanedCardImports.length > 0) {
      const newCardImport = `import { ${cleanedCardImports.join(', ')} } from "@/components/atoms/Card";`;
      content = content.replace(cardImportRegex, newCardImport);
    } else {
      // Remove entire Card import if it only had Typography components
      content = content.replace(cardImportRegex + '\n', '');
    }
    
    duplicatesRemoved += typographyInCard.length;
    
    if (content !== originalContent) {
      writeFileSync(filePath, content, 'utf8');
      filesFixed++;
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error fixing ${relative(SRC_DIR, filePath)}: ${error.message}`);
    return false;
  }
}

console.log('🔧 Fixing duplicate imports...\n');

const files = getAllTsxFiles(SRC_DIR);
console.log(`📁 Processing ${files.length} files\n`);

for (const file of files) {
  if (fixFile(file)) {
    console.log(`✅ ${relative(SRC_DIR, file)}`);
  }
}

console.log(`\n✨ Fixed ${filesFixed} files`);
console.log(`   Removed ${duplicatesRemoved} duplicate imports`);
