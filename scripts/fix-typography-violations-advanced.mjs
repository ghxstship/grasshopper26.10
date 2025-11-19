#!/usr/bin/env node

/**
 * TYPOGRAPHY VIOLATION FIXER
 * Replaces raw font classes and text size classes with Typography components
 * 
 * Rules:
 * - font-anton + text-h1/hero → HeroTitle
 * - font-bebas + text-h2 → SectionHeader
 * - font-bebas + text-h3 → SubsectionHeader
 * - font-bebas + text-h4/h5/h6 → CardTitle
 * - font-share + text-body → BodyText
 * - font-share + text-body-sm → BodyTextSmall
 * - font-share-mono + text-meta → MetaText
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src/app');

let stats = {
  filesScanned: 0,
  filesModified: 0,
  violationsFixed: 0,
  importsAdded: 0
};

/**
 * Detect which Typography components are needed based on content
 */
function detectNeededComponents(content) {
  const needed = new Set();
  
  // Check for various typography patterns
  if (/font-anton|text-hero|text-h1/.test(content)) needed.add('HeroTitle');
  if (/font-bebas.*text-h2|text-h2.*font-bebas/.test(content)) needed.add('SectionHeader');
  if (/font-bebas.*text-h3|text-h3.*font-bebas/.test(content)) needed.add('SubsectionHeader');
  if (/font-bebas.*text-h[456]|text-h[456].*font-bebas/.test(content)) needed.add('CardTitle');
  if (/font-share(?!-mono).*text-body|text-body.*font-share(?!-mono)/.test(content)) needed.add('BodyText');
  if (/font-share(?!-mono).*text-body-sm|text-body-sm.*font-share(?!-mono)/.test(content)) needed.add('BodyTextSmall');
  if (/font-share-mono.*text-meta|text-meta.*font-share-mono/.test(content)) needed.add('MetaText');
  
  // Also check for standalone usage
  if (/\btext-h1\b/.test(content)) needed.add('HeroTitle');
  if (/\btext-h2\b/.test(content)) needed.add('SectionHeader');
  if (/\btext-h3\b/.test(content)) needed.add('SubsectionHeader');
  if (/\btext-h[456]\b/.test(content)) needed.add('CardTitle');
  if (/\btext-body\b/.test(content) && !/text-body-sm/.test(content)) needed.add('BodyText');
  if (/\btext-body-sm\b/.test(content)) needed.add('BodyTextSmall');
  if (/\btext-meta\b/.test(content)) needed.add('MetaText');
  
  return Array.from(needed);
}

/**
 * Add Typography import if not present
 */
