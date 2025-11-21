# Authentication, RBAC, and RLS Implementation

## Overview

This document describes the comprehensive authentication, role-based access control (RBAC), and row-level security (RLS) implementation for the Grasshopper26.10 platform.

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
3. [Row-Level Security (RLS)](#row-level-security-rls)
4. [Implementation Details](#implementation-details)
5. [Usage Examples](#usage-examples)
6. [Security Best Practices](#security-best-practices)

---

## Authentication Flow

### Multi-Layer Protection

All platform routes (`/atlvs`, `/compvss`, `/gvteway`) are protected by **three layers** of authentication:

1. **Server Middleware** (`/middleware.ts`)
   - Runs on every request
   - Validates session before page loads
   - Redirects unauthenticated users to login
   - Enforces platform-specific role requirements

2. **Layout Guards** (Platform layouts)
   - Client-side protection using `PlatformGuard`
   - Validates user role matches platform requirements
   - Shows loading state during authentication check

3. **Page-Level Guards** (Individual pages)
   - Optional additional permission checks
   - Fine-grained access control per feature

### Authentication Providers

- **Credentials** (Email/Password)
- **Google OAuth**
- **Bluesky OAuth**
- **Wallet Connect** (Crypto wallets)

---

## Role-Based Access Control (RBAC)

### User Roles

```typescript
enum UserRole {
  // Legend Roles (God Mode)
  LEGEND_SUPER_ADMIN
  LEGEND_ADMIN
  LEGEND_DEVELOPER
  LEGEND_COLLABORATOR
  LEGEND_SUPPORT
  LEGEND_INCOGNITO
  
  // Standard Platform Roles
  CONSUMER        // GVTEWAY users
  EXTERNAL_TEAM   // COMPVSS users
  INTERNAL_TEAM   // ATLVS users
  ADMIN           // System administrators
  
  // All Platforms Event Roles
  EXECUTIVE
  CORE_AAA
  AA
  PRODUCTION
  MANAGEMENT
  
  // COMPVSS Event Roles
  CREW
  STAFF
  VENDOR
  ENTERTAINER
  ARTIST
  AGENT
  MEDIA
  SPONSOR
  PARTNER
  INDUSTRY
  INTERN
  VOLUNTEER
  
  // GVTEWAY Event Roles
  GUEST           // Guest List
  BACKSTAGE_L1    // Backstage Level 1
  BACKSTAGE_L2    // Backstage Level 2
  PLATINUM_VIP_L1 // Platinum VIP Level 1
  PLATINUM_VIP_L2 // Platinum VIP Level 2
  VIP_L1          // VIP Level 1
  VIP_L2          // VIP Level 2
  VIP_L3          // VIP Level 3
  GA_L1           // GA Level 1
  GA_L2           // GA Level 2
  GA_L3           // GA Level 3
  GA_L4           // GA Level 4
  GA_L5           // GA Level 5
  INFLUENCER
  BRAND_AMBASSADOR
  AFFILIATE
}
```

### Platform Access Matrix

#### Base Platform Roles

| Platform | Allowed Roles |
|----------|---------------|
| **ATLVS** | INTERNAL_TEAM, ADMIN, SUPER_ADMIN, Legend roles, All Platforms event roles |
| **COMPVSS** | EXTERNAL_TEAM, ADMIN, SUPER_ADMIN, Legend roles, All Platforms event roles, COMPVSS event roles |
| **GVTEWAY** | CONSUMER, ORGANIZER, ADMIN, SUPER_ADMIN, Legend roles, All Platforms event roles, GVTEWAY event roles, cross-platform event roles (ENTERTAINER, ARTIST, MEDIA, SPONSOR, PARTNER) |

#### Event Role Platform Access

| Event Role | ATLVS | COMPVSS | GVTEWAY | Notes |
|------------|-------|---------|---------|-------|
| **All Platforms Roles** |
| EXECUTIVE | ✅ | ✅ | ✅ | Full access to all platforms |
| CORE_AAA | ✅ | ✅ | ✅ | Full access to all platforms |
| AA | ✅ | ✅ | ✅ | Full access to all platforms |
| PRODUCTION | ✅ | ✅ | ✅ | Full access to all platforms |
| MANAGEMENT | ✅ | ✅ | ✅ | Full access to all platforms |
| **COMPVSS Event Roles** |
| CREW | ❌ | ✅ | ❌ | COMPVSS only |
| STAFF | ❌ | ✅ | ❌ | COMPVSS only |
| VENDOR | ❌ | ✅ | ❌ | COMPVSS only |
| ENTERTAINER | ❌ | ✅ | ✅ | Cross-platform |
| ARTIST | ❌ | ✅ | ✅ | Cross-platform |
| AGENT | ❌ | ✅ | ❌ | COMPVSS only |
| MEDIA | ❌ | ✅ | ✅ | Cross-platform |
| SPONSOR | ❌ | ✅ | ✅ | Cross-platform |
| PARTNER | ❌ | ✅ | ✅ | Cross-platform |
| INDUSTRY | ❌ | ✅ | ❌ | COMPVSS only |
| INTERN | ❌ | ✅ | ❌ | COMPVSS only |
| VOLUNTEER | ❌ | ✅ | ❌ | COMPVSS only |
| **GVTEWAY Event Roles** |
| GUEST | ❌ | ❌ | ✅ | GVTEWAY only |
| BACKSTAGE_L1/L2 | ❌ | ❌ | ✅ | GVTEWAY only |
| PLATINUM_VIP_L1/L2 | ❌ | ❌ | ✅ | GVTEWAY only |
| VIP_L1/L2/L3 | ❌ | ❌ | ✅ | GVTEWAY only |
| GA_L1-L5 | ❌ | ❌ | ✅ | GVTEWAY only |
| INFLUENCER | ❌ | ❌ | ✅ | GVTEWAY only |
| BRAND_AMBASSADOR | ❌ | ❌ | ✅ | GVTEWAY only |
| AFFILIATE | ❌ | ❌ | ✅ | GVTEWAY only |

### Permission System

#### Platform Role Permissions

Permissions for platform roles are defined in `/src/hooks/auth/usePermissions.ts`:

```typescript
const ROLE_PERMISSIONS = {
  CONSUMER: ['orders:view'],
  EXTERNAL_TEAM: ['advancing:submit', 'orders:view'],
  INTERNAL_TEAM: [
    'events:create',
    'events:edit',
    'tickets:manage',
    'orders:view',
    'orders:refund',
    'advancing:approve',
    'projects:create',
    'projects:edit',
    'tasks:assign',
    'budgets:manage',
  ],
  ADMIN: [/* All permissions */],
};
```

#### Event Role Permissions

Event roles have specialized permissions defined in `/src/lib/rbac/event-roles.ts`:

**Key Event Role Permissions:**

- **All Platforms Roles** (EXECUTIVE, CORE_AAA, AA, PRODUCTION, MANAGEMENT)
  - Full or elevated access across all platforms
  - Venue access at various levels
  - Backstage access for higher tiers
  
- **COMPVSS Roles** (CREW, STAFF, VENDOR, ENTERTAINER, ARTIST, etc.)
  - `advancing:submit` - Submit advancing requests
  - `venue:access:*` - Role-specific venue access
  - `backstage:access` - For crew and performers
  - `greenroom:access` - For entertainers and artists
  
- **GVTEWAY Roles** (VIP, GA, BACKSTAGE, etc.)
  - `venue:access:*` - Tiered venue access (backstage, platinum_vip, vip, ga, guest)
  - `backstage:access` - Backstage levels 1-2
  - `vip:lounge:access` - VIP lounge access
  - `priority:entry` - Priority entry for higher tiers
  - `referral:create` - For influencers, brand ambassadors, affiliates
  - `commission:view` - For affiliates

**Role Hierarchy:**
- Roles have numeric hierarchy levels (higher = more access)
- EXECUTIVE (1000) > CORE_AAA (900) > AA (800) > ... > VOLUNTEER (50)
- Used for access control and permission inheritance

---

## Row-Level Security (RLS)

### Database-Level Security

All Supabase tables have RLS enabled with policies that enforce:

1. **User Isolation** - Users can only access their own data
2. **Organization Isolation** - Users can only access data from their organizations
3. **Project Membership** - Users can only access projects they're members of
4. **Role-Based Access** - Admins have broader access than regular users

### Key RLS Policies

#### User Policies
- Users can view and update their own profile
- Admins can view all users

#### Project Policies
- Project members can view projects they're assigned to
- Only INTERNAL_TEAM can create projects
- Project creators and admins can update projects

#### Task Policies
- Task assignees can view their tasks
- Project members can create tasks in their projects
- Task creators and assignees can update tasks

#### Budget Policies
- Only project members can view budgets
- Only INTERNAL_TEAM with budget permissions can manage budgets

#### Advancing Request Policies (COMPVSS)
- EXTERNAL_TEAM can view their own requests
- EXTERNAL_TEAM can create advancing requests
- Only INTERNAL_TEAM can approve/reject requests

#### Document Policies
- Project members can view project documents
- Project members can upload documents
- Document uploaders can delete their documents

---

## Implementation Details

### 1. Root Middleware (`/middleware.ts`)

```typescript
// Protects all platform routes
export async function middleware(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.redirect('/auth/login');
  }
  
  // Check role-based access
  if (isAtlvsRoute && !PLATFORM_ROLES.ATLVS.includes(userRole)) {
    return NextResponse.redirect('/unauthorized');
  }
  
  return NextResponse.next();
}
```

### 2. Client-Side Guards

#### PlatformGuard
```typescript
<PlatformGuard platform="ATLVS">
  <AtlvsLayout>{children}</AtlvsLayout>
</PlatformGuard>
```

#### PermissionGuard
```typescript
<PermissionGuard permission="budgets:manage">
  <BudgetManagementUI />
</PermissionGuard>
```

#### MultiPermissionGuard
```typescript
<MultiPermissionGuard 
  permissions={['projects:create', 'projects:edit']}
  requireAll={false}
>
  <ProjectEditor />
</MultiPermissionGuard>
```

### 3. Server-Side Protection

#### In Server Components
```typescript
import { requirePlatformAccess } from '@/lib/auth/server-auth';

export default async function AtlvsPage() {
  const user = await requirePlatformAccess('ATLVS');
  // Page content
}
```

#### In API Routes
```typescript
import { requireAuth, requireRole } from '@/lib/auth';

export async function GET(request: Request) {
  const user = await requireAuth();
  // API logic
}

export async function POST(request: Request) {
  const user = await requireRole('INTERNAL_TEAM');
  // API logic
}
```

### 4. Permission Checks

#### Client-Side
```typescript
import { usePermissions } from '@/hooks/auth/usePermissions';

function MyComponent() {
  const { hasPermission, can } = usePermissions();
  
  if (!hasPermission('budgets:manage')) {
    return <AccessDenied />;
  }
  
  return <BudgetManager />;
}
```

#### Server-Side
```typescript
import { hasServerPermission } from '@/lib/auth/server-auth';

const canManageBudgets = await hasServerPermission(userId, 'budgets:manage');
```

---

## Usage Examples

### Example 1: Protected Page with Role Check

```typescript
// src/app/(platforms)/atlvs/budgets/page.tsx
'use client';

import { PlatformGuard } from '@/components/auth/PlatformGuard';
import { PermissionGuard } from '@/components/auth/PermissionGuard';

export default function BudgetsPage() {
  return (
    <PermissionGuard permission="budgets:manage">
      <div>
        <h1>Budget Management</h1>
        {/* Budget UI */}
      </div>
    </PermissionGuard>
  );
}
```

### Example 2: API Route with Authentication

```typescript
// src/app/api/atlvs/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { hasServerPermission } from '@/lib/auth/server-auth';

export async function POST(request: NextRequest) {
  const user = await requireAuth();
  
  const canCreate = await hasServerPermission(user.id, 'projects:create');
  if (!canCreate) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }
  
  // Create project logic
}
```

### Example 3: Resource Ownership Check

```typescript
import { verifyResourceOwnership } from '@/lib/auth/server-auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await requireAuth();
  
  const isOwner = await verifyResourceOwnership(
    user.id,
    'project',
    params.id
  );
  
  if (!isOwner && user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'You do not own this resource' },
      { status: 403 }
    );
  }
  
  // Delete logic
}
```

---

## Security Best Practices

### 1. Defense in Depth
- Always implement multiple layers of security
- Never rely on client-side checks alone
- Always validate on the server

### 2. Principle of Least Privilege
- Grant minimum necessary permissions
- Use specific permissions instead of broad roles
- Regularly audit user permissions

### 3. Audit Logging
- Log all authentication events
- Log all authorization failures
- Log all sensitive operations

```typescript
import { createServerAuditLog } from '@/lib/auth/server-auth';

await createServerAuditLog(
  user.id,
  'PROJECT_CREATED',
  'Project',
  project.id,
  { projectName: project.name }
);
```

### 4. Session Management
- Use secure session tokens (JWT)
- Implement session timeout (30 days default)
- Support session revocation

### 5. RLS Policy Testing
- Test all RLS policies thoroughly
- Verify users cannot access unauthorized data
- Test edge cases and role combinations

### 6. Rate Limiting
- Implement brute force protection
- Lock accounts after failed attempts
- Use exponential backoff

---

## File Structure

```
├── middleware.ts                           # Root middleware for route protection
├── src/
│   ├── components/
│   │   └── auth/
│   │       ├── AuthGuard.tsx              # Generic auth guard
│   │       ├── PlatformGuard.tsx          # Platform-specific guard
│   │       └── PermissionGuard.tsx        # Permission-based guard
│   ├── hooks/
│   │   └── auth/
│   │       ├── useAuth.ts                 # Auth hook
│   │       ├── usePermissions.ts          # Permissions hook
│   │       └── useUser.ts                 # User data hook
│   ├── lib/
│   │   ├── auth.ts                        # Auth utilities
│   │   ├── auth/
│   │   │   └── server-auth.ts             # Server-side auth utilities
│   │   └── rbac/
│   │       ├── middleware.ts              # RBAC middleware
│   │       ├── permissions.ts             # Permission definitions
│   │       └── roles.ts                   # Role definitions
│   └── app/
│       ├── (platforms)/
│       │   ├── atlvs/layout.tsx           # ATLVS layout with PlatformGuard
│       │   ├── compvss/layout.tsx         # COMPVSS layout with PlatformGuard
│       │   └── gvteway/layout.tsx         # GVTEWAY layout with PlatformGuard
│       └── api/
│           └── auth/
│               └── [...nextauth]/route.ts # NextAuth configuration
└── supabase/
    └── migrations/
        ├── 003_rls_policies.sql           # Base RLS policies
        └── 050_enhanced_rls_policies.sql  # Enhanced RLS policies
```

---

## Testing Authentication

### Manual Testing Checklist

- [ ] Unauthenticated users are redirected to login
- [ ] Users with wrong roles cannot access platforms
- [ ] Users can only see their own data
- [ ] Admins can access all platforms
- [ ] Permission guards work correctly
- [ ] API routes require authentication
- [ ] RLS policies prevent unauthorized access

### Automated Testing

```typescript
// Example test
describe('Authentication', () => {
  it('should redirect unauthenticated users', async () => {
    const response = await fetch('/atlvs/projects');
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toContain('/auth/login');
  });
  
  it('should deny access to wrong role', async () => {
    const consumerSession = await createSession({ role: 'CONSUMER' });
    const response = await fetch('/atlvs/projects', {
      headers: { Cookie: consumerSession },
    });
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toContain('/unauthorized');
  });
});
```

---

## Troubleshooting

### Common Issues

1. **Infinite redirect loops**
   - Check middleware matcher configuration
   - Ensure login page is not protected
   - Verify session is being set correctly

2. **Users can't access allowed routes**
   - Verify role is set correctly in database
   - Check platform role mappings
   - Ensure session includes role data

3. **RLS policies too restrictive**
   - Review policy logic in Supabase
   - Check auth.uid() is set correctly
   - Verify user role in database

4. **Permission checks failing**
   - Ensure permissions are defined for role
   - Check permission string matches exactly
   - Verify user session includes role

---

## Migration Guide

### Existing Pages

To add authentication to existing pages:

1. Ensure page is under `(platforms)` directory
2. Layout already has `PlatformGuard`
3. Add `PermissionGuard` if needed for specific features
4. Update API routes to use `requireAuth()`

### New Features

When adding new features:

1. Define required permissions in `usePermissions.ts`
2. Add RLS policies in new migration file
3. Use `PermissionGuard` in UI components
4. Use `hasServerPermission()` in API routes
5. Add audit logging for sensitive operations

---

## Support

For questions or issues:
- Review this documentation
- Check existing RLS policies in `/supabase/migrations/`
- Review auth utilities in `/src/lib/auth/`
- Test with different user roles
