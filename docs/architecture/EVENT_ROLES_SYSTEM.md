# Event Roles System

## Overview

The Event Roles System provides comprehensive role-based access control for event-specific scenarios across all three platforms (ATLVS, COMPVSS, GVTEWAY). This system extends the base platform roles with specialized event roles that have granular permissions and platform access.

## Role Categories

### 1. All Platforms Event Roles

These roles have access to all three platforms and represent high-level event staff:

- **EXECUTIVE** - Highest level, full access to everything
- **CORE_AAA** - Core team with elevated access
- **AA** - Assistant level with significant access
- **PRODUCTION** - Production team access
- **MANAGEMENT** - Management level access

### 2. COMPVSS Event Roles

Platform-specific roles for compensation and vendor management:

- **CREW** - Event crew members
- **STAFF** - General staff
- **VENDOR** - Vendors and suppliers
- **ENTERTAINER** - Performers (cross-platform with GVTEWAY)
- **ARTIST** - Artists (cross-platform with GVTEWAY)
- **AGENT** - Talent agents
- **MEDIA** - Media personnel (cross-platform with GVTEWAY)
- **SPONSOR** - Event sponsors (cross-platform with GVTEWAY)
- **PARTNER** - Business partners (cross-platform with GVTEWAY)
- **INDUSTRY** - Industry professionals
- **INTERN** - Interns
- **VOLUNTEER** - Volunteers

### 3. GVTEWAY Event Roles

Consumer-facing roles with programmable access levels:

#### Backstage Access (2 Levels)
- **BACKSTAGE_L1** - Backstage Level 1
- **BACKSTAGE_L2** - Backstage Level 2 (higher access)

#### Platinum VIP (2 Levels)
- **PLATINUM_VIP_L1** - Platinum VIP Level 1
- **PLATINUM_VIP_L2** - Platinum VIP Level 2 (higher access)

#### VIP (3 Levels)
- **VIP_L1** - VIP Level 1
- **VIP_L2** - VIP Level 2
- **VIP_L3** - VIP Level 3 (highest VIP)

#### General Admission (5 Levels)
- **GA_L1** - GA Level 1
- **GA_L2** - GA Level 2
- **GA_L3** - GA Level 3
- **GA_L4** - GA Level 4
- **GA_L5** - GA Level 5 (highest GA)

#### Special Roles
- **GUEST** - Guest list access
- **INFLUENCER** - Social media influencers
- **BRAND_AMBASSADOR** - Brand ambassadors
- **AFFILIATE** - Affiliate partners

## Role Hierarchy

Roles are assigned numeric hierarchy levels for access control:

```typescript
EXECUTIVE: 1000        // Highest
CORE_AAA: 900
AA: 800
PRODUCTION: 700
MANAGEMENT: 600
CREW: 500
BACKSTAGE_L2: 500
STAFF: 450
BACKSTAGE_L1: 450
// ... continues down to ...
VOLUNTEER: 50          // Lowest
```

## Platform Access

### Cross-Platform Roles

Some roles have access to multiple platforms:

| Role | ATLVS | COMPVSS | GVTEWAY |
|------|-------|---------|---------|
| ENTERTAINER | ❌ | ✅ | ✅ |
| ARTIST | ❌ | ✅ | ✅ |
| MEDIA | ❌ | ✅ | ✅ |
| SPONSOR | ❌ | ✅ | ✅ |
| PARTNER | ❌ | ✅ | ✅ |

## Permission System

### Venue Access Permissions

Event roles have specialized venue access permissions:

- `venue:access:all` - Full venue access (EXECUTIVE, CORE_AAA)
- `venue:access:restricted` - Restricted areas (AA)
- `venue:access:production` - Production areas (PRODUCTION)
- `venue:access:backstage` - Backstage areas (BACKSTAGE_L1/L2)
- `venue:access:platinum_vip` - Platinum VIP areas
- `venue:access:vip` - VIP areas
- `venue:access:ga` - General admission areas
- `venue:access:crew` - Crew-only areas
- `venue:access:performer` - Performer areas (ENTERTAINER, ARTIST)
- `venue:access:media` - Media areas (MEDIA)

### Special Access Permissions

- `backstage:access` - Backstage access
- `greenroom:access` - Greenroom access (performers)
- `vip:lounge:access` - VIP lounge access
- `priority:entry` - Priority entry (higher tiers)
- `photo:pit:access` - Photo pit access (MEDIA)
- `media:kit:access` - Media kit access (INFLUENCER)

### Business Permissions

- `referral:create` - Create referrals (BRAND_AMBASSADOR, AFFILIATE)
- `commission:view` - View commissions (AFFILIATE)
- `advancing:submit` - Submit advancing requests (COMPVSS roles)
- `advancing:approve` - Approve requests (higher tiers)

## Implementation

### 1. Database Schema

Event roles are added to the `UserRole` enum in Prisma:

```prisma
enum UserRole {
  // ... existing roles ...
  
  // All Platforms Event Roles
  EXECUTIVE
  CORE_AAA
  AA
  PRODUCTION
  MANAGEMENT
  
  // COMPVSS Event Roles
  CREW
  STAFF
  // ... etc
  
  // GVTEWAY Event Roles
  GUEST
  BACKSTAGE_L1
  BACKSTAGE_L2
  // ... etc
}
```

### 2. Middleware Protection

