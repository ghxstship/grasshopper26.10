#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';

const auditResults = JSON.parse(readFileSync('COMPREHENSIVE_AUDIT_RESULTS.json', 'utf-8'));

let totalFixed = 0;
let filesModified = 0;

// Get files with text class violations
const filesWithTextViolations = auditResults.fileInventory.filter(f => 
  f.violations.some(v => v.type === 'RAW_TEXT_SIZE_CLASS')
);

console.log(`🔧 Fixing ${filesWithTextViolations.length} files with text class violations...\n`);

filesWithTextViolations.forEach((fileAudit, index) => {
  const filePath = fileAudit.path;
  console.log(`[${index + 1}/${filesWithTextViolations.length}] Processing ${filePath}...`);
  
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;
  let fixCount = 0;

  // Check if file already has Typography imports
  const hasTypographyImport = /import\s+{[^}]*}\s+from\s+['"]@\/components\/atoms\/Typography['"]/.test(content);
  
  // Collect needed Typography components
  const neededComponents = new Set();
  
  // Fix text-caption violations
  const captionMatches = content.matchAll(/<(div|p|span|th|td|li|label)([^>]*className=["'][^"']*text-caption[^"']*["'][^>]*)>/g);
  for (const match of Array.from(captionMatches)) {
    neededComponents.add('Caption');
  }

  // Fix text-body violations (not text-body-sm, text-body-lg, etc)
  const bodyMatches = content.matchAll(/<(div|p|span|th|td|li)([^>]*className=["'][^"']*\btext-body\b[^"']*["'][^>]*)>/g);
  for (const match of Array.from(bodyMatches)) {
    neededComponents.add('BodyText');
  }

  // Fix text-label violations
  const labelMatches = content.matchAll(/<(div|p|span|label)([^>]*className=["'][^"']*\btext-label\b[^"']*["'][^>]*)>/g);
  for (const match of Array.from(labelMatches)) {
    neededComponents.add('Label');
  }

  if (neededComponents.size > 0) {
    // Add Typography import if needed
    if (!hasTypographyImport) {
      const importStatement = `import { ${Array.from(neededComponents).join(', ')} } from '@/components/atoms/Typography';\n`;
      
      // Find the last import statement
      const importLines = content.split('\n');
      let lastImportIndex = -1;
      for (let i = 0; i < importLines.length; i++) {
        if (importLines[i].trim().startsWith('import ')) {
          lastImportIndex = i;
        }
      }
      
      if (lastImportIndex >= 0) {
        importLines.splice(lastImportIndex + 1, 0, importStatement.trim());
        content = importLines.join('\n');
        modified = true;
      }
    } else {
      // Add to existing import
      content = content.replace(
        /import\s+{([^}]*)}\s+from\s+['"]@\/components\/atoms\/Typography['"]/,
        (match, imports) => {
          const existingImports = imports.split(',').map(s => s.trim()).filter(Boolean);
          const allImports = new Set([...existingImports, ...Array.from(neededComponents)]);
          return `import { ${Array.from(allImports).join(', ')} } from '@/components/atoms/Typography'`;
        }
      );
      modified = true;
    }

    // Replace text-caption with Caption component
    content = content.replace(
      /<(div|p|span|th|td|li|label)(\s+[^>]*)?className=(["'])([^"']*)\btext-caption\b([^"']*)(\3)([^>]*)>/g,
      (match, tag, attrs1 = '', quote, classStart, classEnd, quote2, attrs2) => {
        fixCount++;
        const otherClasses = (classStart + classEnd).trim();
        const className = otherClasses ? ` className=${quote}${otherClasses}${quote}` : '';
        return `<Caption${attrs1 || ''}${className}${attrs2}>`;
      }
    );

    // Replace closing tags
    content = content.replace(/<\/(div|p|span|th|td|li|label)>/g, (match, tag, offset) => {
      // Check if this closing tag corresponds to a Caption opening tag
      const before = content.substring(0, offset);
      const openCaptionCount = (before.match(/<Caption[\s>]/g) || []).length;
      const closeCaptionCount = (before.match(/<\/Caption>/g) || []).length;
      
      if (openCaptionCount > closeCaptionCount) {
        // Check if the last unclosed tag was a Caption
        const lastOpen = before.lastIndexOf('<Caption');
        const lastClose = before.lastIndexOf(`</${tag}>`);
        if (lastOpen > lastClose) {
          return '</Caption>';
        }
      }
      return match;
    });

    // Replace text-body with BodyText component
    content = content.replace(
      /<(div|p|span|th|td|li)(\s+[^>]*)?className=(["'])([^"']*)\btext-body\b([^"']*)(\3)([^>]*)>/g,
      (match, tag, attrs1 = '', quote, classStart, classEnd, quote2, attrs2) => {
        // Skip if it's text-body-sm, text-body-lg, etc.
        if (classEnd.startsWith('-')) return match;
        fixCount++;
        const otherClasses = (classStart + classEnd).trim();
        const className = otherClasses ? ` className=${quote}${otherClasses}${quote}` : '';
        return `<BodyText${attrs1 || ''}${className}${attrs2}>`;
      }
    );

    // Replace text-label with Label component
    content = content.replace(
      /<(div|p|span|label)(\s+[^>]*)?className=(["'])([^"']*)\btext-label\b([^"']*)(\3)([^>]*)>/g,
      (match, tag, attrs1 = '', quote, classStart, classEnd, quote2, attrs2) => {
        // Skip if it's text-label-sm, text-label-lg, etc.
        if (classEnd.startsWith('-')) return match;
        fixCount++;
        const otherClasses = (classStart + classEnd).trim();
        const className = otherClasses ? ` className=${quote}${otherClasses}${quote}` : '';
        return `<Label${attrs1 || ''}${className}${attrs2}>`;
      }
    );

    if (modified || fixCount > 0) {
      writeFileSync(filePath, content);
      filesModified++;
      totalFixed += fixCount;
      console.log(`  ✅ Fixed ${fixCount} violations`);
    }
  }
});

console.log(`\n✅ Remediation complete!`);
console.log(`   Files modified: ${filesModified}`);
console.log(`   Total fixes: ${totalFixed}`);
console.log(`\n🔄 Re-running audit to verify...`);