function ensureTypographyImport(content, components) {
  if (components.length === 0) return content;
  
  // Check if import already exists
  const hasImport = /import\s+{[^}]*}\s+from\s+['"]@\/components\/atoms\/Typography['"]/.test(content);
  
  if (hasImport) {
    // Update existing import to include new components
    content = content.replace(
      /import\s+{([^}]*)}\s+from\s+['"]@\/components\/atoms\/Typography['"]/,
      (match, existingImports) => {
        const existing = existingImports.split(',').map(s => s.trim()).filter(Boolean);
        const combined = [...new Set([...existing, ...components])].sort();
        return `import { ${combined.join(', ')} } from '@/components/atoms/Typography'`;
      }
    );
  } else {
    // Add new import after other imports
    const importMatch = content.match(/(import\s+.*?['"];?\n)+/);
    if (importMatch) {
      const lastImportEnd = importMatch[0].length;
      content = content.slice(0, lastImportEnd) +
        `import { ${components.join(', ')} } from '@/components/atoms/Typography';\n` +
        content.slice(lastImportEnd);
      stats.importsAdded++;
    }
  }
  
  return content;
}

/**
 * Fix typography violations in content
 */
function fixTypographyViolations(content) {
  let modified = content;
  let changesMade = 0;
  
  // Pattern 1: <h1 className="...font-anton...text-h1...">...</h1>
  // → <HeroTitle>...</HeroTitle>
  modified = modified.replace(
    /<h1\s+className="[^"]*(?:font-anton|text-h1|text-hero)[^"]*"[^>]*>(.*?)<\/h1>/gs,
    (match, innerContent) => {
      changesMade++;
      return `<HeroTitle>${innerContent}</HeroTitle>`;
    }
  );
  
  // Pattern 2: <h2 className="...font-bebas...text-h2...">...</h2>
  // → <SectionHeader>...</SectionHeader>
  modified = modified.replace(
    /<h2\s+className="[^"]*(?:font-bebas|text-h2)[^"]*"[^>]*>(.*?)<\/h2>/gs,
    (match, innerContent) => {
      changesMade++;
      return `<SectionHeader>${innerContent}</SectionHeader>`;
    }
  );
  
  // Pattern 3: <h3 className="...font-bebas...text-h3...">...</h3>
  // → <SubsectionHeader>...</SubsectionHeader>
  modified = modified.replace(
    /<h3\s+className="[^"]*(?:font-bebas|text-h3)[^"]*"[^>]*>(.*?)<\/h3>/gs,
    (match, innerContent) => {
      changesMade++;
      return `<SubsectionHeader>${innerContent}</SubsectionHeader>`;
    }
  );
  
  // Pattern 4: <h4/h5/h6 className="...font-bebas...text-h[456]...">...</h4/h5/h6>
  // → <CardTitle>...</CardTitle>
  modified = modified.replace(
    /<h[456]\s+className="[^"]*(?:font-bebas|text-h[456])[^"]*"[^>]*>(.*?)<\/h[456]>/gs,
    (match, innerContent) => {
      changesMade++;
      return `<CardTitle>${innerContent}</CardTitle>`;
    }
  );
  
  // Pattern 5: <p className="...font-share...text-body...">...</p>
  // → <BodyText>...</BodyText>
  modified = modified.replace(
    /<p\s+className="[^"]*(?:font-share\s|text-body\s)[^"]*"[^>]*>(.*?)<\/p>/gs,
    (match, innerContent) => {
      if (match.includes('text-body-sm')) return match; // Skip, handled below
      changesMade++;
      return `<BodyText>${innerContent}</BodyText>`;
    }
  );
  
  // Pattern 6: <p className="...font-share...text-body-sm...">...</p>
  // → <BodyTextSmall>...</BodyTextSmall>
  modified = modified.replace(
    /<p\s+className="[^"]*(?:font-share|text-body-sm)[^"]*"[^>]*>(.*?)<\/p>/gs,
    (match, innerContent) => {
      if (!match.includes('text-body-sm')) return match; // Skip, handled above
      changesMade++;
      return `<BodyTextSmall>${innerContent}</BodyTextSmall>`;
    }
  );
  
  // Pattern 7: <span className="...font-share-mono...text-meta...">...</span>
  // → <MetaText>...</MetaText>
  modified = modified.replace(
    /<span\s+className="[^"]*(?:font-share-mono|text-meta)[^"]*"[^>]*>(.*?)<\/span>/gs,
    (match, innerContent) => {
      changesMade++;
      return `<MetaText>${innerContent}</MetaText>`;
    }
  );
  
  // Remove standalone font/text classes from remaining elements
  modified = modified.replace(
    /className="([^"]*)"/g,
    (match, classes) => {
      let newClasses = classes
        .replace(/\bfont-anton\b/g, '')
        .replace(/\bfont-bebas\b/g, '')
        .replace(/\bfont-oswald\b/g, '')
        .replace(/\bfont-share-mono\b/g, '')
        .replace(/\bfont-share\b/g, '')
        .replace(/\btext-hero\b/g, '')
        .replace(/\btext-h[1-6]\b/g, '')
        .replace(/\btext-body-sm\b/g, '')
        .replace(/\btext-body\b/g, '')
        .replace(/\btext-meta\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (newClasses !== classes) {
        changesMade++;
      }
      
      return newClasses ? `className="${newClasses}"` : '';
    }
  );
  
  stats.violationsFixed += changesMade;
  return modified;
}

/**
 * Process a single file
 */
function processFile(filePath) {
  stats.filesScanned++;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  // Detect needed components
  const neededComponents = detectNeededComponents(content);
  
  if (neededComponents.length === 0) {
    return; // No violations found
  }
  
  // Fix violations
  content = fixTypographyViolations(content);
  
  // Add imports
  content = ensureTypographyImport(content, neededComponents);
  
  // Save if modified
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    stats.filesModified++;
    console.log(`✓ Fixed: ${path.relative(ROOT_DIR, filePath)}`);
  }
}

/**
 * Recursively process directory
 */
function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        processDirectory(fullPath);
      }
    } else if (entry.isFile() && /\.(tsx|jsx)$/.test(entry.name)) {
      processFile(fullPath);
    }
  }
}

/**
 * Generate report
 */
function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('TYPOGRAPHY VIOLATION FIX REPORT');
  console.log('='.repeat(80));
  console.log(`\nFiles Scanned: ${stats.filesScanned}`);
  console.log(`Files Modified: ${stats.filesModified}`);
  console.log(`Imports Added: ${stats.importsAdded}`);
  console.log(`Typography Violations Fixed: ${stats.violationsFixed}`);
  console.log('\n' + '='.repeat(80));
}

/**
 * Main execution
 */
console.log('Starting Typography Violation Fixer...\n');

processDirectory(SRC_DIR);
generateReport();

console.log('\n✅ Typography fix process complete!\n');

process.exit(0);
