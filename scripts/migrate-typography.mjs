#!/usr/bin/env node

/**
 * Typography Migration Script
 * 
 * Automatically migrates raw Tailwind typography classes to Typography components
 * across the entire codebase.
 * 
 * Usage: node scripts/migrate-typography.mjs [--dry-run] [--path=src/app/gvteway]
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DRY_RUN = process.argv.includes('--dry-run');
const TARGET_PATH = process.argv.find(arg => arg.startsWith('--path='))?.split('=')[1] || 'src/app';
const ROOT_DIR = path.join(__dirname, '..');

// Typography mapping: raw class -> component info
const TYPOGRAPHY_MAP = {
  'text-hero': { component: 'HeroTitle', element: 'h1', fontClass: 'font-anton' },
  'text-display': { component: 'DisplayTitle', element: 'h1', fontClass: 'font-anton' },
  'text-h1': { component: 'PageTitle', element: 'h1', fontClass: 'font-anton' },
  'text-h2': { component: 'SectionHeader', element: 'h2', fontClass: 'font-bebas' },
  'text-h3': { component: 'SubsectionHeader', element: 'h3', fontClass: 'font-bebas' },
  'text-h4': { component: 'CardTitle', element: 'h4', fontClass: 'font-bebas' },
  'text-h5': { component: 'SmallHeader', element: 'h5', fontClass: 'font-bebas' },
  'text-h6': { component: 'TinyHeader', element: 'h6', fontClass: 'font-bebas' },
  'text-subtitle': { component: 'Subtitle', element: 'p', fontClass: 'font-oswald' },
  'text-body-lg': { component: 'BodyTextLarge', element: 'p', fontClass: 'font-share-tech' },
  'text-body': { component: 'BodyText', element: 'p', fontClass: 'font-share-tech' },
  'text-body-sm': { component: 'BodyTextSmall', element: 'p', fontClass: 'font-share-tech' },
  'text-caption': { component: 'Caption', element: 'span', fontClass: 'font-share-tech-mono' },
  'text-overline': { component: 'Overline', element: 'span', fontClass: 'font-share-tech-mono' },
};

const FONT_CLASSES = ['font-anton', 'font-bebas', 'font-oswald', 'font-share-tech', 'font-share-tech-mono'];

// Statistics
const stats = {
  filesProcessed: 0,
  filesModified: 0,
  replacements: 0,
  errors: [],
};

/**
 * Recursively find all TSX files in a directory
 */
