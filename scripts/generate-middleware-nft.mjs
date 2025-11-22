#!/usr/bin/env node
import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const serverDir = join(projectRoot, '.next/server');
const nftPath = join(serverDir, 'middleware.js.nft.json');

if (!existsSync(serverDir)) {
  console.log('⚠️  .next/server not found');
  process.exit(0);
}

writeFileSync(nftPath, JSON.stringify({ version: 1, files: [] }, null, 2));
console.log('✅ Generated middleware.js.nft.json');
