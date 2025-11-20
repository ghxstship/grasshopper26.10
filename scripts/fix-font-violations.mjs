#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

console.log('🔧 Fixing font-bebas violations...\n');

// Find all TSX files in src/app
const files = glob.sync('src/app/**/*.tsx', { 
  ignore: ['**/node_modules/**', '**/.next/**'] 
});

let totalFixed = 0;
let filesModified = 0;

files.forEach(file => {
  let content = readFileSync(file, 'utf8');
  const originalContent = content;
  let fileFixed = 0;

  // Pattern 1: BodyText with font-bebas -> SubsectionHeader
  const pattern1 = /(<BodyText\s+className="[^"]*?)font-bebas([^"]*?"[^>]*>)/g;
  content = content.replace(pattern1, (match, before, after) => {
    // Replace BodyText with SubsectionHeader and remove font-bebas
    const newMatch = before.replace('<BodyText', '<SubsectionHeader') + after;
    fileFixed++;
    return newMatch;
  });

  // Pattern 2: font-share-tech-mono removal
  content = content.replace(/\s*font-share-tech-mono\s*/g, ' ');

  // Pattern 3: font-anton removal
  content = content.replace(/\s*font-anton\s*/g, ' ');

  // Pattern 4: font-oswald removal
  content = content.replace(/\s*font-oswald\s*/g, ' ');

  // Clean up double spaces in className
  content = content.replace(/className="([^"]*)\s{2,}([^"]*)"/g, 'className="$1 $2"');
  content = content.replace(/className="\s+/g, 'className="');
  content = content.replace(/\s+"/g, '"');

  if (content !== originalContent) {
    writeFileSync(file, content, 'utf8');
    filesModified++;
    totalFixed += fileFixed;
    console.log(`✅ ${file} - Fixed ${fileFixed} violations`);
  }
});

console.log(`\n✨ Complete! Fixed ${totalFixed} violations across ${filesModified} files`);
