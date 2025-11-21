# Middleware Edge Runtime Configuration

## Overview

The application middleware runs on Vercel Edge Runtime for optimal performance and global distribution. This requires special configuration to avoid Node.js-specific dependencies like Prisma.

## Key Changes

### 1. Edge-Compatible Auth (`src/lib/auth-edge.ts`)

Created a minimal NextAuth configuration for middleware that:
- Uses JWT session strategy (no database adapter)
- Excludes Prisma and database operations
- Only includes session validation logic
- Properly configured with NEXTAUTH_SECRET

### 2. Middleware Configuration (`middleware.ts`)

- Imports `authEdge` instead of regular `auth` from main auth config
- Explicitly marked with `export const runtime = 'edge'`
- Uses pure JavaScript role checking (no database queries)
- Event role checking via `hasEventRolePlatformAccess` (edge-compatible)

## Build Output

Next.js 16 generates edge middleware in:
```
.next/server/edge/chunks/
├── edge-wrapper_[hash].js
├── [root-of-the-server]__[hash]._.js
└── turbopack-edge-wrapper_[hash].js
```

**Note**: The old `.next/server/middleware.js` path is no longer used in Next.js 16.

## Vercel Configuration

The `vercel.json` has been simplified to use Next.js 16 defaults:
```json
{
  "framework": "nextjs",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

## Environment Variables Required

- `NEXTAUTH_SECRET`: Required for JWT token verification in edge runtime
- `NEXTAUTH_URL`: Base URL for NextAuth

## Limitations

Edge runtime middleware cannot:
- Access Prisma or any database directly
- Use Node.js native modules
- Perform long-running operations (10s timeout)
- Use `fs`, `crypto` (Node.js), or other Node.js APIs

## Role-Based Access Control

Platform access is determined by:
1. **Static role lists** in `PLATFORM_ROLES` constant
2. **Event roles** via `hasEventRolePlatformAccess()` function

Both checks are pure JavaScript with no database dependencies.
