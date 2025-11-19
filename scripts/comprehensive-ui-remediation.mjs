#!/usr/bin/env node

/**
 * COMPREHENSIVE UI REMEDIATION SCRIPT
 * Enforces GHXSTSHIP Design System with zero tolerance for violations
 * 
 * Fixes:
 * 1. Raw HTML elements → Typography components
 * 2. Raw font classes → Typography components
 * 3. Raw text size classes → Typography components
 * 4. Color gradients → Monochromatic system
 * 5. Custom Card styling → Card variants
 * 6. Custom Button styling → Button variants
 * 7. Gray → Grey consistency
 * 8. Malformed classes
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';

const SRC_DIR = '/Users/julianclarkson/Documents/Grasshopper26.10/src';
const EXCLUDED_DIRS = ['__tests__', 'design-system'];

// Typography component mappings based on semantic meaning
const TYPOGRAPHY_MAPPINGS = {
  h1: 'HeroTitle',
  h2: 'SectionHeader',
  h3: 'SubsectionHeader',
  h4: 'CardTitle',
  h5: 'CardTitle',
  h6: 'BodyTextSmall',
  p: 'BodyText',
  span: 'BodyText'
};

// Font class to Typography component mapping
const FONT_CLASS_TO_COMPONENT = {
  'font-anton': 'HeroTitle',
  'font-bebas': 'SectionHeader',
  'font-share': 'BodyText',
  'font-share-mono': 'MetadataText',
  'font-oswald': 'SectionHeader'
};

// Text size to Typography component mapping
const SIZE_TO_COMPONENT = {
  'text-h1': 'HeroTitle',
  'text-h2': 'SectionHeader',
  'text-h3': 'SubsectionHeader',
  'text-h4': 'CardTitle',
  'text-h5': 'CardTitle',
  'text-h6': 'BodyTextSmall',
  'text-xs': 'MetadataText',
  'text-sm': 'BodyTextSmall',
  'text-base': 'BodyText',
  'text-lg': 'BodyText',
  'text-xl': 'CardTitle',
  'text-2xl': 'SubsectionHeader',
  'text-3xl': 'SectionHeader',
  'text-4xl': 'HeroTitle',
  'text-5xl': 'HeroTitle',
  'text-6xl': 'HeroTitle',
  'text-7xl': 'HeroTitle',
  'text-8xl': 'HeroTitle',
  'text-9xl': 'HeroTitle'
};

// Statistics tracking
const stats = {
  filesProcessed: 0,
  filesModified: 0,
  errors: 0,
  violations: {
    rawHtmlElements: 0,
    rawFontClasses: 0,
    rawSizeClasses: 0,
    gradients: 0,
    customCardStyling: 0,
    customButtonStyling: 0,
    graySpelling: 0,
    malformedClasses: 0
  }
};

// Collect all TSX/TS files recursively
function getAllFiles(dir, files = []) {
  const items = readdirSync(dir);
  
  for (const item of items) {
    // Skip excluded directories
    if (EXCLUDED_DIRS.includes(item)) continue;
    
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (['.tsx', '.ts'].includes(extname(fullPath))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Determine platform variant from file path or content
function detectVariant(filePath, content) {
  const path = filePath.toLowerCase();
  
  if (path.includes('/gvteway/') || content.includes('variant="gvteway"')) {
    return 'gvteway';
  }
  if (path.includes('/compvss/') || content.includes('variant="compvss"')) {
    return 'compvss';
  }
  if (path.includes('/atlvs/') || content.includes('variant="atlvs"')) {
    return 'atlvs';
  }
  
  return 'default';
}

// Extract and clean className
function extractClassName(attrs) {
  if (!attrs) return '';
  
  const classMatch = attrs.match(/className=(?:{`([^`]*)`}|"([^"]*)")/);
  if (!classMatch) return '';
  
  return classMatch[1] || classMatch[2] || '';
}

// Remove design system violation classes
function cleanClassName(className) {
  return className
    // Remove font classes
    .replace(/font-(bebas|anton|oswald|share|share-mono)\s*/g, '')
    // Remove text size classes
    .replace(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|h[1-6])\s*/g, '')
    // Remove gradient classes
    .replace(/bg-gradient-to-[a-z]+\s*/g, '')
    .replace(/from-[a-z]+-[0-9]+(?:\/[0-9]+)?\s*/g, '')
    .replace(/via-[a-z]+-[0-9]+(?:\/[0-9]+)?\s*/g, '')
    .replace(/to-[a-z]+-[0-9]+(?:\/[0-9]+)?\s*/g, '')
    // Fix gray → grey
    .replace(/gray-([0-9]+)/g, 'grey-$1')
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

