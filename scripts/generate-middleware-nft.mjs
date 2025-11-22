#!/usr/bin/env node
import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const serverDir = join(projectRoot, '.next/server');
const middlewareJsPath = join(serverDir, 'middleware.js');
const nftPath = join(serverDir, 'middleware.js.nft.json');

if (!existsSync(serverDir)) {
  console.log('⚠️  .next/server not found');
  process.exit(0);
}

// Create placeholder middleware.js that Vercel expects
const middlewareJs = `// Edge runtime middleware - Vercel processes via middleware-manifest.json
module.exports = {};
`;

// Create NFT manifest
const nftManifest = { version: 1, files: [] };

writeFileSync(middlewareJsPath, middlewareJs);
console.log('✅ Generated middleware.js');

writeFileSync(nftPath, JSON.stringify(nftManifest, null, 2));
console.log('✅ Generated middleware.js.nft.json');
