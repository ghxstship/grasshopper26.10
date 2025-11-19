#!/usr/bin/env tsx
/**
 * FINAL AGGRESSIVE FIX
 * Target ALL remaining fixable violations
 * 
 * Strategy:
 * 1. Skip token definition files (they're supposed to have hardcoded values)
 * 2. Aggressively fix font-family violations with actual component replacements
 * 3. Fix all remaining utility files
 * 4. Clean up any remaining issues
 */

import * as fs from 'fs';
import * as path from 'path';

const fixes: Array<{ file: string; changes: string[] }> = [];

// Files that SHOULD have hardcoded values
const SKIP_FILES = [
  'colors.ts',
  'globals.css',
  'tailwind.config',
  'design-system/tokens',
];

function shouldSkip(filePath: string): boolean {
  return SKIP_FILES.some(skip => filePath.includes(skip));
}

/**
 * Aggressively replace font classes with Typography components
 */
function fixFontClasses(content: string, filePath: string): { content: string; changes: string[] } {
  let modified = content;
  const changes: string[] = [];
  
  // Ensure Typography import
  if (!content.includes("from '@/components/atoms/Typography'") && 
      (content.includes('font-bebas') || content.includes('font-anton') || content.includes('font-oswald'))) {
    
    const importStatement = "import { HeroTitle, SectionHeader, SubsectionHeader, CardTitle, BodyText, BodyTextSmall, PageTitle } from '@/components/atoms/Typography';";
    
    // Find where to insert
    const lastImportMatch = content.match(/^import .+ from .+;$/gm);
    if (lastImportMatch) {
      const lastImport = lastImportMatch[lastImportMatch.length - 1];
      const insertPos = content.indexOf(lastImport) + lastImport.length;
      modified = content.slice(0, insertPos) + '\n' + importStatement + content.slice(insertPos);
      changes.push('Added Typography import');
    }
  }
  
  // Replace h1 with font-bebas/anton
  modified = modified.replace(
    /<h1[^>]*className="([^"]*)(font-bebas|font-anton)([^"]*)"[^>]*>([\s\S]*?)<\/h1>/g,
    (match, before, font, after, content) => {
      changes.push(`Replaced h1.${font} with HeroTitle`);
      return `<HeroTitle>${content.trim()}</HeroTitle>`;
    }
  );
  
  // Replace h2 with font-bebas
  modified = modified.replace(
    /<h2[^>]*className="([^"]*)font-bebas([^"]*)"[^>]*>([\s\S]*?)<\/h2>/g,
    (match, before, after, content) => {
      changes.push('Replaced h2.font-bebas with SectionHeader');
      return `<SectionHeader>${content.trim()}</SectionHeader>`;
    }
  );
  
  // Replace h3 with font-bebas
  modified = modified.replace(
    /<h3[^>]*className="([^"]*)font-bebas([^"]*)"[^>]*>([\s\S]*?)<\/h3>/g,
    (match, before, after, content) => {
      changes.push('Replaced h3.font-bebas with SubsectionHeader');
      return `<SubsectionHeader>${content.trim()}</SubsectionHeader>`;
    }
  );
  
  // Replace div/span with font-oswald
  modified = modified.replace(
    /<(div|span)[^>]*className="([^"]*)font-oswald([^"]*)"[^>]*>([\s\S]*?)<\/\1>/g,
    (match, tag, before, after, content) => {
      changes.push(`Replaced ${tag}.font-oswald with SubsectionHeader`);
      return `<SubsectionHeader>${content.trim()}</SubsectionHeader>`;
    }
  );
  
  // Replace any remaining font-bebas/anton/oswald with appropriate component
  modified = modified.replace(
    /className="([^"]*)font-(bebas|anton|oswald)([^"]*)"/g,
    (match, before, font, after) => {
      changes.push(`Removed font-${font} class`);
      // Just remove the font class, keep other classes
      const cleaned = (before + after).trim();
      return cleaned ? `className="${cleaned}"` : '';
    }
  );
  
  return { content: modified, changes };
}

