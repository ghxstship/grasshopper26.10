#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const files = glob.sync('src/app/**/*.tsx');
let totalFixes = 0;
let totalErrors = 0;

console.log('Starting comprehensive JSX fix...\n');

files.forEach(file => {
  try {
    let content = readFileSync(file, 'utf8');
    let modified = false;
    let fileErrors = 0;
    
    // Fix 1: Ensure Caption is imported if used
    if (content.includes('<Caption') && !content.match(/import.*Caption.*from.*Typography/)) {
      const importMatch = content.match(/(import\s*{[^}]*}\s*from\s*['"]@\/components\/atoms\/Typography['"])/);
      if (importMatch) {
        const oldImport = importMatch[1];
        if (!oldImport.includes('Caption')) {
          const newImport = oldImport.replace('}', ', Caption }');
          content = content.replace(oldImport, newImport);
          modified = true;
          fileErrors++;
        }
      } else {
        // Add Caption import at the top after other imports
        const lines = content.split('\n');
        let insertIdx = 0;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('import')) {
            insertIdx = i + 1;
          }
        }
        lines.splice(insertIdx, 0, "import { Caption } from '@/components/atoms/Typography';");
        content = lines.join('\n');
        modified = true;
        fileErrors++;
      }
    }
    
    // Fix 2: Remove unused metadata variable
    if (content.match(/const metadata = {[\s\S]*?};/) && !content.includes('export { metadata }') && !content.includes('export const metadata')) {
      content = content.replace(/const metadata = {[\s\S]*?};/, '');
      modified = true;
      fileErrors++;
    }
    
    // Fix 3: Remove duplicate empty lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    
    // Fix 4: Clean up any remaining unclosed tags patterns
    // Pattern: <Caption ... multiple lines ... </div>
    const captionPattern = /<Caption\s+([^>]*)>([\s\S]*?)<\/div>/g;
    if (captionPattern.test(content)) {
      content = content.replace(captionPattern, (match, attrs, innerContent) => {
        // Only replace if the div is directly closing Caption
        if (!innerContent.includes('<div')) {
          modified = true;
          fileErrors++;
          return `<Caption ${attrs}>${innerContent}</Caption>`;
        }
        return match;
      });
    }
    
    if (modified) {
      writeFileSync(file, content);
      totalFixes++;
      totalErrors += fileErrors;
      console.log(`✓ Fixed ${fileErrors} issues in: ${file}`);
    }
  } catch (err) {
    console.error(`✗ Error processing ${file}:`, err.message);
  }
});

console.log(`\n${'='.repeat(60)}`);
console.log(`Total files fixed: ${totalFixes}`);
console.log(`Total issues resolved: ${totalErrors}`);
console.log(`${'='.repeat(60)}\n`);
