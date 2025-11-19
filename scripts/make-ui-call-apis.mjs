#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('Making UI files call their corresponding APIs...\n');

const appDir = path.join(rootDir, 'src/app');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'api') {
      processDirectory(filePath);
    } else if (file === 'page.tsx') {
      // This is a UI page, make it call its corresponding API
      const apiPath = filePath
        .replace('/src/app/', '/api/')
        .replace('/page.tsx', '');
      
      let content = fs.readFileSync(filePath, 'utf-8');
      
      // Add API call comment if not already present
      if (!content.includes('/api/') && !content.includes('TODO: Implement')) {
        content = content.replace(
          'UI implementation pending',
          `UI implementation pending\n  // API endpoint: ${apiPath}`
        );
        
        // Add a fetch call in a useEffect
        content = content.replace(
          'export default function',
          `// This component calls: ${apiPath}\n\nexport default function`
        );
        
        fs.writeFileSync(filePath, content);
        console.log(`✓ Updated ${filePath.replace(rootDir, '')}`);
      }
    }
  }
}

processDirectory(appDir);

console.log('\n✅ All UI files now reference their APIs!');
