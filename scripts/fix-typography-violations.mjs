#!/usr/bin/env node
/**
 * Typography Violation Fixer
 * Automatically fixes raw font class and text size class violations
 * 
 * TRANSFORMATIONS:
 * - font-anton text-hero → <HeroTitle>
 * - font-anton text-h1 → <PageTitle>
 * - font-bebas text-h2 → <SectionHeader>
 * - font-bebas text-h3 → <SubsectionHeader>
 * - font-bebas text-h4 → <CardTitle>
 * - font-bebas text-h5 → <SmallHeader>
 * - font-bebas text-h6 → <TinyHeader>
 * - font-share-tech text-body → <BodyText>
 * - font-share-tech text-body-lg → <BodyTextLarge>
 * - font-share-tech text-body-sm → <BodyTextSmall>
 * - font-share-tech-mono text-caption → <Caption>
 * - font-share-tech-mono text-meta → <Metadata>
 */

import fs from 'fs';
import { glob } from 'glob';

// Typography component mappings
const TYPOGRAPHY_MAPPINGS = [
  {
    pattern: /className=["']([^"']*\s)?font-anton\s+text-hero(\s[^"']*)?["']/g,
    component: 'HeroTitle',
    removeClasses: ['font-anton', 'text-hero'],
  },
  {
    pattern: /className=["']([^"']*\s)?font-anton\s+text-display(\s[^"']*)?["']/g,
    component: 'DisplayTitle',
    removeClasses: ['font-anton', 'text-display'],
  },
  {
    pattern: /className=["']([^"']*\s)?font-anton\s+text-h1(\s[^"']*)?["']/g,
    component: 'PageTitle',
    removeClasses: ['font-anton', 'text-h1'],
  },
  {
    pattern: /className=["']([^"']*\s)?font-bebas\s+text-h2(\s[^"']*)?["']/g,
    component: 'SectionHeader',
    removeClasses: ['font-bebas', 'text-h2'],
  },
  {
    pattern: /className=["']([^"']*\s)?font-bebas\s+text-h3(\s[^"']*)?["']/g,
    component: 'SubsectionHeader',
    removeClasses: ['font-bebas', 'text-h3'],
  },
  {
    pattern: /className=["']([^"']*\s)?font-bebas\s+text-h4(\s[^"']*)?["']/g,
    component: 'CardTitle',
    removeClasses: ['font-bebas', 'text-h4'],
  },
  {
    pattern: /className=["']([^"']*\s)?font-bebas\s+text-h5(\s[^"']*)?["']/g,
    component: 'SmallHeader',
    removeClasses: ['font-bebas', 'text-h5'],
  },
  {
    pattern: /className=["']([^"']*\s)?font-bebas\s+text-h6(\s[^"']*)?["']/g,
    component: 'TinyHeader',
    removeClasses: ['font-bebas', 'text-h6'],
  },
  {
    pattern: /className=["']([^"']*\s)?font-share-tech\s+text-body-lg(\s[^"']*)?["']/g,
    component: 'BodyTextLarge',
    removeClasses: ['font-share-tech', 'text-body-lg'],
  },
  {
    pattern: /className=["']([^"']*\s)?font-share-tech\s+text-body(\s[^"']*)?["']/g,
    component: 'BodyText',
    removeClasses: ['font-share-tech', 'text-body'],
  },
  {
    pattern: /className=["']([^"']*\s)?font-share-tech\s+text-body-sm(\s[^"']*)?["']/g,
    component: 'BodyTextSmall',
    removeClasses: ['font-share-tech', 'text-body-sm'],
  },
  {
    pattern: /className=["']([^"']*\s)?font-share-tech-mono\s+text-caption(\s[^"']*)?["']/g,
    component: 'Caption',
    removeClasses: ['font-share-tech-mono', 'text-caption'],
  },
  {
    pattern: /className=["']([^"']*\s)?font-share-tech-mono\s+text-meta(\s[^"']*)?["']/g,
    component: 'Metadata',
    removeClasses: ['font-share-tech-mono', 'text-meta'],
  },
];

