#!/usr/bin/env node
import { execSync } from 'child_process';

console.log('🔧 Running ESLint auto-fix...\n');

try {
  // Run ESLint with --fix flag to automatically fix issues
  execSync('npx eslint src/ --fix --max-warnings 0', {
    stdio: 'inherit',
    encoding: 'utf-8'
  });
  
  console.log('\n✅ ESLint auto-fix completed successfully!');
} catch (error) {
  console.log('\n⚠️  ESLint found issues that need manual review');
  console.log('Running report of remaining issues...\n');
  
  try {
    execSync('npx eslint src/ --format compact', {
      stdio: 'inherit',
      encoding: 'utf-8'
    });
  } catch (reportError) {
    // Expected to fail if there are still issues
  }
}

console.log('\n📊 Checking remaining issues...');
try {
  const result = execSync('npx eslint src/ --format json', {
    encoding: 'utf-8'
  });
  
  const issues = JSON.parse(result);
  const totalErrors = issues.reduce((sum, file) => sum + file.errorCount, 0);
  const totalWarnings = issues.reduce((sum, file) => sum + file.warningCount, 0);
  
  console.log(`   Errors: ${totalErrors}`);
  console.log(`   Warnings: ${totalWarnings}`);
  
  if (totalErrors === 0 && totalWarnings === 0) {
    console.log('\n🎉 ZERO ESLint issues remaining!');
  }
} catch (error) {
  // If there are issues, the command will fail
  console.log('   Some issues remain - check output above');
}
