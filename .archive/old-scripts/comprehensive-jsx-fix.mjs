#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const files = glob.sync('src/app/**/*.tsx');
let totalFixes = 0;

files.forEach(file => {
  try {
    let content = readFileSync(file, 'utf8');
    let modified = false;
    let fixCount = 0;
    
    // Fix 1: Caption imports if Caption is used but not imported
    if (content.includes('<Caption') && !content.match(/import.*Caption.*from/)) {
      const typoMatch = content.match(/^(import.*Typography.*)$/m);
      if (typoMatch) {
        const line = typoMatch[1];
        if (!line.includes('Caption')) {
          const newLine = line.replace(/(['"]@\/components\/atoms\/Typography['"])/, (match) => {
            const hasClosing = line.includes('}');
            if (hasClosing) {
              return line.replace('}', ', Caption }');
            }
            return match;
          });
          content = content.replace(line, newLine);
          modified = true;
          fixCount++;
        }
      }
    }
    
    // Fix 2: Remove unused imports
    const lines = content.split('\n');
    const importedNames = new Set();
    const usedNames = new Set();
    
    lines.forEach((line, _idx) => {
      const importMatch = line.match(/import\s+\{([^}]+)\}\s+from/);
      if (importMatch) {
        const names = importMatch[1].split(',').map(n => n.trim());
        names.forEach(name => importedNames.add(name));
      }
    });
    
    importedNames.forEach(name => {
      const regex = new RegExp(`[^a-zA-Z]${name}[^a-zA-Z]`, 'g');
      const matches = content.match(regex);
      if (matches && matches.length > 1) {
        usedNames.add(name);
      }
    });
    
    // Rebuild imports removing unused ones
    const newLines = lines.map(line => {
      const importMatch = line.match(/import\s+\{([^}]+)\}\s+from\s+(['"][^'"]+['"])/);
      if (importMatch) {
        const names = importMatch[1].split(',').map(n => n.trim()).filter(n => usedNames.has(n));
        if (names.length === 0) {
          modified = true;
          fixCount++;
          return '';
        }
        if (names.length < importMatch[1].split(',').length) {
          modified = true;
          fixCount++;
          return `import { ${names.join(', ')} } from ${importMatch[2]}`;
        }
      }
      return line;
    });
    
    if (modified) {
      content = newLines.join('\n');
      writeFileSync(file, content);
      totalFixes++;
      console.log(`Fixed ${fixCount} issues in: ${file}`);
    }
  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
});

console.log(`\nTotal files fixed: ${totalFixes}`);