The root middleware checks event roles:

```typescript
// Check platform access using both static role list and event role system
const hasAccess = PLATFORM_ROLES[platform].includes(userRole) || 
                 hasEventRolePlatformAccess(userRole, platform);
```

### 3. Client-Side Guards

`PlatformGuard` component validates event roles:

```typescript
<PlatformGuard platform="GVTEWAY">
  {children}
</PlatformGuard>
```

### 4. Permission Checks

Use `usePermissions` hook for event role permissions:

```typescript
const { hasPermission } = usePermissions();

if (hasPermission('venue:access:backstage')) {
  // Show backstage content
}
```

### 5. Server-Side Validation

Server components and API routes check event roles:

```typescript
const user = await requirePlatformAccess('COMPVSS');
const canAccess = await hasServerPermission(user.id, 'advancing:submit');
```

## Usage Examples

### Example 1: Check Venue Access

```typescript
import { usePermissions } from '@/hooks/auth/usePermissions';

function VenueMap() {
  const { hasPermission } = usePermissions();
  
  return (
    <div>
      {hasPermission('venue:access:backstage') && (
        <BackstageArea />
      )}
      {hasPermission('venue:access:vip') && (
        <VIPArea />
      )}
      {hasPermission('venue:access:ga') && (
        <GeneralAdmissionArea />
      )}
    </div>
  );
}
```

### Example 2: Role Hierarchy Check

```typescript
import { isRoleHigherOrEqual } from '@/lib/rbac/event-roles';

// Check if user's role is higher than required role
if (isRoleHigherOrEqual(userRole, 'VIP_L2')) {
  // Grant access
}
```

### Example 3: Platform Access Check

```typescript
import { hasEventRolePlatformAccess } from '@/lib/rbac/event-roles';

const canAccessCompvss = hasEventRolePlatformAccess(userRole, 'COMPVSS');
```

## API Reference

### Event Role Functions

Located in `/src/lib/rbac/event-roles.ts`:

#### `hasEventRolePlatformAccess(role: string, platform: string): boolean`
Check if role has access to platform.

#### `hasEventRolePermission(role: string, permission: string): boolean`
Check if role has specific permission.

#### `isRoleHigherOrEqual(role1: string, role2: string): boolean`
Compare role hierarchy levels.

#### `getEventRolePermissions(role: string): string[]`
Get all permissions for a role.

#### `isEventRole(role: string): boolean`
Check if role is an event role.

#### `getEventRolePlatformAccess(role: string): string[]`
Get platforms accessible by role.

## Migration

### Database Migration

Run the migration to add event roles:

```bash
npx prisma migrate deploy
```

Migration file: `/prisma/migrations/051_add_event_roles.sql`

### Assigning Event Roles

Event roles can be assigned through:

1. **Admin Interface** - Assign roles to users
2. **Ticket Purchase** - Auto-assign based on ticket type
3. **Event Registration** - Assign during event registration
4. **API** - Programmatically assign roles

## Best Practices

### 1. Use Appropriate Role Granularity

- Use specific event roles instead of broad platform roles when possible
- Leverage programmable levels (VIP_L1, VIP_L2, etc.) for tiered access

### 2. Check Permissions, Not Roles

```typescript
// ❌ Bad
if (user.role === 'VIP_L1' || user.role === 'VIP_L2') {
  // ...
}

// ✅ Good
if (hasPermission('vip:lounge:access')) {
  // ...
}
```

### 3. Validate on Both Client and Server

- Always validate permissions on the server
- Use client-side checks for UX only

### 4. Audit Role Changes

- Log all role assignments and changes
- Track who made the change and when

## Security Considerations

1. **Role Elevation** - Prevent users from elevating their own roles
2. **Cross-Platform Access** - Verify cross-platform roles have legitimate need
3. **Temporary Roles** - Consider time-limited role assignments for events
4. **Role Inheritance** - Higher roles inherit lower role permissions
5. **Audit Logging** - Log all role-based access attempts

## Testing

### Test Event Role Access

```typescript
describe('Event Roles', () => {
  it('should allow BACKSTAGE_L2 to access GVTEWAY', async () => {
    const user = await createUser({ role: 'BACKSTAGE_L2' });
    const hasAccess = hasEventRolePlatformAccess('BACKSTAGE_L2', 'GVTEWAY');
    expect(hasAccess).toBe(true);
  });
  
  it('should grant venue access based on role', () => {
    const permissions = getEventRolePermissions('VIP_L3');
    expect(permissions).toContain('venue:access:vip');
    expect(permissions).toContain('vip:lounge:access');
  });
});
```

## Troubleshooting

### Common Issues

1. **User can't access platform**
   - Verify role is assigned correctly
   - Check if role has platform access
   - Ensure middleware is running

2. **Permission check fails**
   - Verify permission string matches exactly
   - Check if role has the permission
   - Ensure event role system is imported

3. **Role hierarchy not working**
   - Verify role hierarchy levels are defined
   - Check comparison logic
   - Ensure role names match exactly

## Future Enhancements

- **Dynamic Role Creation** - Allow admins to create custom event roles
- **Role Templates** - Pre-defined role templates for common events
- **Time-Limited Roles** - Automatic role expiration after event
- **Role Inheritance** - More sophisticated role inheritance system
- **Role Combinations** - Allow users to have multiple event roles
