#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';

const auditResults = JSON.parse(readFileSync('COMPREHENSIVE_AUDIT_RESULTS.json', 'utf-8'));

let totalFixed = 0;
let filesModified = 0;

// Get files with missing variant violations
const violations = auditResults.violations.missingVariant;

console.log(`🔧 Fixing ${violations.length} missing variant violations...\n`);

violations.forEach((v, index) => {
  console.log(`[${index + 1}/${violations.length}] ${v.file} (platform: ${v.platform})`);
  
  let content = readFileSync(v.file, 'utf-8');
  let modified = false;
  let fixCount = 0;

  // Add variant to Card/Button components without any variant (multi-line aware)
  const componentPattern = /<(Card|Button)([\s\n][^>]*?)>/gs;
  content = content.replace(componentPattern, (match, componentName, attrs) => {
    // Only add variant if there's no variant attribute at all in the full tag
    if (!match.includes('variant=')) {
      fixCount++;
      modified = true;
      // Insert variant right after the component name
      return `<${componentName} variant="${v.platform}"${attrs}>`;
    }
    return match;
  });

  if (modified) {
    writeFileSync(v.file, content);
    filesModified++;
    totalFixed += fixCount;
    console.log(`  ✅ Fixed ${fixCount} components`);
  }
});

console.log(`\n✅ Variant violation remediation complete!`);
console.log(`   Files modified: ${filesModified}`);
console.log(`   Components fixed: ${totalFixed}`);
