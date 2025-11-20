#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';

const auditResults = JSON.parse(readFileSync('COMPREHENSIVE_AUDIT_RESULTS.json', 'utf-8'));

let totalFixed = 0;
let filesModified = 0;

// Process each violation
const violations = auditResults.violations.rawTextSizeClasses;

console.log(`🔧 Fixing ${violations.length} text class violations...\n`);

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

  // Check if Typography import exists
  const hasTypographyImport = content.includes("from '@/components/atoms/Typography'");
  const neededComponents = new Set();

  // Analyze what components we need (skip Badge components - they're atomic)
  fileViolations.forEach(v => {
    if (v.content.includes('text-caption') && !v.content.includes('<Badge')) neededComponents.add('Caption');
    if (v.content.match(/\btext-body\b/) && !v.content.includes('text-body-') && !v.content.includes('<Badge')) neededComponents.add('BodyText');
    if (v.content.match(/\btext-label\b/) && !v.content.includes('text-label-') && !v.content.includes('<Badge')) neededComponents.add('Label');
  });

  // Add or update Typography import
  if (neededComponents.size > 0) {
    if (!hasTypographyImport) {
      // Find last import line
      let lastImportIdx = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import ')) lastImportIdx = i;
      }
      if (lastImportIdx >= 0) {
        lines.splice(lastImportIdx + 1, 0, `import { ${Array.from(neededComponents).join(', ')} } from '@/components/atoms/Typography';`);
        modified = true;
      }
    } else {
      // Update existing import
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("from '@/components/atoms/Typography'")) {
          const match = lines[i].match(/import\s+{([^}]*)}/);
          if (match) {
            const existing = match[1].split(',').map(s => s.trim()).filter(Boolean);
            const all = new Set([...existing, ...Array.from(neededComponents)]);
            lines[i] = `import { ${Array.from(all).join(', ')} } from '@/components/atoms/Typography';`;
            modified = true;
          }
          break;
        }
      }
    }
  }

  // Fix violations line by line
  fileViolations.forEach(v => {
    const lineIdx = v.line - 1;
    if (lineIdx >= 0 && lineIdx < lines.length) {
      let line = lines[lineIdx];
      
      // Skip if it's a Badge component (atomic component - text-caption is acceptable)
      if (line.includes('<Badge')) {
        return;
      }
      
      // Fix text-caption on div/p/span/th/td
      if (line.includes('text-caption')) {
        // Replace <div className="...text-caption..."> with <Caption className="...other classes...">
        line = line.replace(
          /<(div|p|span|th|td|li)\s+([^>]*?)className=(["'])([^"']*?)text-caption([^"']*?)\3([^>]*?)>/g,
          (match, tag, before, quote, classStart, classEnd, after) => {
            const otherClasses = (classStart + classEnd).replace(/\s+/g, ' ').trim();
            const classAttr = otherClasses ? ` className=${quote}${otherClasses}${quote}` : '';
            return `<Caption${before ? ' ' + before.trim() : ''}${classAttr}${after ? ' ' + after.trim() : ''}>`;
          }
        );
        
        // Also need to fix closing tag - find matching closing tag
        // For simplicity, replace the tag name in closing tags on same line
        if (line.includes('</div>') || line.includes('</p>') || line.includes('</span>') || 
            line.includes('</th>') || line.includes('</td>') || line.includes('</li>')) {
          // Count opens and closes to match them
          const opens = (line.match(/<Caption[\s>]/g) || []).length;
          const closes = (line.match(/<\/Caption>/g) || []).length;
          if (opens > closes) {
            // Replace one closing tag
            line = line.replace(/<\/(div|p|span|th|td|li)>/, '</Caption>');
          }
        }
      }

      // Fix text-body (but not text-body-sm, text-body-lg, etc.)
      if (line.match(/\btext-body\b/) && !line.includes('text-body-')) {
        line = line.replace(
          /<(div|p|span|th|td)\s+([^>]*?)className=(["'])([^"']*?)\btext-body\b([^"']*?)\3([^>]*?)>/g,
          (match, tag, before, quote, classStart, classEnd, after) => {
            const otherClasses = (classStart + classEnd).replace(/\s+/g, ' ').trim();
            const classAttr = otherClasses ? ` className=${quote}${otherClasses}${quote}` : '';
            return `<BodyText${before ? ' ' + before.trim() : ''}${classAttr}${after ? ' ' + after.trim() : ''}>`;
          }
        );
        
        if (line.includes('</div>') || line.includes('</p>') || line.includes('</span>') || 
            line.includes('</th>') || line.includes('</td>')) {
          const opens = (line.match(/<BodyText[\s>]/g) || []).length;
          const closes = (line.match(/<\/BodyText>/g) || []).length;
          if (opens > closes) {
            line = line.replace(/<\/(div|p|span|th|td)>/, '</BodyText>');
          }
        }
      }

      // Fix text-label (but not text-label-sm, etc.)
      if (line.match(/\btext-label\b/) && !line.includes('text-label-')) {
        line = line.replace(
          /<(div|p|span|label)\s+([^>]*?)className=(["'])([^"']*?)\btext-label\b([^"']*?)\3([^>]*?)>/g,
          (match, tag, before, quote, classStart, classEnd, after) => {
            const otherClasses = (classStart + classEnd).replace(/\s+/g, ' ').trim();
            const classAttr = otherClasses ? ` className=${quote}${otherClasses}${quote}` : '';
            return `<Label${before ? ' ' + before.trim() : ''}${classAttr}${after ? ' ' + after.trim() : ''}>`;
          }
        );
        
        if (line.includes('</div>') || line.includes('</p>') || line.includes('</span>') || line.includes('</label>')) {
          const opens = (line.match(/<Label[\s>]/g) || []).length;
          const closes = (line.match(/<\/Label>/g) || []).length;
          if (opens > closes) {
            line = line.replace(/<\/(div|p|span|label)>/, '</Label>');
          }
        }
      }

      if (line !== lines[lineIdx]) {
        lines[lineIdx] = line;
        modified = true;
        totalFixed++;
      }
    }
  });

  if (modified) {
    writeFileSync(filePath, lines.join('\n'));
    filesModified++;
    console.log(`  ✅ Fixed and saved`);
  }
});

console.log(`\n✅ Text violation remediation complete!`);
console.log(`   Files modified: ${filesModified}`);
console.log(`   Violations fixed: ${totalFixed}`);
