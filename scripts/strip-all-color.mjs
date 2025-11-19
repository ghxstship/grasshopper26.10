#!/usr/bin/env node
/**
 * GHXSTSHIP Color Stripper
 * Automatically removes ALL color from codebase
 * Replaces with black/white/greyscale equivalents
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

// Color replacement mappings
const COLOR_REPLACEMENTS = {
  // Tailwind color classes → greyscale
  'bg-red-': 'bg-black',
  'bg-blue-': 'bg-black',
  'bg-green-': 'bg-black',
  'bg-yellow-': 'bg-grey-100',
  'bg-orange-': 'bg-black',
  'bg-purple-': 'bg-black',
  'bg-pink-': 'bg-grey-100',
  'bg-cyan-': 'bg-black',
  'bg-teal-': 'bg-black',
  'bg-indigo-': 'bg-black',
  
  'text-red-': 'text-black',
  'text-blue-': 'text-black',
  'text-green-': 'text-black',
  'text-yellow-': 'text-grey-600',
  'text-orange-': 'text-black',
  'text-purple-': 'text-black',
  'text-cyan-': 'text-black',
  'text-teal-': 'text-black',
  'text-indigo-': 'text-black',
  
  'border-red-': 'border-black',
  'border-blue-': 'border-black',
  'border-green-': 'border-black',
  'border-yellow-': 'border-grey-400',
  'border-orange-': 'border-black',
  'border-purple-': 'border-black',
  'border-cyan-': 'border-black',
  'border-teal-': 'border-black',
  'border-indigo-': 'border-black',
  
  // Named colors → greyscale
  'red': 'black',
  'blue': 'black',
  'green': 'black',
  'yellow': 'grey-400',
  'orange': 'black',
  'purple': 'black',
  'cyan': 'black',
  'teal': 'black',
  'indigo': 'black',
  
  // Hex colors → greyscale (common ones)
  '#FF0000': '#000000',
  '#0000FF': '#000000',
  '#00FF00': '#000000',
  '#FFFF00': '#A3A3A3',
  '#FF8800': '#000000',
  '#8800FF': '#000000',
  '#00FFFF': '#000000',
  '#00CED1': '#000000',
  '#4B0082': '#000000',
  '#0066FF': '#000000',
  '#00FF00': '#000000',
  '#FF8800': '#000000',
};

function stripColorFromFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  let changes = 0;
  
  // Replace Tailwind color classes with greyscale
  for (const [colorPattern, replacement] of Object.entries(COLOR_REPLACEMENTS)) {
    const regex = new RegExp(colorPattern + '\\d+', 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, replacement);
      changes += matches.length;
    }
  }
  
  // Replace hex colors
  for (const [hex, greyHex] of Object.entries(COLOR_REPLACEMENTS)) {
    if (hex.startsWith('#')) {
      const count = (content.match(new RegExp(hex, 'gi')) || []).length;
      if (count > 0) {
        content = content.replace(new RegExp(hex, 'gi'), greyHex);
        changes += count;
      }
    }
  }
  
  // Replace CSS color keywords in specific contexts
  content = content.replace(/color:\s*(red|blue|green|yellow|orange|purple|cyan|teal|indigo)/gi, 'color: black');
  content = content.replace(/background:\s*(red|blue|green|yellow|orange|purple|cyan|teal|indigo)/gi, 'background: black');
  content = content.replace(/border-color:\s*(red|blue|green|yellow|orange|purple|cyan|teal|indigo)/gi, 'border-color: black');
  
  if (changes > 0) {
    writeFileSync(filePath, content, 'utf-8');
  }
  
  return changes;
}

async function main() {
  console.log('🎨 GHXSTSHIP Color Stripper');
  console.log('Removing ALL color from codebase...\n');
  
  const files = await glob('src/**/*.{ts,tsx,css}', {
    ignore: ['node_modules/**', '.next/**', '**/tokens/**'],
  });
  
  let totalChanges = 0;
  let filesModified = 0;
  
  for (const file of files) {
    const changes = stripColorFromFile(file);
    if (changes > 0) {
      filesModified++;
      totalChanges += changes;
      console.log(`✓ ${file} (${changes} changes)`);
    }
  }
  
  console.log(`\n✅ Complete!`);
  console.log(`Files modified: ${filesModified}`);
  console.log(`Total changes: ${totalChanges}\n`);
}

main().catch(console.error);
