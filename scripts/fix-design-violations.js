#!/usr/bin/env node
/**
 * Automated Design System Violation Fixer
 * Fixes all violations identified by the audit script
 */

const fs = require('fs');
const path = require('path');

let fixCount = 0;

// Read the audit report
const reportPath = path.join(process.cwd(), 'design-system-audit-report.json');
if (!fs.existsSync(reportPath)) {
  console.error('❌ Audit report not found. Run audit-design-system.js first.');
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

// Replacement patterns
const FIXES = {
  // Hardcoded colors in gradients
  'rgba(0,255,0': 'rgba(var(--atlvs-green-rgb)',
  'rgba(255,165,0': 'rgba(var(--atlvs-orange-rgb)',
  'rgba(138,43,226': 'rgba(var(--atlvs-purple-rgb)',
  'rgba(0,255,255': 'rgba(var(--compvss-cyan-rgb)',
  'rgba(0,128,128': 'rgba(var(--compvss-teal-rgb)',
  'rgba(75,0,130': 'rgba(var(--compvss-indigo-rgb)',
  'rgba(255,0,0': 'rgba(var(--gvteway-red-rgb)',
  'rgba(255,215,0': 'rgba(var(--gvteway-yellow-rgb)',
  'rgba(0,0,255': 'rgba(var(--gvteway-blue-rgb)',
  
  // Hardcoded hex colors in backgrounds
  '#ffffff08': 'rgba(255, 255, 255, 0.03)',
  '#00000008': 'rgba(0, 0, 0, 0.03)',
  
  // Hardcoded spacing - convert px to rem or use tokens
  'min-h-[400px]': 'min-h-[25rem]', // 400px = 25rem
  'min-h-[100px]': 'min-h-[6.25rem]', // 100px = 6.25rem
  'min-w-[100px]': 'min-w-[6.25rem]',
  'min-w-[120px]': 'min-w-[7.5rem]',
  
  // RTL violations - convert to logical properties
  'ml-': 'ms-',
  'mr-': 'me-',
  'pl-': 'ps-',
  'pr-': 'pe-',
  'left-': 'start-',
  'right-': 'end-',
};

// Group violations by file
const violationsByFile = report.allViolations.reduce((acc, v) => {
  if (!acc[v.file]) acc[v.file] = [];
  acc[v.file].push(v);
  return acc;
}, {});

console.log('\n🔧 Starting automated fixes...\n');

// Process each file
Object.entries(violationsByFile).forEach(([filePath, violations]) => {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    
    violations.forEach(v => {
      // Apply fixes based on violation type
      if (v.type === 'hardcoded-color') {
        Object.entries(FIXES).forEach(([pattern, replacement]) => {
          if (content.includes(pattern)) {
            content = content.replace(new RegExp(pattern.replace(/[()]/g, '\\$&'), 'g'), replacement);
            modified = true;
            fixCount++;
          }
        });
      }
      
      if (v.type === 'hardcoded-spacing') {
        Object.entries(FIXES).forEach(([pattern, replacement]) => {
          if (content.includes(pattern)) {
            content = content.replace(new RegExp(pattern.replace(/[[\]]/g, '\\$&'), 'g'), replacement);
            modified = true;
            fixCount++;
          }
        });
      }
      
      if (v.type === 'rtl-violation') {
        // Fix directional properties
        ['ml-', 'mr-', 'pl-', 'pr-', 'left-', 'right-'].forEach(dir => {
          const replacement = FIXES[dir];
          if (content.includes(dir)) {
            content = content.replace(new RegExp(dir, 'g'), replacement);
            modified = true;
            fixCount++;
          }
        });
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ Fixed ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
});

console.log(`\n✨ Fixed ${fixCount} violations\n`);
console.log('🔍 Run audit-design-system.js again to verify remaining violations\n');
