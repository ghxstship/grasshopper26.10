#!/usr/bin/env node

/**
 * CAREFUL UI REMEDIATION SCRIPT
 * Enforces GHXSTSHIP Design System while preserving file structure
 * 
 * Fixes:
 * 1. Raw HTML elements → Typography components (preserving multi-line structure)
 * 2. Gray → Grey consistency
 * 3. Malformed classes
 * 4. Adds proper imports
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';

const SRC_DIR = '/Users/julianclarkson/Documents/Grasshopper26.10/src';
const EXCLUDED_DIRS = ['__tests__', 'design-system'];

// Typography component mappings
const TYPOGRAPHY_MAPPINGS = {
  h1: 'HeroTitle',
  h2: 'SectionHeader',
  h3: 'SubsectionHeader',
  h4: 'CardTitle',
  h5: 'CardTitle',
  h6: 'BodyTextSmall',
  p: 'BodyText',
};

// Statistics
const stats = {
  filesProcessed: 0,
  filesModified: 0,
  errors: 0,
  violations: {
    rawHtmlElements: 0,
    graySpelling: 0,
    malformedClasses: 0,
  }
};

// Collect all TSX files
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

// Detect platform variant
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

// Process a single file
function processFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf8');
    const originalContent = content;
    const neededComponents = new Set();
    
    const variant = detectVariant(filePath, content);
    
    // Fix 1: Replace simple HTML heading/paragraph elements with Typography components
    // Only match single-line elements to avoid breaking multi-line JSX
    const simpleElementRegex = /<(h[1-6]|p)(\s+[^>]*)?>([^<]+)<\/\1>/g;
    
    content = content.replace(simpleElementRegex, (match, tag, attrs, innerText) => {
      // Skip if has event handlers or refs
      if (attrs && (attrs.includes('onClick') || attrs.includes('ref=') || attrs.includes('onChange'))) {
        return match;
      }
      
      // Skip if innerText contains JSX expressions
      if (innerText.includes('{') && innerText.includes('}')) {
        return match;
      }
      
      const component = TYPOGRAPHY_MAPPINGS[tag];
      if (!component) return match;
      
      neededComponents.add(component);
      stats.violations.rawHtmlElements++;
      
      // Extract className if present
      const classMatch = attrs?.match(/className="([^"]*)"/);
      let className = classMatch ? classMatch[1] : '';
      
      // Clean up font and size classes
      className = className
        .replace(/font-(bebas|anton|oswald|share|share-mono)\s*/g, '')
        .replace(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|h[1-6])\s*/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      const classNameProp = className ? ` className="${className}"` : '';
      const variantProp = variant !== 'default' ? ` variant="${variant}"` : '';
      
      return `<${component}${variantProp}${classNameProp}>${innerText}</${component}>`;
    });
    
    // Fix 2: Gray → Grey spelling
    const grayMatches = content.match(/gray-([0-9]+)/g);
    if (grayMatches) {
      stats.violations.graySpelling += grayMatches.length;
      content = content.replace(/gray-([0-9]+)/g, 'grey-$1');
    }
    
    // Fix 3: Malformed classes
    if (content.includes('rounded-none-none-none')) {
      stats.violations.malformedClasses++;
      content = content.replace(/rounded-none-none-none/g, 'rounded-none');
    }
    
    if (content.includes('rounded-none-none-full')) {
      stats.violations.malformedClasses++;
      content = content.replace(/rounded-none-none-full/g, 'rounded-full');
    }
    
    // Clean up multiple spaces in classNames
    content = content.replace(/className="([^"]*)"/g, (match, className) => {
      const cleaned = className.replace(/\s+/g, ' ').trim();
      return cleaned ? `className="${cleaned}"` : '';
    });
    
    // Remove empty className props
    content = content.replace(/\s*className=""\s*/g, ' ');
    
    // Fix 4: Add Typography imports if needed
    if (neededComponents.size > 0) {
      const hasTypographyImport = content.includes('from "@/components/atoms/Typography"');
      
      if (hasTypographyImport) {
        // Update existing import
        const importRegex = /import\s*{([^}]*)}\s*from\s*["']@\/components\/atoms\/Typography["'];?/;
        const match = content.match(importRegex);
        
        if (match) {
          const existingImports = match[1].split(',').map(s => s.trim()).filter(Boolean);
          const allImports = new Set([...existingImports, ...neededComponents]);
          const newImport = `import { ${Array.from(allImports).sort().join(', ')} } from "@/components/atoms/Typography";`;
          
          content = content.replace(importRegex, newImport);
        }
      } else {
        // Add new import after last import
        const importRegex = /import\s+.*?from\s+['"].*?['"];?\n/g;
        const imports = content.match(importRegex);
        
        if (imports && imports.length > 0) {
          const lastImport = imports[imports.length - 1];
          const lastImportIndex = content.lastIndexOf(lastImport);
          const newImport = `import { ${Array.from(neededComponents).sort().join(', ')} } from "@/components/atoms/Typography";\n`;
          
          content = content.slice(0, lastImportIndex + lastImport.length) + newImport + content.slice(lastImportIndex + lastImport.length);
        }
      }
    }
    
    stats.filesProcessed++;
    
    if (content !== originalContent) {
      writeFileSync(filePath, content, 'utf8');
      stats.filesModified++;
      return true;
    }
    
    return false;
  } catch (error) {
    stats.errors++;
    console.error(`❌ Error: ${relative(SRC_DIR, filePath)}: ${error.message}`);
    return false;
  }
}

// Main execution
console.log('🚀 CAREFUL UI REMEDIATION');
console.log('=========================\n');
console.log('Enforcing GHXSTSHIP Design System\n');

const files = getAllTsxFiles(SRC_DIR);
console.log(`📁 Found ${files.length} TSX files to process\n`);

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
console.log(`   • Gray spelling: ${stats.violations.graySpelling}`);
console.log(`   • Malformed classes: ${stats.violations.malformedClasses}`);

const totalViolations = Object.values(stats.violations).reduce((a, b) => a + b, 0);
console.log(`\n✨ Total violations fixed: ${totalViolations}`);

if (stats.errors === 0) {
  console.log('\n✅ All violations resolved successfully!');
} else {
  console.log(`\n⚠️  Completed with ${stats.errors} errors`);
  process.exit(1);
}
