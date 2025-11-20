#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { resolve } from 'path';

const fixes = [
  // h1 -> HeroTitle or PageTitle
  { pattern: /<h1\s+className="([^"]*)">/g, replacement: '<PageTitle className="$1">' },
  { pattern: /<h1\s*>/g, replacement: '<PageTitle>' },
  { pattern: /<\/h1>/g, replacement: '</PageTitle>' },
  
  // h2 -> SectionHeader
  { pattern: /<h2\s+className="([^"]*)">/g, replacement: '<SectionHeader className="$1">' },
  { pattern: /<h2\s*>/g, replacement: '<SectionHeader>' },
  { pattern: /<\/h2>/g, replacement: '</SectionHeader>' },
  
  // h3 -> SubsectionHeader
  { pattern: /<h3\s+className="([^"]*)">/g, replacement: '<SubsectionHeader className="$1">' },
  { pattern: /<h3\s*>/g, replacement: '<SubsectionHeader>' },
  { pattern: /<\/h3>/g, replacement: '</SubsectionHeader>' },
  
  // h4 -> CardTitle
  { pattern: /<h4\s+className="([^"]*)">/g, replacement: '<CardTitle className="$1">' },
  { pattern: /<h4\s*>/g, replacement: '<CardTitle>' },
  { pattern: /<\/h4>/g, replacement: '</CardTitle>' },
  
  // h5 -> CardTitle
  { pattern: /<h5\s+className="([^"]*)">/g, replacement: '<CardTitle className="$1">' },
  { pattern: /<h5\s*>/g, replacement: '<CardTitle>' },
  { pattern: /<\/h5>/g, replacement: '</CardTitle>' },
  
  // h6 -> SmallHeader
  { pattern: /<h6\s+className="([^"]*)">/g, replacement: '<SmallHeader className="$1">' },
  { pattern: /<h6\s*>/g, replacement: '<SmallHeader>' },
  { pattern: /<\/h6>/g, replacement: '</SmallHeader>' },
];

const importComponents = new Set();

function applyFixes(content, filePath) {
  let modified = content;
  let changed = false;
  
  // Track which components we need
  const componentsNeeded = new Set();
  
  for (const fix of fixes) {
    const matches = modified.match(fix.pattern);
    if (matches) {
      modified = modified.replace(fix.pattern, fix.replacement);
      changed = true;
      
      // Extract component name from replacement
      const componentMatch = fix.replacement.match(/<(\w+)/);
      if (componentMatch) {
        componentsNeeded.add(componentMatch[1]);
      }
    }
  }
  
  if (!changed) return content;
  
  // Check if Typography import exists
  const hasTypographyImport = /from ['"]@\/components\/atoms\/Typography['"]/.test(modified);
  
  if (hasTypographyImport) {
    // Update existing import
    const importMatch = modified.match(/import\s+{([^}]+)}\s+from\s+['"]@\/components\/atoms\/Typography['"]/);
    if (importMatch) {
      const existingImports = importMatch[1].split(',').map(s => s.trim());
      const allImports = new Set([...existingImports, ...componentsNeeded]);
      const newImportLine = `import { ${Array.from(allImports).join(', ')} } from "@/components/atoms/Typography"`;
      modified = modified.replace(importMatch[0], newImportLine);
    }
  } else {
    // Add new import after other imports
    const lastImportMatch = modified.match(/import[^;]+;(?=\n\n|$)/);
    if (lastImportMatch) {
      const newImport = `\nimport { ${Array.from(componentsNeeded).join(', ')} } from "@/components/atoms/Typography";`;
      modified = modified.replace(lastImportMatch[0], lastImportMatch[0] + newImport);
    }
  }
  
  return modified;
}

async function main() {
  const files = await glob('src/app/**/*.tsx', {
    cwd: process.cwd(),
    absolute: true,
    ignore: [
      '**/placeholder/**',
      '**/webhook/**',
      '**/sync/**',
      '**/batch/**',
      '**/n8n/**',
      '**/integrations/**',
      '**/google-places/**',
    ]
  });
  
  let fixedCount = 0;
  
  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8');
      
      // Skip files with "UI implementation pending"
      if (content.includes('UI implementation pending')) continue;
      
      const fixed = applyFixes(content, file);
      
      if (fixed !== content) {
        writeFileSync(file, fixed, 'utf-8');
        fixedCount++;
        console.log(`Fixed: ${file.replace(process.cwd(), '')}`);
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }
  
  console.log(`\nFixed ${fixedCount} files`);
}

main().catch(console.error);