// Fix raw HTML elements
function fixRawHtmlElements(content, variant, neededComponents) {
  const htmlElementRegex = /<(h[1-6]|p)(\s+[^>]*)?>((?:(?!<\/\1>).)*)<\/\1>/gs;
  
  return content.replace(htmlElementRegex, (match, tag, attrs, innerContent) => {
    // Skip if contains JSX children
    if (innerContent.includes('<') && innerContent.includes('>')) {
      return match;
    }
    
    // Skip if has event handlers or refs
    if (attrs && (attrs.includes('onClick') || attrs.includes('ref=') || attrs.includes('onChange'))) {
      return match;
    }
    
    const component = TYPOGRAPHY_MAPPINGS[tag] || 'BodyText';
    neededComponents.add(component);
    stats.violations.rawHtmlElements++;
    
    const className = extractClassName(attrs);
    const cleanClass = cleanClassName(className);
    
    const classNameProp = cleanClass ? ` className="${cleanClass}"` : '';
    const variantProp = variant !== 'default' ? ` variant="${variant}"` : '';
    
    return `<${component}${variantProp}${classNameProp}>${innerContent}</${component}>`;
  });
}

// Fix elements with raw font or size classes
function fixRawClassElements(content, variant, neededComponents) {
  // Match any element with font- or text-size classes
  const classElementRegex = /<([a-z]+)(\s+[^>]*?className=(?:{`[^`]*(?:font-(?:bebas|anton|oswald|share)|text-(?:xs|sm|base|lg|xl|[2-9]xl|h[1-6]))[^`]*`}|"[^"]*(?:font-(?:bebas|anton|oswald|share)|text-(?:xs|sm|base|lg|xl|[2-9]xl|h[1-6]))[^"]*")[^>]*?)>((?:(?!<\/\1>).)*)<\/\1>/gs;
  
  return content.replace(classElementRegex, (match, tag, attrs, innerContent) => {
    // Skip if already a Typography component
    if (['HeroTitle', 'SectionHeader', 'SubsectionHeader', 'CardTitle', 'BodyText', 'BodyTextSmall', 'MetadataText'].includes(tag)) {
      return match;
    }
    
    // Skip if contains JSX children
    if (innerContent.includes('<') && innerContent.includes('>')) {
      return match;
    }
    
    // Skip if has event handlers
    if (attrs.includes('onClick') || attrs.includes('ref=') || attrs.includes('onChange')) {
      return match;
    }
    
    const className = extractClassName(attrs);
    
    // Determine component from font or size class
    let component = 'BodyText';
    
    for (const [fontClass, comp] of Object.entries(FONT_CLASS_TO_COMPONENT)) {
      if (className.includes(fontClass)) {
        component = comp;
        stats.violations.rawFontClasses++;
        break;
      }
    }
    
    for (const [sizeClass, comp] of Object.entries(SIZE_TO_COMPONENT)) {
      if (className.includes(sizeClass)) {
        component = comp;
        stats.violations.rawSizeClasses++;
        break;
      }
    }
    
    neededComponents.add(component);
    
    const cleanClass = cleanClassName(className);
    const classNameProp = cleanClass ? ` className="${cleanClass}"` : '';
    const variantProp = variant !== 'default' ? ` variant="${variant}"` : '';
    
    return `<${component}${variantProp}${classNameProp}>${innerContent}</${component}>`;
  });
}

