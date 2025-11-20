#!/usr/bin/env node
/**
 * Fix Remaining Raw Button Tags
 * Replaces <button> with <Button> component
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const filesToFix = [
  'src/app/atlvs/analytics/kpis/page.tsx',
  'src/app/gvteway/shops/[slug]/page.tsx',
  'src/app/gvteway/auth/onboarding/page.tsx',
  'src/app/gvteway/brands/[slug]/page.tsx',
  'src/app/gvteway/marketplace/[id]/page.tsx',
  'src/app/gvteway/auth/register/page.tsx',
  'src/app/gvteway/auth/login/page.tsx',
  'src/app/gvteway/auth/connect-wallet/page.tsx',
  'src/app/gvteway/brands/page.tsx',
  'src/app/nft/[id]/page.tsx',
];

let totalFixed = 0;

for (const file of filesToFix) {
  const filePath = path.join(ROOT, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Check if Button is already imported
  const hasButtonImport = content.includes("from '@/components/atoms/Button'") || 
                          content.includes('from "@/components/atoms/Button"');
  
  // Add Button import if not present
  if (!hasButtonImport && content.includes('<button')) {
    // Find the last import statement
    const importRegex = /import[^;]+;/g;
    const imports = content.match(importRegex);
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const insertIndex = content.indexOf(lastImport) + lastImport.length;
      content = content.slice(0, insertIndex) + 
                `\nimport { Button } from '@/components/atoms/Button';` +
                content.slice(insertIndex);
    }
  }
  
  // Replace raw button tags with Button component
  // Pattern 1: Simple buttons with className
  content = content.replace(
    /<button\s+([^>]*?)className="([^"]*?)"([^>]*?)>/g,
    (match, before, className, after) => {
      // Determine variant based on className
      let variant = 'ghost';
      if (className.includes('bg-atlvs-green')) variant = 'atlvs';
      else if (className.includes('bg-gvteway-red') || className.includes('bg-ghxst-primary')) variant = 'gvteway';
      else if (className.includes('bg-compvss')) variant = 'compvss';
      else if (className.includes('border-')) variant = 'outline';
      
      // Clean up className - remove button-specific styles that Button handles
      let cleanClassName = className
        .replace(/\s*bg-[^\s]+/g, '')
        .replace(/\s*hover:bg-[^\s]+/g, '')
        .replace(/\s*text-[^\s]+/g, '')
        .replace(/\s*px-\d+/g, '')
        .replace(/\s*py-\d+/g, '')
        .replace(/\s*rounded[^\s]*/g, '')
        .replace(/\s*transition[^\s]*/g, '')
        .trim();
      
      const variantAttr = variant !== 'ghost' ? ` variant="${variant}"` : '';
      const classNameAttr = cleanClassName ? ` className="${cleanClassName}"` : '';
      
      return `<Button${before}${variantAttr}${classNameAttr}${after}>`;
    }
  );
  
  // Replace closing tags
  content = content.replace(/<\/button>/g, '</Button>');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalFixed++;
    console.log(`✅ Fixed: ${file}`);
  }
}

console.log(`\n🎉 Fixed ${totalFixed} files`);
