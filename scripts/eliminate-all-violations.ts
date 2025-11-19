#!/usr/bin/env tsx
/**
 * ELIMINATE ALL VIOLATIONS - Final Pass
 * Target every single remaining violation that can be fixed
 * 
 * Strategy:
 * 1. Fix email templates completely
 * 2. Add comments to Apple Wallet (required by API)
 * 3. Fix all remaining page files
 * 4. Clean up any edge cases
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

const fixes: Array<{ file: string; before: number; after: number; changes: string[] }> = [];

function fixFile(filePath: string): void {
  if (shouldSkip(filePath)) return;
  
  try {
    const original = fs.readFileSync(filePath, 'utf-8');
    let modified = original;
    const changes: string[] = [];
    
    // Count violations before
    const hexBefore = (original.match(/#[0-9A-Fa-f]{3,8}/g) || []).length;
    const rgbaBefore = (original.match(/rgba?\([^)]+\)/g) || []).length;
    const pxBefore = (original.match(/:\s*\d+px/g) || []).length;
    const before = hexBefore + rgbaBefore + pxBefore;
    
    if (before === 0) return; // No violations
    
    // Fix #999 -> var(--gray-500)
    if (modified.includes('#999')) {
      modified = modified.replace(/#999/g, 'var(--gray-500)');
      changes.push('Fixed #999 -> var(--gray-500)');
    }
    
    // Fix #666 -> var(--gray-600)
    if (modified.includes('#666')) {
      modified = modified.replace(/#666/g, 'var(--gray-600)');
      changes.push('Fixed #666 -> var(--gray-600)');
    }
    
    // Fix rgba colors in page files
    modified = modified.replace(/rgba\(255,\s*165,\s*0,\s*0\.1\)/g, () => {
      changes.push('Fixed rgba(255,165,0,0.1) -> atlvs-orange with opacity');
      return 'rgb(255 136 0 / 0.1)';
    });
    
    modified = modified.replace(/rgba\(0,\s*255,\s*255,\s*0\.1\)/g, () => {
      changes.push('Fixed rgba(0,255,255,0.1) -> compvss-cyan with opacity');
      return 'rgb(0 255 255 / 0.1)';
    });
    
    // Fix font-size: 0 -> font-size: 0.75rem (minimum readable)
    modified = modified.replace(/font-size:\s*0(?!\.)/g, () => {
      changes.push('Fixed font-size: 0 -> 0.75rem');
      return 'font-size: 0.75rem';
    });
    
    // Fix border: 1px solid -> keep as is (1px is standard)
    // But fix other px values
    modified = modified.replace(/:\s*(\d+)px/g, (match, px) => {
      const num = parseInt(px);
      if (num === 0) return match;
      if (num === 1 && match.includes('border')) return match; // Keep 1px borders
      
      changes.push(`Converted ${px}px to ${num / 16}rem`);
      return `: ${num / 16}rem`;
    });
    
    // For Apple Wallet - add comment explaining API requirement
    if (filePath.includes('apple-wallet.ts') && !modified.includes('// Apple Wallet API requires rgb() format')) {
      const rgbMatch = modified.indexOf('foregroundColor:');
      if (rgbMatch !== -1) {
        const lineStart = modified.lastIndexOf('\n', rgbMatch);
        modified = modified.slice(0, lineStart + 1) +
          '      // Apple Wallet API requires rgb() format - cannot use CSS variables\n' +
          modified.slice(lineStart + 1);
        changes.push('Added API requirement comment');
      }
    }
    
    // Write if changed
    if (modified !== original) {
      fs.writeFileSync(filePath, modified, 'utf-8');
      
      // Count violations after
      const hexAfter = (modified.match(/#[0-9A-Fa-f]{3,8}/g) || []).length;
      const rgbaAfter = (modified.match(/rgba?\([^)]+\)/g) || []).length;
      const pxAfter = (modified.match(/:\s*\d+px/g) || []).length;
      const after = hexAfter + rgbaAfter + pxAfter;
      
      fixes.push({ file: filePath, before, after, changes });
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
  console.log('🎯 ELIMINATE ALL VIOLATIONS - Final Pass\n');
  
  const srcPath = path.join(process.cwd(), 'src');
  scanDir(srcPath);
  
  if (fixes.length === 0) {
    console.log('✅ No fixable violations found!\n');
    return;
  }
  
  console.log(`\n✅ Fixed ${fixes.length} files\n`);
  
  const totalBefore = fixes.reduce((sum, f) => sum + f.before, 0);
  const totalAfter = fixes.reduce((sum, f) => sum + f.after, 0);
  const totalFixed = totalBefore - totalAfter;
  
  fixes.forEach((fix, i) => {
    const rel = path.relative(process.cwd(), fix.file);
    console.log(`${(i + 1).toString().padStart(2)}. ${rel}`);
    console.log(`    Violations: ${fix.before} → ${fix.after} (${fix.before - fix.after} fixed)`);
    fix.changes.forEach(c => console.log(`    - ${c}`));
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total violations fixed: ${totalFixed}`);
  console.log(`   Remaining violations: ${totalAfter}`);
  console.log(`\n🔍 Run final audit: npx tsx scripts/audit-design-violations.ts\n`);
}

main();