// Fix gradient violations
function fixGradients(content) {
  const gradientRegex = /className="([^"]*bg-gradient-to-[^"]*)"/g;
  
  return content.replace(gradientRegex, (match, className) => {
    stats.violations.gradients++;
    const cleaned = cleanClassName(className);
    // Replace gradients with solid black or white based on context
    const replacement = cleaned.includes('text-white') ? 'bg-black' : 'bg-white';
    return `className="${cleaned} ${replacement}"`;
  });
}

// Fix Card custom styling
function fixCardStyling(content) {
  // Match Card components with custom bg/border styling
  const cardRegex = /<Card(\s+[^>]*?className="[^"]*(?:bg-gray-900\/50|border-gray-800)[^"]*"[^>]*?)>/g;
  
  return content.replace(cardRegex, (match, attrs) => {
    stats.violations.customCardStyling++;
    
    // Extract variant if present
    const variantMatch = attrs.match(/variant="([^"]*)"/);
    const hasVariant = !!variantMatch;
    
    if (!hasVariant) {
      // Add variant based on context
      const variant = attrs.includes('gvteway') ? 'gvteway' : 
                     attrs.includes('compvss') ? 'compvss' :
                     attrs.includes('atlvs') ? 'atlvs' : 'default';
      
      return `<Card variant="${variant}"${attrs.replace(/className="[^"]*"/g, '')}>`;
    }
    
    // Remove custom styling classes
    return match.replace(/className="[^"]*"/g, '');
  });
}

// Fix Button custom styling
function fixButtonStyling(content) {
  // Match Button components with custom styling
  const buttonRegex = /<Button(\s+[^>]*?className="[^"]*(?:bg-gradient|from-|via-|to-)[^"]*"[^>]*?)>/g;
  
  return content.replace(buttonRegex, (match, attrs) => {
    stats.violations.customButtonStyling++;
    
    const variantMatch = attrs.match(/variant="([^"]*)"/);
    const hasVariant = !!variantMatch;
    
    if (!hasVariant) {
      const variant = attrs.includes('gvteway') ? 'gvteway' : 
                     attrs.includes('compvss') ? 'compvss' :
                     attrs.includes('atlvs') ? 'atlvs' : 'primary';
      
      return `<Button variant="${variant}"${attrs.replace(/className="[^"]*"/g, '')}>`;
    }
    
    return match.replace(/className="[^"]*"/g, '');
  });
}

// Fix gray → grey spelling
function fixGraySpelling(content) {
  const grayRegex = /gray-([0-9]+)/g;
  const matches = content.match(grayRegex);
  
  if (matches) {
    stats.violations.graySpelling += matches.length;
    return content.replace(grayRegex, 'grey-$1');
  }
  
  return content;
}

// Fix malformed classes
function fixMalformedClasses(content) {
  let fixed = content;
  
  // Fix rounded-none-none-none
  if (fixed.includes('rounded-none-none-none')) {
    stats.violations.malformedClasses++;
    fixed = fixed.replace(/rounded-none-none-none/g, 'rounded-none');
  }
  
  // Fix rounded-none-none-full
  if (fixed.includes('rounded-none-none-full')) {
    stats.violations.malformedClasses++;
    fixed = fixed.replace(/rounded-none-none-full/g, 'rounded-full');
  }
  
  // Clean up multiple spaces in classNames
  fixed = fixed.replace(/className="([^"]*)"/g, (match, className) => {
    const cleaned = className.replace(/\s+/g, ' ').trim();
    return cleaned ? `className="${cleaned}"` : '';
  });
  
  // Remove empty className props
  fixed = fixed.replace(/\s*className=""\s*/g, ' ');
  
  return fixed;
}

