#!/usr/bin/env node
/**
 * Validate Single Source of Truth Implementation
 * Ensures no legacy code, backwards compatibility, or redundancies exist
 */

const fs = require('fs');
const path = require('path');

let violations = [];
let passed = [];

console.log('\n🔍 VALIDATING SINGLE SOURCE OF TRUTH IMPLEMENTATION\n');
console.log('='.repeat(80) + '\n');

// Test 1: Check that legacy token files are deleted
console.log('📋 Test 1: Legacy Token Files Removed');
const legacyFiles = [
  'src/design-system/tokens/primitives/colors.ts',
  'src/design-system/tokens/primitives/typography.ts',
  'src/design-system/tokens/semantic/colors.ts',
  'src/design-system/tokens/semantic/index.ts',
  'src/app/globals.css.backup',
];

legacyFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    violations.push(`❌ Legacy file still exists: ${file}`);
  } else {
    passed.push(`✅ Legacy file removed: ${file}`);
  }
});

// Test 2: Check that globals.css has no backwards compatibility tokens
console.log('\n📋 Test 2: No Backwards Compatibility in globals.css');
const globalsPath = path.join(process.cwd(), 'src/app/globals.css');
if (fs.existsSync(globalsPath)) {
  const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
  
  const backwardsCompatPatterns = [
    { pattern: /\/\*.*Legacy.*\*\//i, name: 'Legacy comment blocks' },
    { pattern: /\/\*.*backwards compatibility.*\*\//i, name: 'Backwards compatibility comments' },
    { pattern: /--background:.*var\(--surface-primary\)/i, name: 'Legacy --background token' },
    { pattern: /--foreground:.*var\(--text-primary\)/i, name: 'Legacy --foreground token' },
    { pattern: /--surface:.*var\(--surface-secondary\)/i, name: 'Legacy --surface token' },
  ];
  
  backwardsCompatPatterns.forEach(({ pattern, name }) => {
    if (pattern.test(globalsContent)) {
      violations.push(`❌ Backwards compatibility found in globals.css: ${name}`);
    } else {
      passed.push(`✅ No backwards compatibility: ${name}`);
    }
  });
} else {
  violations.push('❌ globals.css not found!');
}

// Test 3: Check that only GHXSTSHIP tokens are exported
console.log('\n📋 Test 3: Only GHXSTSHIP Tokens Exported');
const indexPath = path.join(process.cwd(), 'src/design-system/tokens/index.ts');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  
  const requiredExports = [
    'ghxstship-colors',
    'ghxstship-typography',
    'spacing',
    'borders',
    'animations',
    'breakpoints',
  ];
  
  const forbiddenExports = [
    "from './primitives/colors'",
    "from './primitives/typography'",
    "from './semantic/colors'",
    'primitiveColors',
    'import { semanticColors }', // Only forbid if imported from legacy
  ];
  
  requiredExports.forEach(exp => {
    if (indexContent.includes(exp)) {
      passed.push(`✅ Exports GHXSTSHIP token: ${exp}`);
    } else {
      violations.push(`❌ Missing GHXSTSHIP token export: ${exp}`);
    }
  });
  
  forbiddenExports.forEach(exp => {
    if (indexContent.includes(exp)) {
      violations.push(`❌ Legacy export found in index.ts: ${exp}`);
    } else {
      passed.push(`✅ No legacy export: ${exp}`);
    }
  });
} else {
  violations.push('❌ tokens/index.ts not found!');
}

// Test 4: Verify GHXSTSHIP token files exist
console.log('\n📋 Test 4: GHXSTSHIP Token Files Exist');
const requiredFiles = [
  'src/design-system/tokens/primitives/ghxstship-colors.ts',
  'src/design-system/tokens/primitives/ghxstship-typography.ts',
  'src/design-system/tokens/primitives/spacing.ts',
  'src/design-system/tokens/primitives/borders.ts',
  'src/design-system/tokens/primitives/animations.ts',
  'src/design-system/tokens/primitives/breakpoints.ts',
];

requiredFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    passed.push(`✅ Required file exists: ${file}`);
  } else {
    violations.push(`❌ Required file missing: ${file}`);
  }
});

// Test 5: Check that globals.css is auto-generated
console.log('\n📋 Test 5: globals.css is Auto-Generated');
if (fs.existsSync(globalsPath)) {
  const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
  
  if (globalsContent.includes('AUTO-GENERATED')) {
    passed.push('✅ globals.css is marked as auto-generated');
  } else {
    violations.push('❌ globals.css missing AUTO-GENERATED marker');
  }
  
  if (globalsContent.includes('DO NOT EDIT MANUALLY')) {
    passed.push('✅ globals.css has DO NOT EDIT warning');
  } else {
    violations.push('❌ globals.css missing DO NOT EDIT warning');
  }
}

// Test 6: Check for hardcoded values in components (sample check)
console.log('\n📋 Test 6: No Hardcoded Design Values in Key Components');
const componentFiles = [
  'src/components/atoms/Button.tsx',
  'src/components/atoms/Card.tsx',
  'src/components/atoms/Typography.tsx',
];

componentFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    // Check for hardcoded hex colors (excluding comments)
    const lines = content.split('\n').filter(line => !line.trim().startsWith('//'));
    const hasHardcodedColors = lines.some(line => /#[0-9A-Fa-f]{6}/.test(line));
    
    if (hasHardcodedColors) {
      violations.push(`❌ Hardcoded colors found in: ${file}`);
    } else {
      passed.push(`✅ No hardcoded colors in: ${file}`);
    }
  }
});

// Print Results
console.log('\n' + '='.repeat(80));
console.log('📊 VALIDATION RESULTS');
console.log('='.repeat(80) + '\n');

console.log(`✅ Passed: ${passed.length}`);
console.log(`❌ Violations: ${violations.length}\n`);

if (violations.length > 0) {
  console.log('❌ VIOLATIONS FOUND:\n');
  violations.forEach(v => console.log(v));
  console.log('');
}

if (passed.length > 0) {
  console.log('✅ PASSED CHECKS:\n');
  passed.forEach(p => console.log(p));
  console.log('');
}

console.log('='.repeat(80));

if (violations.length === 0) {
  console.log('\n🎉 SUCCESS! Single Source of Truth is fully implemented!');
  console.log('✨ No legacy code or backwards compatibility found.\n');
  process.exit(0);
} else {
  console.log('\n⚠️  VALIDATION FAILED! Please fix violations above.\n');
  process.exit(1);
}
