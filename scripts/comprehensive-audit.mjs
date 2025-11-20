#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const AUDIT_RESULTS = {
  totalFiles: 0,
  filesWithViolations: 0,
  fileInventory: [],
  violations: {
    rawFontClasses: [],
    rawTextSizeClasses: [],
    rawButtons: [],
    missingTypography: [],
    missingCard: [],
    missingButton: [],
    missingLayout: [],
    missingVariant: []
  },
  compliance: {
    typography: { files: 0, total: 0 },
    card: { files: 0, total: 0 },
    button: { files: 0, total: 0 },
    layout: { files: 0, total: 0 },
    variant: { files: 0, total: 0 }
  }
};

// Recursively find all page.tsx and layout.tsx files
function findFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        findFiles(filePath, fileList);
      }
    } else if (file === 'page.tsx' || file === 'layout.tsx') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Audit a single file
function auditFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const relativePath = relative(process.cwd(), filePath);
  
  const fileAudit = {
    path: relativePath,
    violations: [],
    components: {
      typography: false,
      card: false,
      button: false,
      layout: false,
      variant: false
    },
    imports: {
      typography: [],
      card: [],
      button: [],
      layout: []
    },
    usage: {
      typography: [],
      card: [],
      button: [],
      variant: []
    }
  };

  // Check imports
  const typographyImportMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]@\/components\/atoms\/Typography['"]/);
  if (typographyImportMatch) {
    fileAudit.components.typography = true;
    fileAudit.imports.typography = typographyImportMatch[1].split(',').map(s => s.trim());
  }

  const cardImportMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]@\/components\/atoms\/Card['"]/);
  if (cardImportMatch) {
    fileAudit.components.card = true;
    fileAudit.imports.card = cardImportMatch[1].split(',').map(s => s.trim());
  }

  const buttonImportMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]@\/components\/atoms\/Button['"]/);
  if (buttonImportMatch) {
    fileAudit.components.button = true;
    fileAudit.imports.button = buttonImportMatch[1].split(',').map(s => s.trim());
  }

  const layoutImportMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]@\/components\/templates\/(\w+Layout)['"]/);
  if (layoutImportMatch) {
    fileAudit.components.layout = true;
    fileAudit.imports.layout = [layoutImportMatch[2]];
  }

  // Check for violations line by line
  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Raw font classes (font-bebas, font-anton, font-oswald)
    if (/className=["'][^"']*font-(bebas|anton|oswald)/.test(line)) {
      fileAudit.violations.push({
        type: 'RAW_FONT_CLASS',
        line: lineNum,
        content: line.trim(),
        severity: 'CRITICAL'
      });
      AUDIT_RESULTS.violations.rawFontClasses.push({ file: relativePath, line: lineNum, content: line.trim() });
    }

    // Raw text size classes on non-Typography elements (e.g., <div className="text-h1">)
    // But NOT on Typography components (e.g., <BodyText className="text-body-sm">)
    // Also NOT on Badge components (atomic component - text-caption is acceptable)
    const textClassMatch = line.match(/<(\w+)[^>]*className=["'][^"']*\b(text-h[1-6]|text-body(?!-)|text-caption(?!-)|text-label(?!-))\b/);
    if (textClassMatch) {
      const element = textClassMatch[1];
      const textClass = textClassMatch[2];
      // Only flag if it's NOT a Typography component or Badge
      const typographyComponents = ['PageTitle', 'HeroTitle', 'SectionHeader', 'SubsectionHeader', 'CardTitle', 'BodyText', 'BodyTextSmall', 'Metadata', 'Caption', 'Label'];
      const atomicComponents = ['Badge', 'Button', 'Card', 'Input', 'Select'];
      if (!typographyComponents.includes(element) && !atomicComponents.includes(element)) {
        fileAudit.violations.push({
          type: 'RAW_TEXT_SIZE_CLASS',
          line: lineNum,
          content: line.trim(),
          severity: 'CRITICAL',
          detail: `${textClass} on <${element}>`
        });
        AUDIT_RESULTS.violations.rawTextSizeClasses.push({ file: relativePath, line: lineNum, content: line.trim() });
      }
    }

    // Raw <button> tags
    if (/<button[\s>]/.test(line) && !line.includes('Button')) {
      fileAudit.violations.push({
        type: 'RAW_BUTTON',
        line: lineNum,
        content: line.trim(),
        severity: 'HIGH'
      });
      AUDIT_RESULTS.violations.rawButtons.push({ file: relativePath, line: lineNum, content: line.trim() });
    }

    // Count Typography component usage
    const typographyUsage = line.match(/<(PageTitle|HeroTitle|SectionHeader|SubsectionHeader|CardTitle|BodyText|BodyTextSmall|Metadata|Caption|Label)[\s>]/g);
    if (typographyUsage) {
      fileAudit.usage.typography.push(...typographyUsage.map(u => u.replace(/[<>\s]/g, '')));
    }

    // Count Card component usage
    const cardUsage = line.match(/<(Card|CardHeader|CardTitle|CardDescription|CardContent|CardFooter)[\s>]/g);
    if (cardUsage) {
      fileAudit.usage.card.push(...cardUsage.map(u => u.replace(/[<>\s]/g, '')));
    }

    // Count Button component usage
    if (/<Button[\s>]/.test(line)) {
      fileAudit.usage.button.push('Button');
    }

    // Count variant usage
    const variantMatch = line.match(/variant=["'](atlvs|compvss|gvteway)["']/g);
    if (variantMatch) {
      fileAudit.usage.variant.push(...variantMatch.map(v => v.match(/variant=["'](\w+)["']/)[1]));
      fileAudit.components.variant = true;
    }
  });

  // Determine if file needs platform-specific variants
  const platform = relativePath.match(/src\/app\/(atlvs|compvss|gvteway)\//)?.[1];
  
  if (platform) {
    // Check if file has Card/Button without ANY variant attribute (multi-line aware)
    let hasComponentsWithoutVariant = false;
    
    // Check in the full content for components without variants
    const componentMatches = content.matchAll(/<(Card|Button)[\s\n][^>]*?>/gs);
    for (const match of componentMatches) {
      const fullTag = match[0];
      if (!fullTag.includes('variant=')) {
        hasComponentsWithoutVariant = true;
        break;
      }
    }
    
    if (hasComponentsWithoutVariant) {
      fileAudit.violations.push({
        type: 'MISSING_VARIANT',
        severity: 'MEDIUM',
        detail: `${platform.toUpperCase()} file has Card/Button without variant prop`
      });
      AUDIT_RESULTS.violations.missingVariant.push({ file: relativePath, platform });
    }
  }

  // Update compliance metrics
  if (fileAudit.components.typography) AUDIT_RESULTS.compliance.typography.files++;
  if (fileAudit.components.card) AUDIT_RESULTS.compliance.card.files++;
  if (fileAudit.components.button) AUDIT_RESULTS.compliance.button.files++;
  if (fileAudit.components.layout) AUDIT_RESULTS.compliance.layout.files++;
  if (fileAudit.components.variant) AUDIT_RESULTS.compliance.variant.files++;
  
  AUDIT_RESULTS.compliance.typography.total++;
  AUDIT_RESULTS.compliance.card.total++;
  AUDIT_RESULTS.compliance.button.total++;
  AUDIT_RESULTS.compliance.layout.total++;
  AUDIT_RESULTS.compliance.variant.total++;

  if (fileAudit.violations.length > 0) {
    AUDIT_RESULTS.filesWithViolations++;
  }

  AUDIT_RESULTS.fileInventory.push(fileAudit);
  AUDIT_RESULTS.totalFiles++;
}

// Main execution
console.log('🔍 Starting comprehensive design system audit...\n');

const files = findFiles('src/app');
console.log(`Found ${files.length} files to audit\n`);

files.forEach((file, index) => {
  if (index % 50 === 0) {
    console.log(`Progress: ${index}/${files.length} files audited...`);
  }
  auditFile(file);
});

console.log(`\n✅ Audit complete! Audited ${AUDIT_RESULTS.totalFiles} files\n`);

// Generate summary
const summary = {
  timestamp: new Date().toISOString(),
  totalFiles: AUDIT_RESULTS.totalFiles,
  filesWithViolations: AUDIT_RESULTS.filesWithViolations,
  complianceRate: ((AUDIT_RESULTS.totalFiles - AUDIT_RESULTS.filesWithViolations) / AUDIT_RESULTS.totalFiles * 100).toFixed(1),
  violations: {
    rawFontClasses: AUDIT_RESULTS.violations.rawFontClasses.length,
    rawTextSizeClasses: AUDIT_RESULTS.violations.rawTextSizeClasses.length,
    rawButtons: AUDIT_RESULTS.violations.rawButtons.length,
    missingVariant: AUDIT_RESULTS.violations.missingVariant.length
  },
  compliance: {
    typography: {
      files: AUDIT_RESULTS.compliance.typography.files,
      percentage: (AUDIT_RESULTS.compliance.typography.files / AUDIT_RESULTS.totalFiles * 100).toFixed(1)
    },
    card: {
      files: AUDIT_RESULTS.compliance.card.files,
      percentage: (AUDIT_RESULTS.compliance.card.files / AUDIT_RESULTS.totalFiles * 100).toFixed(1)
    },
    button: {
      files: AUDIT_RESULTS.compliance.button.files,
      percentage: (AUDIT_RESULTS.compliance.button.files / AUDIT_RESULTS.totalFiles * 100).toFixed(1)
    },
    layout: {
      files: AUDIT_RESULTS.compliance.layout.files,
      percentage: (AUDIT_RESULTS.compliance.layout.files / AUDIT_RESULTS.totalFiles * 100).toFixed(1)
    },
    variant: {
      files: AUDIT_RESULTS.compliance.variant.files,
      percentage: (AUDIT_RESULTS.compliance.variant.files / AUDIT_RESULTS.totalFiles * 100).toFixed(1)
    }
  }
};

console.log('📊 AUDIT SUMMARY');
console.log('================');
console.log(`Total Files: ${summary.totalFiles}`);
console.log(`Files with Violations: ${summary.filesWithViolations}`);
console.log(`Overall Compliance: ${summary.complianceRate}%\n`);
console.log('Violations:');
console.log(`  - Raw Font Classes: ${summary.violations.rawFontClasses}`);
console.log(`  - Raw Text Size Classes: ${summary.violations.rawTextSizeClasses}`);
console.log(`  - Raw Buttons: ${summary.violations.rawButtons}`);
console.log(`  - Missing Variants: ${summary.violations.missingVariant}\n`);
console.log('Component Adoption:');
console.log(`  - Typography: ${summary.compliance.typography.files} files (${summary.compliance.typography.percentage}%)`);
console.log(`  - Card: ${summary.compliance.card.files} files (${summary.compliance.card.percentage}%)`);
console.log(`  - Button: ${summary.compliance.button.files} files (${summary.compliance.button.percentage}%)`);
console.log(`  - Layout: ${summary.compliance.layout.files} files (${summary.compliance.layout.percentage}%)`);
console.log(`  - Variant: ${summary.compliance.variant.files} files (${summary.compliance.variant.percentage}%)\n`);

// Write detailed results
writeFileSync(
  'COMPREHENSIVE_AUDIT_RESULTS.json',
  JSON.stringify({ summary, ...AUDIT_RESULTS }, null, 2)
);

console.log('📝 Detailed results written to COMPREHENSIVE_AUDIT_RESULTS.json');
