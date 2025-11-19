#!/usr/bin/env node
/**
 * Remove Platform-Specific Variant Definitions from Components
 * Removes atlvs, compvss, gvteway variant definitions from Button, Card, etc.
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔧 REMOVING PLATFORM-SPECIFIC VARIANT DEFINITIONS FROM COMPONENTS\n');
console.log('='.repeat(80) + '\n');

// Files to process
const componentsToFix = [
  'src/components/atoms/Button.tsx',
  'src/components/atoms/Card.tsx',
  'src/components/atoms/Input.tsx',
  'src/components/atoms/Select.tsx',
  'src/components/atoms/Spinner.tsx',
  'src/app/globals.css',
];

componentsToFix.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  let modified = false;
  
  // Remove platform-specific variant definitions
  const platformVariantPatterns = [
    // Button/Card variants with full definitions
    /\/\/\s*GVTEWAY variants[\s\S]*?gvteway:\s*"[^"]*",?\s*"gvteway-outline":\s*"[^"]*",?\s*"gvteway-ghost":\s*"[^"]*",?\s*/g,
    /\/\/\s*COMPVSS variants[\s\S]*?compvss:\s*"[^"]*",?\s*"compvss-outline":\s*"[^"]*",?\s*"compvss-ghost":\s*"[^"]*",?\s*/g,
    /\/\/\s*ATLVS variants[\s\S]*?atlvs:\s*"[^"]*",?\s*"atlvs-outline":\s*"[^"]*",?\s*"atlvs-ghost":\s*"[^"]*",?\s*/g,
    
    // Individual variant lines
    /gvteway:\s*"[^"]*",?\s*\n/g,
    /compvss:\s*"[^"]*",?\s*\n/g,
    /atlvs:\s*"[^"]*",?\s*\n/g,
    /"gvteway-outline":\s*"[^"]*",?\s*\n/g,
    /"compvss-outline":\s*"[^"]*",?\s*\n/g,
    /"atlvs-outline":\s*"[^"]*",?\s*\n/g,
    /"gvteway-ghost":\s*"[^"]*",?\s*\n/g,
    /"compvss-ghost":\s*"[^"]*",?\s*\n/g,
    /"atlvs-ghost":\s*"[^"]*",?\s*\n/g,
    
    // CSS gradient classes
    /\.gvteway-text-gradient\s*\{[\s\S]*?\}/g,
    /\.compvss-text-gradient\s*\{[\s\S]*?\}/g,
    /\.atlvs-text-gradient\s*\{[\s\S]*?\}/g,
    
    // Spinner variant checks
    /variant\?\.includes\("gvteway"\)\s*\?\s*"gvteway"\s*:\s*/g,
    /variant\?\.includes\("compvss"\)\s*\?\s*"compvss"\s*:\s*/g,
    /variant\?\.includes\("atlvs"\)\s*\?\s*"atlvs"\s*:\s*/g,
  ];
  
  platformVariantPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      content = content.replace(pattern, '');
      modified = true;
    }
  });
  
  // Clean up any double commas or trailing commas
  content = content.replace(/,\s*,/g, ',');
  content = content.replace(/,\s*\}/g, '}');
  content = content.replace(/,\s*\]/g, ']');
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Removed platform variants from: ${file}`);
  } else {
    console.log(`ℹ️  No platform variants found in: ${file}`);
  }
});

console.log('\n✨ Platform-specific variant definitions removed!\n');