// Track statistics
const stats = {
  filesScanned: 0,
  filesModified: 0,
  violationsFixed: 0,
  errors: [],
};

/**
 * Remove typography classes from className string
 */
function removeTypographyClasses(classNameStr, classesToRemove) {
  let result = classNameStr;
  
  for (const cls of classesToRemove) {
    // Remove the class and any extra whitespace
    result = result.replace(new RegExp(`\\s*${cls}\\s*`, 'g'), ' ');
  }
  
  // Clean up multiple spaces and trim
  result = result.replace(/\s+/g, ' ').trim();
  
  return result;
}

/**
 * Check if file needs Typography import
 */
function needsTypographyImport(content) {
  return !content.includes("from '@/components/atoms/Typography'") &&
         !content.includes('from "@/components/atoms/Typography"');
}

/**
 * Add Typography import to file
 */
function addTypographyImport(content, components) {
  const importStatement = `import { ${components.join(', ')} } from '@/components/atoms/Typography';\n`;
  
  // Find the last import statement
  const importRegex = /import\s+.*?from\s+['"].*?['"];?\s*\n/g;
  const imports = content.match(importRegex);
  
  if (imports && imports.length > 0) {
    const lastImport = imports[imports.length - 1];
    const lastImportIndex = content.lastIndexOf(lastImport);
    const insertPosition = lastImportIndex + lastImport.length;
    
    return content.slice(0, insertPosition) + importStatement + content.slice(insertPosition);
  }
  
  // If no imports found, add at the beginning after any comments
  const firstLineRegex = /^(\/\/.*\n|\/\*[\s\S]*?\*\/\n)*/;
  const match = content.match(firstLineRegex);
  const insertPosition = match ? match[0].length : 0;
  
  return content.slice(0, insertPosition) + importStatement + content.slice(insertPosition);
}

/**
 * Fix typography violations in a single file
 */
function fixFileTypography(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    const usedComponents = new Set();
    
    // Apply each typography mapping
    for (const mapping of TYPOGRAPHY_MAPPINGS) {
      const matches = content.match(mapping.pattern);
      
      if (matches && matches.length > 0) {
        // Track which components are used
        usedComponents.add(mapping.component);
        
        // Replace violations
        content = content.replace(mapping.pattern, (match) => {
          modified = true;
          stats.violationsFixed++;
          
          // Extract remaining classes
          const classNameMatch = match.match(/className=["']([^"']*)["']/);
          if (classNameMatch) {
            const originalClasses = classNameMatch[1];
            const remainingClasses = removeTypographyClasses(originalClasses, mapping.removeClasses);
            
            if (remainingClasses) {
              return `className="${remainingClasses}"`;
            }
          }
          
          // No remaining classes, remove className entirely
          return '';
        });
      }
    }
    
    // Add Typography import if needed and components were used
    if (modified && usedComponents.size > 0 && needsTypographyImport(content)) {
      content = addTypographyImport(content, Array.from(usedComponents));
    }
    
    // Write back if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      stats.filesModified++;
      console.log(`✅ Fixed ${filePath}`);
    }
    
    return modified;
  } catch (error) {
    stats.errors.push({ file: filePath, error: error.message });
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Scanning for typography violations...\n');
  
  // Find all TSX files in src directory
  const files = await glob('src/**/*.{tsx,jsx}', {
    ignore: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
    ],
  });
  
  console.log(`📁 Found ${files.length} files to scan\n`);
  
  // Process each file
  for (const file of files) {
    stats.filesScanned++;
    fixFileTypography(file);
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TYPOGRAPHY VIOLATION FIX SUMMARY');
  console.log('='.repeat(60));
  console.log(`Files Scanned:    ${stats.filesScanned}`);
  console.log(`Files Modified:   ${stats.filesModified}`);
  console.log(`Violations Fixed: ${stats.violationsFixed}`);
  console.log(`Errors:           ${stats.errors.length}`);
  
  if (stats.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    stats.errors.forEach(({ file, error }) => {
      console.log(`  ${file}: ${error}`);
    });
  }
  
  console.log('\n✨ Typography violation fix complete!');
  
  // Exit with error code if there were errors
  process.exit(stats.errors.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
