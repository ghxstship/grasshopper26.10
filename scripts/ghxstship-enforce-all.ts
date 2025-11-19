#!/usr/bin/env tsx
/**
 * GHXSTSHIP Design System Enforcement
 * Zero tolerance - fixes ALL violations based on Design System Reference
 */

import * as fs from 'fs';
import * as path from 'path';

const SKIP_FILES = ['design-system/tokens', 'globals.css', 'tailwind.config'];
const fixes: Array<{ file: string; changes: string[] }> = [];

function shouldSkip(filePath: string): boolean {
  return SKIP_FILES.some(skip => filePath.includes(skip));
}

function fixFile(filePath: string): void {
  if (shouldSkip(filePath)) return;
  
  try {
    const original = fs.readFileSync(filePath, 'utf-8');
    let modified = original;
    const changes: string[] = [];
    
    // 1. Fix raw font classes - GHXSTSHIP uses ONLY anton, bebas, share-tech, share-tech-mono
    // Replace font-oswald with font-bebas (closest match per design system)
    if (modified.includes('font-oswald')) {
      modified = modified.replace(/font-oswald/g, 'font-bebas');
      changes.push('Replaced font-oswald with font-bebas (GHXSTSHIP standard)');
    }
    
    // 2. Fix hardcoded colors - GHXSTSHIP uses ONLY black, white, greyscale
    const colorReplacements: Record<string, string> = {
      '#000000': 'var(--color-black)',
      '#000': 'var(--color-black)',
      '#FFFFFF': 'var(--color-white)',
      '#FFF': 'var(--color-white)',
      '#ffffff': 'var(--color-white)',
      '#fff': 'var(--color-white)',
      '#F5F5F5': 'var(--grey-100)',
      '#f5f5f5': 'var(--grey-100)',
      '#E5E5E5': 'var(--grey-200)',
      '#e5e5e5': 'var(--grey-200)',
      '#eeeeee': 'var(--grey-200)',
      '#eee': 'var(--grey-200)',
      '#D4D4D4': 'var(--grey-300)',
      '#d4d4d4': 'var(--grey-300)',
      '#A3A3A3': 'var(--grey-400)',
      '#a3a3a3': 'var(--grey-400)',
      '#999': 'var(--grey-500)',
      '#737373': 'var(--grey-500)',
      '#525252': 'var(--grey-600)',
      '#666': 'var(--grey-600)',
      '#404040': 'var(--grey-700)',
      '#262626': 'var(--grey-800)',
      '#171717': 'var(--grey-900)',
      '#333': 'var(--grey-800)',
    };
    
    for (const [hex, cssVar] of Object.entries(colorReplacements)) {
      const regex = new RegExp(hex, 'g');
      if (regex.test(modified)) {
        modified = modified.replace(regex, cssVar);
        changes.push(`Fixed ${hex} -> ${cssVar}`);
      }
    }
    
    // 3. Fix RGB/RGBA colors - convert to CSS variables
    // Black RGB
    modified = modified.replace(/rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)/g, () => {
      changes.push('Fixed rgb(0,0,0) -> var(--color-black)');
      return 'var(--color-black)';
    });
    
    // White RGB
    modified = modified.replace(/rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)/g, () => {
      changes.push('Fixed rgb(255,255,255) -> var(--color-white)');
      return 'var(--color-white)';
    });
    
    // RGBA with transparency - use modern CSS syntax
    modified = modified.replace(/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*([\d.]+)\s*\)/g, (match, alpha) => {
      changes.push(`Fixed rgba(0,0,0,${alpha}) -> rgb(0 0 0 / ${alpha})`);
      return `rgb(0 0 0 / ${alpha})`;
    });
    
    modified = modified.replace(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([\d.]+)\s*\)/g, (match, alpha) => {
      changes.push(`Fixed rgba(255,255,255,${alpha}) -> rgb(255 255 255 / ${alpha})`);
      return `rgb(255 255 255 / ${alpha})`;
    });
    
    // 4. Fix hardcoded spacing - convert px to rem (base 16px)
    modified = modified.replace(/(padding|margin|width|height|font-size|border-radius):\s*(\d+)px/g, (match, prop, px) => {
      const num = parseInt(px);
      if (num === 0) return match;
      if (num === 1 && prop === 'border') return match; // Keep 1px borders
      
      const rem = num / 16;
      changes.push(`Converted ${px}px to ${rem}rem`);
      return `${prop}: ${rem}rem`;
    });
    
    // 5. Fix directional properties for RTL support
    modified = modified.replace(/margin-left:/g, () => {
      changes.push('Fixed margin-left -> margin-inline-start');
      return 'margin-inline-start:';
    });
    
    modified = modified.replace(/margin-right:/g, () => {
      changes.push('Fixed margin-right -> margin-inline-end');
      return 'margin-inline-end:';
    });
    
    modified = modified.replace(/padding-left:/g, () => {
      changes.push('Fixed padding-left -> padding-inline-start');
      return 'padding-inline-start:';
    });
    
    modified = modified.replace(/padding-right:/g, () => {
      changes.push('Fixed padding-right -> padding-inline-end');
      return 'padding-inline-end:';
    });
    
    // 6. Fix bg-gray Tailwind classes - replace with semantic classes
    const bgReplacements: Record<string, string> = {
      'bg-gray-50': 'bg-grey-100',
      'bg-gray-100': 'bg-grey-100',
      'bg-gray-200': 'bg-grey-200',
      'bg-gray-300': 'bg-grey-300',
      'bg-gray-400': 'bg-grey-400',
      'bg-gray-500': 'bg-grey-500',
      'bg-gray-600': 'bg-grey-600',
      'bg-gray-700': 'bg-grey-700',
      'bg-gray-800': 'bg-grey-800',
      'bg-gray-900': 'bg-grey-900',
      'bg-gray-950': 'bg-grey-900',
      'text-gray-400': 'text-grey-400',
      'text-gray-500': 'text-grey-500',
      'text-gray-600': 'text-grey-600',
      'text-gray-700': 'text-grey-700',
      'text-gray-900': 'text-black',
      'border-gray-200': 'border-grey-200',
      'border-gray-300': 'border-grey-300',
      'border-gray-700': 'border-grey-700',
      'border-gray-800': 'border-grey-800',
    };
    
    for (const [old, replacement] of Object.entries(bgReplacements)) {
      const regex = new RegExp(`\\b${old}\\b`, 'g');
      if (regex.test(modified)) {
        modified = modified.replace(regex, replacement);
        changes.push(`Fixed ${old} -> ${replacement}`);
      }
    }
    
    // Write if changed
    if (modified !== original) {
      fs.writeFileSync(filePath, modified, 'utf-8');
      fixes.push({ file: filePath, changes });
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
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
                  fullPath.endsWith('.jsx') ||
                  fullPath.endsWith('.css'))) {
        fixFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning ${dirPath}:`, error);
  }
}

function main() {
  console.log('🎨 GHXSTSHIP Design System Enforcement\n');
  console.log('Zero tolerance - fixing ALL violations\n');
  
  const srcPath = path.join(process.cwd(), 'src');
  scanDir(srcPath);
  
  console.log(`\n✅ Fixed ${fixes.length} files\n`);
  
  const totalChanges = fixes.reduce((sum, f) => sum + f.changes.length, 0);
  
  fixes.slice(0, 50).forEach((fix, i) => {
    const rel = path.relative(process.cwd(), fix.file);
    console.log(`${(i + 1).toString().padStart(3)}. ${rel}`);
    fix.changes.slice(0, 3).forEach(c => console.log(`     - ${c}`));
    if (fix.changes.length > 3) {
      console.log(`     ... and ${fix.changes.length - 3} more changes`);
    }
  });
  
  if (fixes.length > 50) {
    console.log(`\n... and ${fixes.length - 50} more files`);
  }
  
  console.log(`\n📊 Total: ${totalChanges} changes across ${fixes.length} files`);
  console.log('\n🔍 Run audit: npx tsx scripts/audit-design-violations.ts\n');
}

main();
