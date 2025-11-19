#!/usr/bin/env node
/**
 * Normalize Design System - Remove Platform-Specific Variants
 * Removes atlvs, compvss, gvteway from all design system code
 */

const fs = require('fs');
const path = require('path');

let filesModified = 0;
let replacementsMade = 0;

console.log('\n🔧 NORMALIZING DESIGN SYSTEM - REMOVING PLATFORM-SPECIFIC VARIANTS\n');
console.log('='.repeat(80) + '\n');

// Replacement mappings
const REPLACEMENTS = {
  // Variant replacements
  'variant="atlvs"': 'variant="primary"',
  'variant="compvss"': 'variant="primary"',
  'variant="gvteway"': 'variant="primary"',
  'variant={"atlvs"}': 'variant={"primary"}',
  'variant={"compvss"}': 'variant={"primary"}',
  'variant={"gvteway"}': 'variant={"primary"}',
  "variant='atlvs'": "variant='primary'",
  "variant='compvss'": "variant='primary'",
  "variant='gvteway'": "variant='primary'",
  
  // Outline variants
  'variant="atlvs-outline"': 'variant="outline"',
  'variant="compvss-outline"': 'variant="outline"',
  'variant="gvteway-outline"': 'variant="outline"',
  
  // Ghost variants
  'variant="atlvs-ghost"': 'variant="ghost"',
  'variant="compvss-ghost"': 'variant="ghost"',
  'variant="gvteway-ghost"': 'variant="ghost"',
  
  // CSS class names
  '.atlvs-text-gradient': '.brand-text-gradient',
  '.compvss-text-gradient': '.brand-text-gradient',
  '.gvteway-text-gradient': '.brand-text-gradient',
  
  'className="atlvs-text-gradient"': 'className="brand-text-gradient"',
  'className="compvss-text-gradient"': 'className="brand-text-gradient"',
  'className="gvteway-text-gradient"': 'className="brand-text-gradient"',
};

function walkDirectory(dir, callback) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      if (!file.name.startsWith('.') && file.name !== 'node_modules' && file.name !== '.next') {
        walkDirectory(fullPath, callback);
      }
    } else if (file.isFile() && /\.(tsx?|jsx?|css)$/.test(file.name)) {
      callback(fullPath);
    }
  });
}

function normalizeFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    let fileReplacements = 0;
    
    // Apply all replacements
    Object.entries(REPLACEMENTS).forEach(([from, to]) => {
      const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = (content.match(regex) || []).length;
      
      if (matches > 0) {
        content = content.replace(regex, to);
        modified = true;
        fileReplacements += matches;
        replacementsMade += matches;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      filesModified++;
      console.log(`✅ ${path.relative(process.cwd(), filePath)} (${fileReplacements} replacements)`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Process src directory
const srcDir = path.join(process.cwd(), 'src');
console.log('📁 Processing src directory...\n');
walkDirectory(srcDir, normalizeFile);

console.log('\n' + '='.repeat(80));
console.log('📊 NORMALIZATION COMPLETE');
console.log('='.repeat(80) + '\n');
console.log(`✅ Files Modified: ${filesModified}`);
console.log(`🔄 Total Replacements: ${replacementsMade}\n`);

if (filesModified > 0) {
  console.log('✨ Design system normalized - all platform-specific variants removed!\n');
} else {
  console.log('ℹ️  No platform-specific variants found.\n');
}
