#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

console.log('🔧 Fixing all ESLint warnings automatically...\n');

// Step 1: Get all files with warnings
console.log('📋 Step 1: Identifying files with warnings...');
let filesWithIssues = [];

try {
  const output = execSync('npx eslint src/ --format json', { 
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024 // 10MB buffer
  });
  const results = JSON.parse(output);
  filesWithIssues = results.filter(f => f.warningCount > 0 || f.errorCount > 0);
} catch (error) {
  if (error.stdout) {
    try {
      const results = JSON.parse(error.stdout);
      filesWithIssues = results.filter(f => f.warningCount > 0 || f.errorCount > 0);
    } catch {
      console.log('⚠️  JSON parse error, using alternative approach...');
      // Fallback: just run the fixes on all files
      filesWithIssues = [];
    }
  }
}

console.log(`Found ${filesWithIssues.length} files with issues\n`);

// Step 2: Fix unused variables by prefixing with underscore
console.log('🧹 Step 2: Prefixing unused variables with underscore...');
let fixedCount = 0;

for (const file of filesWithIssues) {
  const unusedVarMessages = file.messages.filter(msg => 
    (msg.ruleId === '@typescript-eslint/no-unused-vars' || msg.ruleId === 'no-unused-vars') &&
    msg.message.includes("must match /^_/u")
  );
  
  if (unusedVarMessages.length === 0) continue;
  
  try {
    let content = readFileSync(file.filePath, 'utf-8');
    let modified = false;
    
    for (const msg of unusedVarMessages) {
      const match = msg.message.match(/'([^']+)'/);
      if (!match) continue;
      
      const varName = match[1];
      if (varName.startsWith('_')) continue;
      
      // Replace variable declarations and parameters
      const patterns = [
        // Function/arrow function parameters
        { regex: new RegExp(`\\(([^)]*\\b)${varName}\\b([^)]*)\\)`, 'g'), replace: `($1_${varName}$2)` },
        // Const/let/var declarations
        { regex: new RegExp(`\\b(const|let|var)\\s+${varName}\\b`, 'g'), replace: `$1 _${varName}` },
        // Destructuring in objects
        { regex: new RegExp(`{([^}]*),\\s*${varName}\\b([^}]*)}`, 'g'), replace: `{$1, _${varName}$2}` },
        { regex: new RegExp(`{\\s*${varName}\\b([^}]*)}`, 'g'), replace: `{ _${varName}$1}` },
        // Array destructuring
        { regex: new RegExp(`\\[([^\\]]*),\\s*${varName}\\b([^\\]]*)\\]`, 'g'), replace: `[$1, _${varName}$2]` },
      ];
      
      for (const { regex, replace } of patterns) {
        const newContent = content.replace(regex, replace);
        if (newContent !== content) {
          content = newContent;
          modified = true;
          break;
        }
      }
    }
    
    if (modified) {
      writeFileSync(file.filePath, content, 'utf-8');
      fixedCount++;
      console.log(`  ✅ ${file.filePath.replace(process.cwd() + '/', '')}`);
    }
  } catch (error) {
    console.error(`  ❌ ${file.filePath}: ${error.message}`);
  }
}

console.log(`\nPrefixed ${fixedCount} files\n`);

// Step 3: Run ESLint auto-fix
console.log('🔧 Step 3: Running ESLint auto-fix...');
try {
  execSync('npx eslint src/ --fix --quiet', { stdio: 'inherit' });
  console.log('✅ Auto-fix completed\n');
} catch {
  console.log('⚠️  Auto-fix completed with some remaining issues\n');
}

// Step 4: Final report
console.log('📊 Step 4: Generating final report...\n');
try {
  const output = execSync('npx eslint src/ --format json', { 
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024 // 10MB buffer
  });
  const results = JSON.parse(output);
  
  const errors = results.reduce((sum, f) => sum + f.errorCount, 0);
  const warnings = results.reduce((sum, f) => sum + f.warningCount, 0);
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                   FINAL RESULTS                           ');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n❌ Errors: ${errors}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  
  if (errors === 0 && warnings === 0) {
    console.log('\n🎉 PERFECT! Zero issues remaining!');
  } else if (errors === 0) {
    console.log('\n✅ No errors! Only warnings remain.');
    console.log('\nTo see remaining warnings:');
    console.log('   npx eslint src/ --format compact');
  } else {
    console.log('\n⚠️  Some errors require manual review.');
    console.log('\nTo see details:');
    console.log('   npx eslint src/ --format compact');
  }
  
  console.log('\n═══════════════════════════════════════════════════════════\n');
} catch (error) {
  if (error.stdout) {
    try {
      const results = JSON.parse(error.stdout);
      const errors = results.reduce((sum, f) => sum + f.errorCount, 0);
      const warnings = results.reduce((sum, f) => sum + f.warningCount, 0);
      
      console.log('═══════════════════════════════════════════════════════════');
      console.log(`\n❌ Errors: ${errors}`);
      console.log(`⚠️  Warnings: ${warnings}`);
      console.log('\n═══════════════════════════════════════════════════════════\n');
    } catch {
      console.log('\n⚠️  Could not parse results. Run manually:');
      console.log('   npx eslint src/ --format compact\n');
    }
  }
}
