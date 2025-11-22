#!/usr/bin/env node
/**
 * Generate middleware.js.nft.json for Vercel deployment
 * Next.js 16 edge middleware doesn't generate NFT manifest automatically
 * This creates a minimal one for Vercel compatibility
 */

import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const middlewareNftPath = join(projectRoot, '.next/server/middleware.js.nft.json');

// Check if .next/server exists
const serverDir = join(projectRoot, '.next/server');
if (!existsSync(serverDir)) {
  console.log('⚠️  .next/server directory not found, skipping middleware NFT generation');
  process.exit(0);
}

// Minimal NFT manifest for edge middleware
const nftManifest = {
  version: 1,
  files: []
};

try {
  writeFileSync(middlewareNftPath, JSON.stringify(nftManifest, null, 2));
  console.log('✅ Generated middleware.js.nft.json for Vercel');
} catch (error) {
  console.error('❌ Failed to generate middleware.js.nft.json:', error.message);
  process.exit(1);
}
