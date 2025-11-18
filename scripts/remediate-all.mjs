#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

console.log('🚀 Starting comprehensive remediation...\n');

// ============================================================================
// STEP 1: Add dynamic exports to client pages with hooks
// ============================================================================
console.log('📝 STEP 1: Adding dynamic exports to client pages with hooks...\n');

const pagesWithHooks = execSync(
  `find src/app -name "page.tsx" -type f -exec grep -l "from '@/lib/hooks\\|from '@/hooks\\|useEffect\\|useState\\|useCallback\\|useMemo\\|useRef" {} \\;`,
  { encoding: 'utf-8' }
)
  .trim()
  .split('\n')
  .filter(Boolean);

console.log(`Found ${pagesWithHooks.length} pages with hooks\n`);

let dynamicModified = 0;
let dynamicSkipped = 0;

for (const filePath of pagesWithHooks) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    // Check if already has dynamic export
    if (content.includes("export const dynamic = 'force-dynamic'")) {
      dynamicSkipped++;
      continue;
    }
    
    // Check if it's a client component
    if (!content.includes("'use client'")) {
      dynamicSkipped++;
      continue;
    }
    
    // Add dynamic export after 'use client'
    const lines = content.split('\n');
    const useClientIndex = lines.findIndex(line => line.includes("'use client'"));
    
    if (useClientIndex !== -1) {
      // Insert after 'use client' and any blank lines
      let insertIndex = useClientIndex + 1;
      while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
        insertIndex++;
      }
      
      lines.splice(insertIndex, 0, '', "export const dynamic = 'force-dynamic';");
      
      const newContent = lines.join('\n');
      writeFileSync(filePath, newContent, 'utf-8');
      
      dynamicModified++;
      console.log(`✅ Added dynamic export: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

console.log(`\n📊 Dynamic Export Summary:`);
console.log(`   Modified: ${dynamicModified}`);
console.log(`   Skipped: ${dynamicSkipped}`);
console.log(`   Total: ${pagesWithHooks.length}\n`);

// ============================================================================
// STEP 2: Remove unused imports and variables
// ============================================================================
console.log('🧹 STEP 2: Removing unused imports and variables...\n');

try {
  // Run ESLint with auto-fix for unused vars and imports
  execSync('npx eslint src/ --fix --rule "no-unused-vars: error" --rule "@typescript-eslint/no-unused-vars: error"', {
    stdio: 'inherit',
    encoding: 'utf-8'
  });
  console.log('✅ Removed unused imports and variables\n');
} catch {
  console.log('⚠️  Some unused imports/variables may need manual review\n');
}

// ============================================================================
// STEP 3: Fix all ESLint issues automatically
// ============================================================================
console.log('🔧 STEP 3: Running comprehensive ESLint auto-fix...\n');

try {
  execSync('npx eslint src/ --fix', {
    stdio: 'inherit',
    encoding: 'utf-8'
  });
  
  console.log('\n✅ ESLint auto-fix completed successfully!');
} catch {
  console.log('\n⚠️  ESLint auto-fix completed with some remaining issues');
}

// ============================================================================
// STEP 4: Generate final report
// ============================================================================
console.log('\n📊 STEP 4: Generating final report...\n');

try {
  const result = execSync('npx eslint src/ --format json', {
    encoding: 'utf-8'
  });
  
  const issues = JSON.parse(result);
  const totalErrors = issues.reduce((sum, file) => sum + file.errorCount, 0);
  const totalWarnings = issues.reduce((sum, file) => sum + file.warningCount, 0);
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                    REMEDIATION COMPLETE                   ');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n📝 Dynamic Exports:`);
  console.log(`   ✅ Added: ${dynamicModified}`);
  console.log(`   ⏭️  Skipped: ${dynamicSkipped}`);
  console.log(`\n🔍 ESLint Status:`);
  console.log(`   ❌ Errors: ${totalErrors}`);
  console.log(`   ⚠️  Warnings: ${totalWarnings}`);
  
  if (totalErrors === 0 && totalWarnings === 0) {
    console.log('\n🎉 PERFECT! Zero ESLint issues remaining!');
  } else if (totalErrors === 0) {
    console.log('\n✅ No errors! Only warnings remain.');
  } else {
    console.log('\n⚠️  Some issues require manual review.');
    console.log('\nRun this command to see details:');
    console.log('   npx eslint src/ --format compact\n');
  }
  
  console.log('═══════════════════════════════════════════════════════════\n');
  
} catch {
  console.log('\n⚠️  Could not generate final report');
  console.log('Run manually: npx eslint src/ --format compact\n');
}
