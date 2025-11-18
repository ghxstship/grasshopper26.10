# Legend Roles Implementation Guide

**Status:** ✅ COMPLETE  
**Date:** November 16, 2025  
**Version:** 1.0.0

## Overview

Legend roles provide god-mode capabilities for development, support, and administrative purposes. These roles bypass standard permission checks and include user impersonation capabilities.

## Legend Roles

### 1. LEGEND_SUPER_ADMIN
- **Level:** God Mode
- **Access:** Absolute platform control
- **Impersonation:** Yes (no permission required)
- **Use Case:** Platform owner, ultimate authority

### 2. LEGEND_ADMIN
- **Level:** God Mode
- **Access:** Internal product management
- **Impersonation:** Yes (no permission required)
- **Use Case:** Product management team

### 3. LEGEND_DEVELOPER
- **Level:** God Mode
- **Access:** Full repo access, development tools
- **Impersonation:** Yes (no permission required)
- **Use Case:** Internal development team

### 4. LEGEND_COLLABORATOR
- **Level:** God Mode
- **Access:** Scoped full repo access
- **Impersonation:** No
- **Use Case:** External collaborators with elevated access

### 5. LEGEND_SUPPORT
- **Level:** God Mode
- **Access:** Tech support tools
- **Impersonation:** Yes (requires user permission)
- **Use Case:** Customer support team

### 6. LEGEND_INCOGNITO
- **Level:** God Mode
- **Access:** Stealth mode operations
- **Impersonation:** Yes (no permission required)
- **Use Case:** Security audits, emergency access

## Key Requirements

### Email Domain Validation
- **Required Domain:** `@ghxstship.pro`
- All Legend roles MUST use this email domain
- Enforced at middleware and service levels

### Two-Factor Authentication
- 2FA is REQUIRED for all Legend roles
- Must be enabled before Legend role assignment
- Enforced at authentication level

### Audit Logging
- All Legend role actions are logged
- Enhanced audit trail with role information
- Impersonation sessions fully tracked

### Cross-App Access
- Legend roles can access all 3 applications:
  - ATLVS (primary access point)
  - GVTEWAY
  - COMPVSS

## Implementation Files

### Core Files

#### 1. Role Definitions
**File:** `src/lib/rbac/roles.ts`
- Legend role enum values
- Role hierarchy (inherit from SUPER_ADMIN/SYSTEM_ADMIN)
- Role metadata with impersonation flags
- Helper functions for Legend role validation

#### 2. Legend Middleware
**File:** `src/lib/rbac/legend-middleware.ts`
- `requireLegendRole()` - Require any Legend role
- `requireSpecificLegendRole()` - Require specific Legend role
- `isLegendRequest()` - Check if request is from Legend user
- Email domain validation
- Permission bypass logic

#### 3. Impersonation Service
**File:** `src/lib/services/shared/impersonation.service.ts`
- `startImpersonation()` - Begin impersonating user
- `endImpersonation()` - End impersonation session
- `getActiveSession()` - Get current session
- `grantPermission()` - User grants impersonation permission
- `revokePermission()` - User revokes permission
- `validateImpersonation()` - Check if allowed

#### 4. Audit Service Enhancement
**File:** `src/lib/services/shared/audit.service.ts`
- `logLegendAction()` - Enhanced logging for Legend actions
- Tracks Legend role in metadata
- Timestamp and IP tracking

### Database Schema

#### 5. Prisma Schema
**File:** `prisma/schema.prisma`

**UserRole Enum:**
```prisma
enum UserRole {
  LEGEND_SUPER_ADMIN
  LEGEND_ADMIN
  LEGEND_DEVELOPER
  LEGEND_COLLABORATOR
  LEGEND_SUPPORT
  LEGEND_INCOGNITO
  // ... other roles
}
```

**ImpersonationSession Model:**
```prisma
model ImpersonationSession {
  id              String    @id @default(cuid())
  impersonatorId  String
  targetUserId    String
  startedAt       DateTime  @default(now())
  endedAt         DateTime?
  expiresAt       DateTime?
  reason          String?
  ipAddress       String?
  metadata        Json?
  
  impersonator User @relation("ImpersonatorSessions")
  targetUser   User @relation("TargetUserSessions")
}
```

**ImpersonationPermission Model:**
```prisma
model ImpersonationPermission {
  id          String   @id @default(cuid())
  userId      String
  grantedToId String
  expiresAt   DateTime
  
  user      User @relation("UserPermissions")
  grantedTo User @relation("GrantedToPermissions")
}
```

#### 6. Migration
**File:** `supabase/migrations/048_legend_roles_impersonation.sql`
- Adds Legend roles to enum
- Creates impersonation tables
- Sets up RLS policies
- Creates helper functions

### API Routes

#### 7. Impersonation API
**File:** `src/app/api/legend/impersonate/route.ts`
- `POST /api/legend/impersonate` - Start impersonation
- `GET /api/legend/impersonate` - Get active session
- `DELETE /api/legend/impersonate` - End impersonation

## Usage Examples

### Assigning Legend Role

```typescript
import { prisma } from '@/lib/db';

// Assign Legend role to user
await prisma.user.update({
  where: { 
    email: 'admin@ghxstship.pro' 
  },
  data: { 
    role: 'LEGEND_SUPER_ADMIN' 
  }
});
```

