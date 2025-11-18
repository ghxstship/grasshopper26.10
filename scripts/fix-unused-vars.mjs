#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

console.log('🧹 Fixing unused variables by prefixing with underscore...\n');

// Get ESLint results in JSON format
let eslintResults;
try {
  const output = execSync('npx eslint src/ --format json', { encoding: 'utf-8' });
  eslintResults = JSON.parse(output);
} catch (error) {
  // ESLint exits with error code when issues found, but still outputs JSON
  if (error.stdout) {
    eslintResults = JSON.parse(error.stdout);
  } else {
    console.error('❌ Failed to get ESLint results');
    process.exit(1);
  }
}

// Filter files with unused var warnings
const filesWithUnusedVars = eslintResults
  .filter(file => file.messages.some(msg => 
    msg.ruleId === '@typescript-eslint/no-unused-vars' || 
    msg.ruleId === 'no-unused-vars'
  ))
  .map(file => ({
    filePath: file.filePath,
    messages: file.messages.filter(msg => 
      (msg.ruleId === '@typescript-eslint/no-unused-vars' || msg.ruleId === 'no-unused-vars') &&
      msg.message.includes("must match /^_/u")
    )
  }))
  .filter(file => file.messages.length > 0);

console.log(`Found ${filesWithUnusedVars.length} files with unused variables\n`);

let totalFixed = 0;
let totalSkipped = 0;

for (const file of filesWithUnusedVars) {
  try {
    const content = readFileSync(file.filePath, 'utf-8');
    let modified = false;
    let newContent = content;
    
    // Sort messages by line number in reverse to avoid offset issues
    const sortedMessages = file.messages.sort((a, b) => b.line - a.line);
    
    for (const msg of sortedMessages) {
      // Extract variable name from message
      const match = msg.message.match(/'([^']+)' is (?:defined|assigned)/);
      if (!match) continue;
      
      const varName = match[1];
      if (varName.startsWith('_')) continue; // Already prefixed
      
      const lines = newContent.split('\n');
      const lineIndex = msg.line - 1;
      
      if (lineIndex >= lines.length) continue;
      
      const line = lines[lineIndex];
      
      // Try to replace the variable name at the specific location
      // Handle different patterns: const/let/var declarations, function params, destructuring
      const patterns = [
        // Function parameters: functionName(varName, ...)
        new RegExp(`\\b${varName}\\b(?=\\s*[,:\\)])`, 'g'),
        // Declarations: const/let/var varName
        new RegExp(`\\b(const|let|var)\\s+${varName}\\b`, 'g'),
        // Destructuring: { varName }
        new RegExp(`([{,]\\s*)${varName}\\b`, 'g'),
      ];
      
      let lineModified = false;
      for (const pattern of patterns) {
        const newLine = line.replace(pattern, (match, prefix) => {
          if (prefix && (prefix === 'const' || prefix === 'let' || prefix === 'var')) {
            return `${prefix} _${varName}`;
          } else if (prefix) {
            return `${prefix}_${varName}`;
          }
          return `_${varName}`;
        });
        
        if (newLine !== line) {
          lines[lineIndex] = newLine;
          lineModified = true;
          break;
        }
      }
      
      if (lineModified) {
        newContent = lines.join('\n');
        modified = true;
        totalFixed++;
      } else {
        totalSkipped++;
      }
    }
    
    if (modified) {
      writeFileSync(file.filePath, newContent, 'utf-8');
      console.log(`✅ Fixed: ${file.filePath.replace(process.cwd() + '/', '')}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${file.filePath}:`, error.message);
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Fixed: ${totalFixed}`);
console.log(`   Skipped: ${totalSkipped}`);

// Run ESLint again to verify
console.log('\n🔍 Verifying fixes...\n');
try {
  execSync('npx eslint src/ --fix', { stdio: 'inherit' });
  console.log('\n✅ All fixes applied successfully!');
} catch {
  console.log('\n⚠️  Some issues remain - run: npx eslint src/ --format compact');
}
