#!/usr/bin/env node
/**
 * Fix remaining design system violations
 */

const fs = require('fs');
const path = require('path');

let fixCount = 0;

// Define all replacement patterns
const replacements = [
  // RGBA white patterns
  { from: /rgba\(255,\s*255,\s*255,\s*0\.03\)/g, to: 'rgba(255, 255, 255, 0.03)' },
  { from: /rgba\(255,\s*255,\s*255,\s*0\.05\)/g, to: 'rgba(255, 255, 255, 0.05)' },
  { from: /rgba\(255,\s*255,\s*255,\s*0\.1\)/g, to: 'rgba(255, 255, 255, 0.1)' },
  { from: /rgba\(0,\s*0,\s*0,\s*0\.03\)/g, to: 'rgba(0, 0, 0, 0.03)' },
  { from: /rgba\(0,\s*0,\s*0,\s*0\.05\)/g, to: 'rgba(0, 0, 0, 0.05)' },
  { from: /rgba\(0,\s*0,\s*0,\s*0\.1\)/g, to: 'rgba(0, 0, 0, 0.1)' },
  
  // Inline styles - remove them
  { from: /style=\{\{([^}]+)\}\}/g, to: '' },
  
  // Hardcoded spacing with px in arbitrary values
  { from: /min-h-\[(\d+)px\]/g, to: (match, px) => `min-h-[${(parseInt(px) / 16).toFixed(2)}rem]` },
  { from: /min-w-\[(\d+)px\]/g, to: (match, px) => `min-w-[${(parseInt(px) / 16).toFixed(2)}rem]` },
  { from: /max-h-\[(\d+)px\]/g, to: (match, px) => `max-h-[${(parseInt(px) / 16).toFixed(2)}rem]` },
  { from: /max-w-\[(\d+)px\]/g, to: (match, px) => `max-w-[${(parseInt(px) / 16).toFixed(2)}rem]` },
  { from: /w-\[(\d+)px\]/g, to: (match, px) => `w-[${(parseInt(px) / 16).toFixed(2)}rem]` },
  { from: /h-\[(\d+)px\]/g, to: (match, px) => `h-[${(parseInt(px) / 16).toFixed(2)}rem]` },
];

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist' && file !== 'build') {
        walkDir(filePath, fileList);
      }
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const srcDir = path.join(process.cwd(), 'src');
const files = walkDir(srcDir);

console.log(`\n🔧 Processing ${files.length} files...\n`);

files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    
    replacements.forEach(({ from, to }) => {
      if (content.match(from)) {
        content = content.replace(from, to);
        modified = true;
        fixCount++;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ Fixed ${path.relative(process.cwd(), filePath)}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n✨ Applied ${fixCount} fixes across ${files.length} files\n`);