### Checking Legend Role

```typescript
import { hasLegendRole, isValidLegendEmail } from '@/lib/rbac/roles';

// Check if user has Legend role
const userRoles = await getUserRoles(userId);
const isLegend = hasLegendRole(userRoles);

// Validate email domain
const isValid = isValidLegendEmail('user@ghxstship.pro'); // true
```

### Starting Impersonation

```typescript
import { ImpersonationService } from '@/lib/services/shared/impersonation.service';

// Start impersonating user
const session = await ImpersonationService.startImpersonation(
  legendUserId,
  {
    targetUserId: 'user-to-impersonate',
    reason: 'Customer support ticket #12345',
    duration: 60 // minutes
  },
  ipAddress
);

// End impersonation
await ImpersonationService.endImpersonation(session.id);
```

### Using Legend Middleware

```typescript
import { requireLegendRole } from '@/lib/rbac/legend-middleware';

// Protect route with Legend role requirement
export const GET = requireLegendRole(async (req) => {
  // Only Legend roles can access this
  return NextResponse.json({ data: 'sensitive' });
});
```

### Granting Impersonation Permission

```typescript
import { ImpersonationService } from '@/lib/services/shared/impersonation.service';

// User grants permission to support team
await ImpersonationService.grantPermission(
  userId,
  supportUserId,
  30 // expires in 30 days
);

// User revokes permission
await ImpersonationService.revokePermission(userId, supportUserId);
```

## Security Considerations

### 1. Email Domain Enforcement
- Middleware validates `@ghxstship.pro` domain
- Database constraint recommended
- Regular audits of Legend role assignments

### 2. Audit Trail
- All Legend actions logged with enhanced metadata
- Impersonation sessions fully tracked
- IP addresses and timestamps recorded
- Regular audit log reviews

### 3. Permission Requirements
- `LEGEND_SUPPORT` requires user permission
- Other Legend roles bypass permission checks
- Permission expiration enforced

### 4. Session Management
- Impersonation sessions can expire
- Active sessions tracked in database
- Automatic cleanup of expired sessions

### 5. Two-Factor Authentication
- Required for all Legend roles
- Enforced at authentication layer
- Cannot be bypassed

## Testing

### Unit Tests
```typescript
describe('Legend Roles', () => {
  it('should validate Legend email domain', () => {
    expect(isValidLegendEmail('user@ghxstship.pro')).toBe(true);
    expect(isValidLegendEmail('user@other.com')).toBe(false);
  });

  it('should check impersonation capability', () => {
    expect(canImpersonate(Role.LEGEND_SUPER_ADMIN)).toBe(true);
    expect(canImpersonate(Role.LEGEND_COLLABORATOR)).toBe(false);
  });

  it('should require permission for LEGEND_SUPPORT', () => {
    expect(requiresPermissionToImpersonate(Role.LEGEND_SUPPORT)).toBe(true);
    expect(requiresPermissionToImpersonate(Role.LEGEND_INCOGNITO)).toBe(false);
  });
});
```

### Integration Tests
```typescript
describe('Impersonation Service', () => {
  it('should start and end impersonation session', async () => {
    const session = await ImpersonationService.startImpersonation(
      legendUserId,
      { targetUserId: targetId }
    );
    
    expect(session.impersonatorId).toBe(legendUserId);
    expect(session.targetUserId).toBe(targetId);
    
    await ImpersonationService.endImpersonation(session.id);
    
    const ended = await prisma.impersonationSession.findUnique({
      where: { id: session.id }
    });
    
    expect(ended?.endedAt).toBeTruthy();
  });
});
```

## Deployment Checklist

- [x] Legend roles added to Prisma schema
- [x] Migration file created
- [x] ImpersonationService implemented
- [x] Legend middleware created
- [x] Audit logging enhanced
- [x] API routes created
- [x] RLS policies configured
- [ ] Run migration: `npm run db:migrate`
- [ ] Generate Prisma client: `npm run db:generate`
- [ ] Deploy to production
- [ ] Assign initial Legend roles
- [ ] Enable 2FA for Legend users
- [ ] Test impersonation flow
- [ ] Review audit logs

## Monitoring

### Metrics to Track
1. Number of active Legend users
2. Impersonation session frequency
3. Average impersonation duration
4. Permission grant/revoke frequency
5. Failed impersonation attempts

### Alerts
- Unusual impersonation patterns
- Multiple concurrent impersonation sessions
- Impersonation without proper permissions
- Legend role assignments to non-@ghxstship.pro emails

## Support

### Common Issues

**Issue:** Cannot assign Legend role  
**Solution:** Verify email domain is `@ghxstship.pro`

**Issue:** Impersonation fails  
**Solution:** Check if user has granted permission (for LEGEND_SUPPORT)

**Issue:** Cannot access Legend features  
**Solution:** Verify 2FA is enabled

## Changelog

### Version 1.0.0 (2025-11-16)
- Initial implementation
- 6 Legend roles defined
- Impersonation system complete
- Audit logging enhanced
- API routes created
- Documentation complete

---

**Maintained by:** Development Team  
**Last Updated:** November 16, 2025  
**Next Review:** December 16, 2025