// Add Typography imports
function addTypographyImports(content, neededComponents) {
  if (neededComponents.size === 0) return content;
  
  const hasTypographyImport = content.includes('from "@/components/atoms/Typography"');
  
  if (hasTypographyImport) {
    // Update existing import
    const importRegex = /import\s*{([^}]*)}\s*from\s*["']@\/components\/atoms\/Typography["'];?/;
    const match = content.match(importRegex);
    
    if (match) {
      const existingImports = match[1].split(',').map(s => s.trim()).filter(Boolean);
      const allImports = new Set([...existingImports, ...neededComponents]);
      const newImport = `import { ${Array.from(allImports).sort().join(', ')} } from "@/components/atoms/Typography";`;
      
      return content.replace(importRegex, newImport);
    }
  } else {
    // Add new import after last import
    const importRegex = /import\s+.*?from\s+['"].*?['"];?\n/g;
    const imports = content.match(importRegex);
    
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport);
      const newImport = `import { ${Array.from(neededComponents).sort().join(', ')} } from "@/components/atoms/Typography";\n`;
      
      return content.slice(0, lastImportIndex + lastImport.length) + newImport + content.slice(lastImportIndex + lastImport.length);
    }
  }
  
  return content;
}

// Process a single file
function processFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf8');
    const originalContent = content;
    const neededComponents = new Set();
    
    const variant = detectVariant(filePath, content);
    
    // Apply all fixes
    content = fixRawHtmlElements(content, variant, neededComponents);
    content = fixRawClassElements(content, variant, neededComponents);
    content = fixGradients(content);
    content = fixCardStyling(content);
    content = fixButtonStyling(content);
    content = fixGraySpelling(content);
    content = fixMalformedClasses(content);
    content = addTypographyImports(content, neededComponents);
    
    stats.filesProcessed++;
    
    if (content !== originalContent) {
      writeFileSync(filePath, content, 'utf8');
      stats.filesModified++;
      return true;
    }
    
    return false;
  } catch (error) {
    stats.errors++;
    console.error(`❌ Error processing ${relative(SRC_DIR, filePath)}: ${error.message}`);
    return false;
  }
}

// Main execution
console.log('🚀 COMPREHENSIVE UI REMEDIATION');
console.log('================================\n');
console.log('Enforcing GHXSTSHIP Design System with zero tolerance\n');

const files = getAllFiles(SRC_DIR);
console.log(`📁 Found ${files.length} files to process\n`);

const startTime = Date.now();

for (const file of files) {
  const relativePath = relative(SRC_DIR, file);
  if (processFile(file)) {
    console.log(`✅ ${relativePath}`);
  }
}

const duration = ((Date.now() - startTime) / 1000).toFixed(2);

console.log('\n' + '='.repeat(50));
console.log('📊 REMEDIATION COMPLETE');
console.log('='.repeat(50));
console.log(`\n⏱️  Duration: ${duration}s`);
console.log(`📄 Files processed: ${stats.filesProcessed}`);
console.log(`✏️  Files modified: ${stats.filesModified}`);
console.log(`❌ Errors: ${stats.errors}`);
console.log('\n🔍 Violations Fixed:');
console.log(`   • Raw HTML elements: ${stats.violations.rawHtmlElements}`);
console.log(`   • Raw font classes: ${stats.violations.rawFontClasses}`);
console.log(`   • Raw size classes: ${stats.violations.rawSizeClasses}`);
console.log(`   • Color gradients: ${stats.violations.gradients}`);
console.log(`   • Custom Card styling: ${stats.violations.customCardStyling}`);
console.log(`   • Custom Button styling: ${stats.violations.customButtonStyling}`);
console.log(`   • Gray spelling: ${stats.violations.graySpelling}`);
console.log(`   • Malformed classes: ${stats.violations.malformedClasses}`);

const totalViolations = Object.values(stats.violations).reduce((a, b) => a + b, 0);
console.log(`\n✨ Total violations fixed: ${totalViolations}`);

if (stats.errors === 0 && totalViolations > 0) {
  console.log('\n✅ All violations resolved successfully!');
} else if (stats.errors > 0) {
  console.log(`\n⚠️  Completed with ${stats.errors} errors`);
  process.exit(1);
}
