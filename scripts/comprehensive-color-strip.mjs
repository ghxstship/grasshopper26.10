#!/usr/bin/env node
/**
 * Comprehensive GHXSTSHIP Color Removal
 * Strips ALL color references and replaces with monochromatic equivalents
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const COMPREHENSIVE_REPLACEMENTS = [
  // Tailwind color utilities
  [/bg-(red|blue|green|yellow|orange|purple|pink|cyan|teal|indigo|violet|rose|fuchsia|lime|emerald|sky|amber)-(\d+)/g, 'bg-black'],
  [/text-(red|blue|green|yellow|orange|purple|pink|cyan|teal|indigo|violet|rose|fuchsia|lime|emerald|sky|amber)-(\d+)/g, 'text-black'],
  [/border-(red|blue|green|yellow|orange|purple|pink|cyan|teal|indigo|violet|rose|fuchsia|lime|emerald|sky|amber)-(\d+)/g, 'border-black'],
  [/ring-(red|blue|green|yellow|orange|purple|pink|cyan|teal|indigo|violet|rose|fuchsia|lime|emerald|sky|amber)-(\d+)/g, 'ring-black'],
  [/from-(red|blue|green|yellow|orange|purple|pink|cyan|teal|indigo|violet|rose|fuchsia|lime|emerald|sky|amber)-(\d+)/g, 'from-black'],
  [/to-(red|blue|green|yellow|orange|purple|pink|cyan|teal|indigo|violet|rose|fuchsia|lime|emerald|sky|amber)-(\d+)/g, 'to-black'],
  [/via-(red|blue|green|yellow|orange|purple|pink|cyan|teal|indigo|violet|rose|fuchsia|lime|emerald|sky|amber)-(\d+)/g, 'via-grey-500'],
  
  // Hex colors (common colored ones)
  [/#FF0000/gi, '#000000'],
  [/#0000FF/gi, '#000000'],
  [/#00FF00/gi, '#000000'],
  [/#FFFF00/gi, '#A3A3A3'],
  [/#FF8800/gi, '#000000'],
  [/#8800FF/gi, '#000000'],
  [/#00FFFF/gi, '#000000'],
  [/#00CED1/gi, '#000000'],
  [/#4B0082/gi, '#000000'],
  [/#0066FF/gi, '#000000'],
  [/#0052CC/gi, '#000000'],
  [/#003D99/gi, '#000000'],
  [/#E5F0FF/gi, '#F5F5F5'],
  [/#FFF4E5/gi, '#F5F5F5'],
  [/#039/gi, '#000000'],
  
  // CSS color properties
  [/color:\s*(red|blue|green|yellow|orange|purple|cyan|teal|indigo)/gi, 'color: black'],
  [/background-color:\s*(red|blue|green|yellow|orange|purple|cyan|teal|indigo)/gi, 'background-color: black'],
  [/border-color:\s*(red|blue|green|yellow|orange|purple|cyan|teal|indigo)/gi, 'border-color: black'],
  
  // RGB/RGBA with obvious colors
  [/rgba?\(255,\s*0,\s*0[^)]*\)/gi, '#000000'],
  [/rgba?\(0,\s*0,\s*255[^)]*\)/gi, '#000000'],
  [/rgba?\(0,\s*255,\s*0[^)]*\)/gi, '#000000'],
  [/rgba?\(255,\s*255,\s*0[^)]*\)/gi, '#A3A3A3'],
  
  // Platform-specific color references
  [/gvteway-red/gi, 'black'],
  [/gvteway-yellow/gi, 'grey-400'],
  [/gvteway-blue/gi, 'black'],
  [/atlvs-green/gi, 'black'],
  [/atlvs-orange/gi, 'black'],
  [/atlvs-purple/gi, 'black'],
  [/compvss-cyan/gi, 'black'],
  [/compvss-teal/gi, 'black'],
  [/compvss-indigo/gi, 'black'],
  
  // CSS variable colors
  [/--accent:\s*#[0-9A-Fa-f]{6}/g, '--accent: #000000'],
  [/--primary:\s*#[0-9A-Fa-f]{6}/g, '--primary: #000000'],
];

function stripAllColor(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  let totalChanges = 0;
  
  for (const [pattern, replacement] of COMPREHENSIVE_REPLACEMENTS) {
    const before = content;
    content = content.replace(pattern, replacement);
    if (content !== before) {
      totalChanges++;
    }
  }
  
  if (totalChanges > 0) {
    writeFileSync(filePath, content, 'utf-8');
  }
  
  return totalChanges;
}

async function main() {
  console.log('🎨 Comprehensive GHXSTSHIP Color Removal\n');
  
  const patterns = [
    'src/**/*.{ts,tsx}',
    'src/**/*.css',
    'tailwind.config.ts',
  ];
  
  let allFiles = [];
  for (const pattern of patterns) {
    const files = await glob(pattern, {
      ignore: ['node_modules/**', '.next/**', 'src/design-system/tokens/ghxstship/**'],
    });
    allFiles = [...allFiles, ...files];
  }
  
  let filesModified = 0;
  let totalChanges = 0;
  
  for (const file of allFiles) {
    const changes = stripAllColor(file);
    if (changes > 0) {
      filesModified++;
      totalChanges += changes;
      console.log(`✓ ${file}`);
    }
  }
  
  console.log(`\n✅ Color removal complete`);
  console.log(`Files modified: ${filesModified}`);
  console.log(`Pattern replacements: ${totalChanges}\n`);
}

main().catch(console.error);
