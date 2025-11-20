#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';

const auditResults = JSON.parse(readFileSync('COMPREHENSIVE_AUDIT_RESULTS.json', 'utf-8'));

let totalFixed = 0;
let filesModified = 0;

// Get raw button violations
const violations = auditResults.violations.rawButtons;

console.log(`🔧 Fixing ${violations.length} raw button violations...\n`);

// Group by file
const byFile = {};
violations.forEach(v => {
  if (!byFile[v.file]) byFile[v.file] = [];
  byFile[v.file].push(v);
});

Object.entries(byFile).forEach(([filePath, fileViolations], index) => {
  console.log(`[${index + 1}/${Object.keys(byFile).length}] ${filePath} (${fileViolations.length} violations)`);
  
  let content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let modified = false;

  // Check if Button import exists
  const hasButtonImport = content.includes("from '@/components/atoms/Button'");
  
  if (!hasButtonImport) {
    // Find last import line
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) lastImportIdx = i;
    }
    if (lastImportIdx >= 0) {
      lines.splice(lastImportIdx + 1, 0, `import { Button } from '@/components/atoms/Button';`);
      modified = true;
    }
  }

  // Fix violations line by line
  fileViolations.forEach(v => {
    const lineIdx = v.line - 1;
    if (lineIdx >= 0 && lineIdx < lines.length) {
      let line = lines[lineIdx];
      
      // Replace <button with <Button
      if (line.includes('<button')) {
        line = line.replace(/<button(\s+[^>]*?)>/g, '<Button variant="ghost"$1>');
        line = line.replace(/<\/button>/g, '</Button>');
        
        if (line !== lines[lineIdx]) {
          lines[lineIdx] = line;
          modified = true;
          totalFixed++;
        }
      }
    }
  });

  if (modified) {
    writeFileSync(filePath, lines.join('\n'));
    filesModified++;
    console.log(`  ✅ Fixed and saved`);
  }
});

console.log(`\n✅ Raw button remediation complete!`);
console.log(`   Files modified: ${filesModified}`);
console.log(`   Violations fixed: ${totalFixed}`);
