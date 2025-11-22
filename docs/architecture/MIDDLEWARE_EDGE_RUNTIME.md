# Middleware Edge Runtime Configuration

## Overview

The application middleware runs on Vercel Edge Runtime for optimal performance and global distribution. This requires special configuration to avoid Node.js-specific dependencies like Prisma.

## Key Changes

### 1. JWT-Based Authentication (Edge-Compatible)

The middleware uses `getToken()` from `next-auth/jwt` instead of the full NextAuth `auth()` function:
- **No database access** - reads JWT token directly from cookies
- **No Prisma dependencies** - completely edge-compatible
- **Fast and efficient** - pure JavaScript token validation
- Requires `NEXTAUTH_SECRET` environment variable

### 2. Middleware Configuration (`middleware.ts`)

- Uses `getToken()` from `next-auth/jwt` for authentication
- No imports from Prisma or database-dependent code
- Pure JavaScript role checking (no database queries)
- Event role platform access mapping inlined to avoid external dependencies

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
