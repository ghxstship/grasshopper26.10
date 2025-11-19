#!/usr/bin/env node
/**
 * Comprehensive Design System Audit
 * Validates complete implementation of atomic design system
 * Based on windsurf-atomic-design-system-audit-prompt_6.md
 */

const fs = require('fs');
const path = require('path');

const violations = [];
const checks = [];

console.log('\n🔍 COMPREHENSIVE DESIGN SYSTEM AUDIT\n');
console.log('='.repeat(80) + '\n');

// ============================================
// PHASE 1: TOKEN SYSTEM VALIDATION
// ============================================
console.log('📋 PHASE 1: Token System Validation\n');

// Check 1.1: All design tokens exist
const requiredTokens = {
  colors: 'src/design-system/tokens/primitives/colors.ts',
  typography: 'src/design-system/tokens/primitives/typography.ts',
  spacing: 'src/design-system/tokens/primitives/spacing.ts',
  borders: 'src/design-system/tokens/primitives/borders.ts',
  animations: 'src/design-system/tokens/primitives/animations.ts',
  breakpoints: 'src/design-system/tokens/primitives/breakpoints.ts',
};

Object.entries(requiredTokens).forEach(([name, file]) => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    checks.push(`✅ Token file exists: ${name}`);
  } else {
    violations.push(`❌ Missing token file: ${name} (${file})`);
  }
});

// Check 1.2: CSS variables are generated
const globalsPath = path.join(process.cwd(), 'src/app/globals.css');
if (fs.existsSync(globalsPath)) {
  const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
  
  const requiredCSSVars = [
    '--color-black',
    '--color-white',
    '--grey-100',
    '--surface-primary',
    '--text-primary',
    '--border-default',
    '--font-size-hero',
    '--space-4',
    '--radius-base',
    '--shadow-hard-base',
    '--duration-base',
  ];
  
  requiredCSSVars.forEach(varName => {
    if (globalsContent.includes(varName)) {
      checks.push(`✅ CSS variable defined: ${varName}`);
    } else {
      violations.push(`❌ Missing CSS variable: ${varName}`);
    }
  });
} else {
  violations.push('❌ globals.css not found!');
}

// ============================================
// PHASE 2: COMPONENT ARCHITECTURE VALIDATION
// ============================================
console.log('\n📋 PHASE 2: Component Architecture Validation\n');

// Check 2.1: Atomic components exist
const requiredAtoms = [
  'Button.tsx',
  'Input.tsx',
  'Select.tsx',
  'Textarea.tsx',
  'Card.tsx',
  'Badge.tsx',
  'Avatar.tsx',
  'Spinner.tsx',
  'Typography.tsx',
];

requiredAtoms.forEach(component => {
  const fullPath = path.join(process.cwd(), 'src/components/atoms', component);
  if (fs.existsSync(fullPath)) {
    checks.push(`✅ Atom component exists: ${component}`);
  } else {
    violations.push(`❌ Missing atom component: ${component}`);
  }
});

// Check 2.2: Typography components use design tokens
const typographyPath = path.join(process.cwd(), 'src/components/atoms/Typography.tsx');
if (fs.existsSync(typographyPath)) {
  const content = fs.readFileSync(typographyPath, 'utf-8');
  
  // Should export semantic components
  const requiredExports = [
    'HeroTitle',
    'DisplayTitle',
    'PageTitle',
    'SectionHeader',
    'SubsectionHeader',
    'CardTitle',
    'BodyText',
    'BodyTextLarge',
    'BodyTextSmall',
    'Caption',
    'Metadata',
  ];
  
  requiredExports.forEach(exp => {
    if (content.includes(`export const ${exp}`) || content.includes(`export function ${exp}`)) {
      checks.push(`✅ Typography component exported: ${exp}`);
    } else {
      violations.push(`❌ Missing typography component: ${exp}`);
    }
  });
}

// Check 2.3: Card component has variants
const cardPath = path.join(process.cwd(), 'src/components/atoms/Card.tsx');
if (fs.existsSync(cardPath)) {
  const content = fs.readFileSync(cardPath, 'utf-8');
  
  const requiredVariants = ['default', 'glass'];
  const requiredSubcomponents = ['CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter'];
  
  requiredVariants.forEach(variant => {
    if (content.includes(`"${variant}"`)) {
      checks.push(`✅ Card variant exists: ${variant}`);
    } else {
      violations.push(`❌ Missing Card variant: ${variant}`);
    }
  });
  
  requiredSubcomponents.forEach(sub => {
    if (content.includes(sub)) {
      checks.push(`✅ Card subcomponent exists: ${sub}`);
    } else {
      violations.push(`❌ Missing Card subcomponent: ${sub}`);
    }
  });
}

// Check 2.4: Button component has variants
const buttonPath = path.join(process.cwd(), 'src/components/atoms/Button.tsx');
if (fs.existsSync(buttonPath)) {
  const content = fs.readFileSync(buttonPath, 'utf-8');
  
  const requiredVariants = ['default', 'primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'];
  
  requiredVariants.forEach(variant => {
    // Check for variant as object key (handles minified code)
    const patterns = [
      `"${variant}"`,
      `'${variant}'`,
      `${variant}:`,
      `${variant} :`,
    ];
    
    if (patterns.some(p => content.includes(p))) {
      checks.push(`✅ Button variant exists: ${variant}`);
    } else {
      violations.push(`❌ Missing Button variant: ${variant}`);
    }
  });
}

