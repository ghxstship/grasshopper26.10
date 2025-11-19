#!/usr/bin/env tsx
/**
 * FINAL CLEANUP - Fix the last 44 violations
 * Target only non-token files
 */

import * as fs from 'fs';
import * as path from 'path';

const SKIP_TOKEN_FILES = [
  'design-system/tokens',
  'globals.css',
  'tailwind.config',
];

function shouldSkip(filePath: string): boolean {
  return SKIP_TOKEN_FILES.some(skip => filePath.includes(skip));
}

const fixes: Array<{ file: string; before: number; after: number }> = [];

function fixFile(filePath: string): void {
  if (shouldSkip(filePath)) return;
  
  try {
    const original = fs.readFileSync(filePath, 'utf-8');
    let modified = original;
    let changeCount = 0;
    
    // Count violations before
    const hexMatches = (original.match(/#[0-9A-Fa-f]{3,8}/g) || []).length;
    const rgbaMatches = (original.match(/rgba?\([^)]+\)/g) || []).length;
    const pxMatches = (original.match(/:\s*\d+px/g) || []).length;
    const before = hexMatches + rgbaMatches + pxMatches;
    
    // Fix all hex colors
    modified = modified.replace(/#000000|#000\b/g, () => { changeCount++; return 'var(--black)'; });
    modified = modified.replace(/#ffffff|#fff\b/g, () => { changeCount++; return 'var(--white)'; });
    modified = modified.replace(/#f5f5f5/gi, () => { changeCount++; return 'var(--gray-100)'; });
    modified = modified.replace(/#eeeeee|#eee\b/gi, () => { changeCount++; return 'var(--gray-200)'; });
    modified = modified.replace(/#333333|#333\b/g, () => { changeCount++; return 'var(--gray-800)'; });
    
    // Fix rgba colors - convert to CSS variables with opacity
    modified = modified.replace(/rgba\(0,\s*0,\s*0,\s*([\d.]+)\)/g, (match, alpha) => {
      changeCount++;
      return `rgb(var(--black-rgb) / ${alpha})`;
    });
    
    modified = modified.replace(/rgba\(255,\s*255,\s*255,\s*([\d.]+)\)/g, (match, alpha) => {
      changeCount++;
      return `rgb(var(--white-rgb) / ${alpha})`;
    });
    
    // Fix px spacing - convert to rem
    modified = modified.replace(/(padding|margin|width|height|border-radius|font-size):\s*(\d+)px/g, 
      (match, prop, px) => {
        if (parseInt(px) === 0) return match;
        changeCount++;
        const rem = parseInt(px) / 16;
        return `${prop}: ${rem}rem`;
      }
    );
    
    // Fix border: 1px -> border-width: 1px (keep 1px for borders)
    modified = modified.replace(/border:\s*1px/g, 'border: 1px');
    
    if (modified !== original) {
      fs.writeFileSync(filePath, modified, 'utf-8');
      
      // Count violations after
      const hexAfter = (modified.match(/#[0-9A-Fa-f]{3,8}/g) || []).length;
      const rgbaAfter = (modified.match(/rgba?\([^)]+\)/g) || []).length;
      const pxAfter = (modified.match(/:\s*\d+px/g) || []).length;
      const after = hexAfter + rgbaAfter + pxAfter;
      
      fixes.push({ file: filePath, before, after });
    }
  } catch (error) {
    console.error(`Error: ${filePath}`, error);
  }
}

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
                  fullPath.endsWith('.ts') || 
                  fullPath.endsWith('.jsx'))) {
        fixFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning ${dirPath}:`, error);
  }
}

function main() {
  console.log('🎯 FINAL CLEANUP - Targeting last 44 violations\n');
  
  const srcPath = path.join(process.cwd(), 'src');
  scanDir(srcPath);
  
  console.log(`\n✅ Fixed ${fixes.length} files\n`);
  
  const totalBefore = fixes.reduce((sum, f) => sum + f.before, 0);
  const totalAfter = fixes.reduce((sum, f) => sum + f.after, 0);
  
  fixes.forEach((fix, i) => {
    const rel = path.relative(process.cwd(), fix.file);
    const reduction = fix.before - fix.after;
    console.log(`${(i + 1).toString().padStart(2)}. ${rel}`);
    console.log(`    Violations: ${fix.before} → ${fix.after} (${reduction} fixed)`);
  });
  
  console.log(`\n📊 Total violations fixed: ${totalBefore - totalAfter}`);
  console.log(`📈 Remaining: ${totalAfter}\n`);
  console.log('🔍 Run final audit: npx tsx scripts/audit-design-violations.ts\n');
}

main();
