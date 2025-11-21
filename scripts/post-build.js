#!/usr/bin/env node
/**
 * Post-build script to create missing .nft.json files for Vercel deployment
 * This is a workaround for Next.js 16 + Turbopack not generating these files
 */

const fs = require('fs');
const path = require('path');

const middlewarePath = path.join(process.cwd(), '.next/server/middleware.js.nft.json');
const middlewareDir = path.dirname(middlewarePath);

// Ensure directory exists
if (!fs.existsSync(middlewareDir)) {
  fs.mkdirSync(middlewareDir, { recursive: true });
}

// Create minimal .nft.json file
const nftContent = {
  version: 1,
  files: []
};

fs.writeFileSync(middlewarePath, JSON.stringify(nftContent, null, 2));
console.log('✓ Created middleware.js.nft.json for Vercel deployment');
