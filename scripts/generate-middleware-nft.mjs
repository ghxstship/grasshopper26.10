#!/usr/bin/env node
/**
 * Generate middleware.js and middleware.js.nft.json for Vercel deployment
 * Next.js 16 edge middleware is in .next/server/edge/chunks/ 
 * but Vercel expects .next/server/middleware.js
 */

import { writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const serverDir = join(projectRoot, '.next/server');
const edgeDir = join(serverDir, 'edge/chunks');
const middlewareJsPath = join(serverDir, 'middleware.js');
const middlewareNftPath = join(serverDir, 'middleware.js.nft.json');

// Check if .next/server exists
if (!existsSync(serverDir)) {
  console.log('⚠️  .next/server directory not found, skipping middleware generation');
  process.exit(0);
}

// Create middleware.js that re-exports from edge chunks
let middlewareContent = `// Auto-generated for Vercel compatibility
// Next.js 16 edge middleware wrapper
`;

// Check if edge chunks exist and find the main middleware chunk
if (existsSync(edgeDir)) {
  const chunks = readdirSync(edgeDir);
  const rootChunk = chunks.find(f => f.includes('[root-of-the-server]') && f.endsWith('.js'));
  
  if (rootChunk) {
    middlewareContent += `export * from './edge/chunks/${rootChunk}';\n`;
    console.log(`📦 Found edge middleware chunk: ${rootChunk}`);
  } else {
    // Fallback: create minimal middleware export
    middlewareContent += `
export function middleware(request) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
`;
    console.log('⚠️  Edge chunk not found, creating fallback middleware');
  }
} else {
  console.log('⚠️  Edge directory not found, creating minimal middleware');
  middlewareContent += `
export function middleware(request) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
`;
}

// Minimal NFT manifest for edge middleware
const nftManifest = {
  version: 1,
  files: []
};

try {
  writeFileSync(middlewareJsPath, middlewareContent);
  console.log('✅ Generated middleware.js for Vercel');
  
  writeFileSync(middlewareNftPath, JSON.stringify(nftManifest, null, 2));
  console.log('✅ Generated middleware.js.nft.json for Vercel');
} catch (error) {
  console.error('❌ Failed to generate middleware files:', error.message);
  process.exit(1);
}