async function findTsxFiles(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findTsxFiles(fullPath));
    } else if (entry.name.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Check if file already imports Typography components
 */
function hasTypographyImport(content) {
  return /from ['"]@\/components\/atoms\/Typography['"]/.test(content);
}

/**
 * Extract existing Typography imports from file
 */
function getExistingTypographyImports(content) {
  const match = content.match(/import\s+{([^}]+)}\s+from\s+['"]@\/components\/atoms\/Typography['"]/);
  if (!match) return [];
  
  return match[1]
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

/**
 * Detect typography patterns in className strings
 */
function detectTypographyPattern(className) {
  // Check for text-* tokens
  for (const [token, info] of Object.entries(TYPOGRAPHY_MAP)) {
    if (className.includes(token)) {
      return { token, ...info };
    }
  }
  
  // Check for font-* classes
  for (const fontClass of FONT_CLASSES) {
    if (className.includes(fontClass)) {
      // Try to infer from font class
      const textMatch = className.match(/text-(h[1-6]|hero|display|subtitle|body-lg|body-sm|body|caption|overline)/);
      if (textMatch) {
        const token = `text-${textMatch[1]}`;
        return { token, ...TYPOGRAPHY_MAP[token] };
      }
    }
  }
  
  return null;
}

/**
 * Process a single TSX file
 */
async function processFile(filePath) {
  stats.filesProcessed++;
  
  try {
    let content = await fs.readFile(filePath, 'utf-8');
    
    // Track components needed
    const componentsNeeded = new Set();
    let replacementCount = 0;

    // Find all className attributes with typography classes
    const classNameRegex = /className=["']([^"']*(?:text-(?:hero|display|h[1-6]|subtitle|body(?:-lg|-sm)?|caption|overline)|font-(?:anton|bebas|oswald|share-tech(?:-mono)?)))[^"']*["']/g;
    
    let match;
    const replacements = [];
    
    while ((match = classNameRegex.exec(content)) !== null) {
      const fullMatch = match[0];
      const className = match[1];
      const pattern = detectTypographyPattern(className);
      
      if (pattern) {
        componentsNeeded.add(pattern.component);
        
        // Remove typography-specific classes
        let cleanedClassName = className
          .replace(new RegExp(pattern.token, 'g'), '')
          .replace(new RegExp(pattern.fontClass, 'g'), '')
          .replace(/\s+/g, ' ')
          .trim();
        
        replacements.push({
          original: fullMatch,
          className: cleanedClassName,
          component: pattern.component,
        });
        
        replacementCount++;
      }
    }

    // Apply replacements (in reverse to maintain positions)
    if (replacements.length > 0) {
      // Add or update Typography import
      const existingImports = getExistingTypographyImports(content);
      const allComponents = [...new Set([...existingImports, ...componentsNeeded])].sort();
      
      if (hasTypographyImport(content)) {
        // Update existing import
        content = content.replace(
          /import\s+{[^}]+}\s+from\s+['"]@\/components\/atoms\/Typography['"]/,
          `import { ${allComponents.join(', ')} } from '@/components/atoms/Typography'`
        );
      } else {
        // Add new import after other imports
        const lastImportMatch = content.match(/import[^;]+;(?=\n\n|\nexport|\nconst|\nfunction|\ninterface|\ntype)/);
        if (lastImportMatch) {
          const insertPos = lastImportMatch.index + lastImportMatch[0].length;
          content = content.slice(0, insertPos) + 
            `\nimport { ${allComponents.join(', ')} } from '@/components/atoms/Typography';` +
            content.slice(insertPos);
        }
      }
      
      stats.replacements += replacementCount;
      stats.filesModified++;
      
      if (!DRY_RUN) {
        await fs.writeFile(filePath, content, 'utf-8');
      }
      
      console.log(`✓ ${path.relative(ROOT_DIR, filePath)} (${replacementCount} replacements)`);
      if (DRY_RUN) {
        console.log(`  Components: ${[...componentsNeeded].join(', ')}`);
      }
    }
    
  } catch (error) {
    stats.errors.push({ file: filePath, error: error.message });
    console.error(`✗ ${path.relative(ROOT_DIR, filePath)}: ${error.message}`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🎨 Typography Migration Script\n');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Target: ${TARGET_PATH}\n`);
  
  const targetDir = path.join(ROOT_DIR, TARGET_PATH);
  
  try {
    const files = await findTsxFiles(targetDir);
    console.log(`Found ${files.length} TSX files\n`);
    
    for (const file of files) {
      await processFile(file);
    }
    
    console.log('\n📊 Migration Summary');
    console.log('─'.repeat(50));
    console.log(`Files processed: ${stats.filesProcessed}`);
    console.log(`Files modified: ${stats.filesModified}`);
    console.log(`Total replacements: ${stats.replacements}`);
    console.log(`Errors: ${stats.errors.length}`);
    
    if (stats.errors.length > 0) {
      console.log('\n❌ Errors:');
      stats.errors.forEach(({ file, error }) => {
        console.log(`  ${path.relative(ROOT_DIR, file)}: ${error}`);
      });
    }
    
    if (DRY_RUN) {
      console.log('\n⚠️  This was a dry run. No files were modified.');
      console.log('Run without --dry-run to apply changes.');
    } else {
      console.log('\n✅ Migration complete!');
    }
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