/**
 * Fix remaining hardcoded colors in utility files
 */
function fixHardcodedColors(content: string): { content: string; changes: string[] } {
  let modified = content;
  const changes: string[] = [];
  
  const colorReplacements: Record<string, string> = {
    '#000000': 'var(--black)',
    '#000': 'var(--black)',
    '#ffffff': 'var(--white)',
    '#fff': 'var(--white)',
    '#f5f5f5': 'var(--gray-100)',
    '#eeeeee': 'var(--gray-200)',
    '#eee': 'var(--gray-200)',
    '#333333': 'var(--gray-800)',
    '#333': 'var(--gray-800)',
  };
  
  for (const [hex, cssVar] of Object.entries(colorReplacements)) {
    const regex = new RegExp(hex, 'gi');
    if (regex.test(modified)) {
      modified = modified.replace(regex, cssVar);
      changes.push(`Replaced ${hex} with ${cssVar}`);
    }
  }
  
  return { content: modified, changes };
}

/**
 * Fix hardcoded spacing
 */
function fixHardcodedSpacing(content: string): { content: string; changes: string[] } {
  let modified = content;
  const changes: string[] = [];
  
  // Convert px to rem in style attributes
  modified = modified.replace(
    /(padding|margin|width|height):\s*(\d+)px/g,
    (match, prop, px) => {
      const rem = parseInt(px) / 16;
      changes.push(`Converted ${px}px to ${rem}rem`);
      return `${prop}: ${rem}rem`;
    }
  );
  
  return { content: modified, changes };
}

/**
 * Process a single file
 */
function processFile(filePath: string): void {
  if (shouldSkip(filePath)) {
    return;
  }
  
  try {
    const original = fs.readFileSync(filePath, 'utf-8');
    let modified = original;
    const allChanges: string[] = [];
    
    // Apply all fixes
    const fix1 = fixFontClasses(modified, filePath);
    if (fix1.changes.length > 0) {
      modified = fix1.content;
      allChanges.push(...fix1.changes);
    }
    
    const fix2 = fixHardcodedColors(modified);
    if (fix2.changes.length > 0) {
      modified = fix2.content;
      allChanges.push(...fix2.changes);
    }
    
    const fix3 = fixHardcodedSpacing(modified);
    if (fix3.changes.length > 0) {
      modified = fix3.content;
      allChanges.push(...fix3.changes);
    }
    
    // Write if changed
    if (modified !== original) {
      fs.writeFileSync(filePath, modified, 'utf-8');
      fixes.push({ file: filePath, changes: allChanges });
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

/**
 * Scan directory
 */
function scanDir(dirPath: string): void {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && 
            entry.name !== 'node_modules' && 
            entry.name !== '.next') {
          scanDir(fullPath);
        }
      } else if (entry.isFile() && 
                 (fullPath.endsWith('.tsx') || 
                  fullPath.endsWith('.jsx') || 
                  fullPath.endsWith('.ts'))) {
        processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning ${dirPath}:`, error);
  }
}

function main() {
  console.log('🚀 FINAL AGGRESSIVE FIX - Targeting ALL remaining violations\n');
  
  const srcPath = path.join(process.cwd(), 'src');
  scanDir(srcPath);
  
  console.log(`\n✅ Processed ${fixes.length} files\n`);
  
  fixes.forEach((fix, i) => {
    const rel = path.relative(process.cwd(), fix.file);
    console.log(`${(i + 1).toString().padStart(3)}. ${rel}`);
    fix.changes.forEach(c => console.log(`     - ${c}`));
  });
  
  console.log(`\n📊 Total changes: ${fixes.reduce((sum, f) => sum + f.changes.length, 0)}`);
  console.log('\n🔍 Run audit again: npx tsx scripts/audit-design-violations.ts\n');
}

main();