// ============================================
// PHASE 3: ZERO HARDCODED VALUES
// ============================================
console.log('\n📋 PHASE 3: Zero Hardcoded Values Validation\n');

// Check 3.1: No hardcoded colors in components
function checkForHardcodedValues(dir, filePattern) {
  const files = [];
  
  function walk(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    entries.forEach(entry => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        walk(fullPath);
      } else if (entry.isFile() && filePattern.test(entry.name)) {
        files.push(fullPath);
      }
    });
  }
  
  walk(dir);
  return files;
}

const componentFiles = checkForHardcodedValues(
  path.join(process.cwd(), 'src/components'),
  /\.(tsx|ts)$/
);

let hardcodedColorCount = 0;
let hardcodedSpacingCount = 0;

componentFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  
  lines.forEach((line, idx) => {
    // Skip comments and imports
    if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('import')) {
      return;
    }
    
    // Check for hardcoded hex colors (in style contexts)
    if (/(?:color|background|border|fill|stroke):\s*#[0-9A-Fa-f]{6}/.test(line)) {
      hardcodedColorCount++;
      violations.push(`❌ Hardcoded color at ${path.relative(process.cwd(), file)}:${idx + 1}`);
    }
    
    // Check for hardcoded pixel values in arbitrary classes
    if (/className="[^"]*\[[0-9]+px\]/.test(line)) {
      hardcodedSpacingCount++;
      violations.push(`❌ Hardcoded spacing at ${path.relative(process.cwd(), file)}:${idx + 1}`);
    }
  });
});

if (hardcodedColorCount === 0) {
  checks.push('✅ No hardcoded colors in components');
} else {
  violations.push(`❌ Found ${hardcodedColorCount} hardcoded colors in components`);
}

if (hardcodedSpacingCount === 0) {
  checks.push('✅ No hardcoded spacing in components');
} else {
  violations.push(`❌ Found ${hardcodedSpacingCount} hardcoded spacing values in components`);
}

// ============================================
// PHASE 4: ACCESSIBILITY VALIDATION
// ============================================
console.log('\n📋 PHASE 4: Accessibility Validation\n');

// Check 4.1: Focus management in globals.css
if (fs.existsSync(globalsPath)) {
  const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
  
  if (globalsContent.includes('focus-visible')) {
    checks.push('✅ Focus management styles defined');
  } else {
    violations.push('❌ Missing focus-visible styles');
  }
  
  if (globalsContent.includes('prefers-reduced-motion')) {
    checks.push('✅ Reduced motion support');
  } else {
    violations.push('❌ Missing reduced motion support');
  }
  
  if (globalsContent.includes('prefers-contrast')) {
    checks.push('✅ High contrast mode support');
  } else {
    violations.push('❌ Missing high contrast support');
  }
  
  if (globalsContent.includes('.sr-only')) {
    checks.push('✅ Screen reader only class defined');
  } else {
    violations.push('❌ Missing .sr-only class');
  }
}

// ============================================
// PHASE 5: RESPONSIVE DESIGN VALIDATION
// ============================================
console.log('\n📋 PHASE 5: Responsive Design Validation\n');

// Check 5.1: Responsive typography
if (fs.existsSync(globalsPath)) {
  const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
  
  if (globalsContent.includes('clamp(')) {
    checks.push('✅ Fluid typography with clamp()');
  } else {
    violations.push('❌ Missing fluid typography');
  }
  
  if (globalsContent.includes('@media (max-width: 640px)')) {
    checks.push('✅ Mobile breakpoint defined');
  } else {
    violations.push('❌ Missing mobile breakpoint');
  }
  
  if (globalsContent.includes('@media (min-width: 641px) and (max-width: 1024px)')) {
    checks.push('✅ Tablet breakpoint defined');
  } else {
    violations.push('❌ Missing tablet breakpoint');
  }
}

// ============================================
// RESULTS
// ============================================
console.log('\n' + '='.repeat(80));
console.log('📊 COMPREHENSIVE AUDIT RESULTS');
console.log('='.repeat(80) + '\n');

console.log(`✅ Checks Passed: ${checks.length}`);
console.log(`❌ Violations Found: ${violations.length}\n`);

if (violations.length > 0) {
  console.log('❌ VIOLATIONS:\n');
  violations.slice(0, 20).forEach(v => console.log(v));
  if (violations.length > 20) {
    console.log(`\n... and ${violations.length - 20} more violations\n`);
  }
}

console.log('\n✅ PASSED CHECKS:\n');
checks.slice(0, 30).forEach(c => console.log(c));
if (checks.length > 30) {
  console.log(`\n... and ${checks.length - 30} more passed checks\n`);
}

console.log('\n' + '='.repeat(80));

if (violations.length === 0) {
  console.log('\n🎉 SUCCESS! Design system is fully implemented and enforced!');
  console.log('✨ Zero tolerance for violations achieved.\n');
  process.exit(0);
} else {
  console.log('\n⚠️  AUDIT FAILED! Please fix violations above.\n');
  process.exit(1);
}
