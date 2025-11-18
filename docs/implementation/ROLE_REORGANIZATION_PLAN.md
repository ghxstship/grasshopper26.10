# Role Reorganization & Multi-Level Navigation Implementation Plan

## Executive Summary

Complete reorganization of the role system to align digital app access with on-site roles and responsibilities, plus implementation of a multi-level breadcrumb navigation system inspired by Supabase's context switching.

**Key Changes:**
- 26 distinct roles across 3 apps + Legend tier (ATLVS: 6, GVTEWAY: 6, COMPVSS: 8, LEGEND: 6)
- ATLVS users gain cross-app dashboard access
- GVTEWAY and COMPVSS users are app-locked
- Legend roles for development/support with god-mode capabilities
- 4-level breadcrumb navigation: Organization → App → Project → Workspace

---

## New Role Structure

### Legend Roles (6 roles) - God Mode / Development & Support

| Role | Access Level | Email Requirement | Description |
|------|--------------|-------------------|-------------|
| `LEGEND_SUPER_ADMIN` | God Mode | @ghxstship.pro | Absolute platform control, all permissions |
| `LEGEND_ADMIN` | Platform-wide | @ghxstship.pro | Internal product management |
| `LEGEND_DEVELOPER` | Platform-wide | @ghxstship.pro | Internal product team, full repo access |
| `LEGEND_COLLABORATOR` | Platform-wide | @ghxstship.pro | External scoped full repo access |
| `LEGEND_SUPPORT` | Platform-wide | @ghxstship.pro | Tech support, can impersonate users (requires permission) |
| `LEGEND_INCOGNITO` | Platform-wide | @ghxstship.pro | Can impersonate any user (no permission required) |

**Key Features:**
- Accessible only via ATLVS with @ghxstship.pro email address
- Cross-app access to all 3 applications
- User impersonation capabilities for support roles
- Full system access for development and debugging
- Bypasses all standard permission checks

**Security Requirements:**
- Email domain validation (@ghxstship.pro)
- Audit logging for all Legend role actions
- Impersonation tracking and session logging
- Two-factor authentication required
- IP whitelist for Legend role access

---

### ATLVS Roles (6 roles) - Cross-App Access Enabled

| Role | Access Level | Cross-App | Description |
|------|--------------|-----------|-------------|
| `ATLVS_SUPER_ADMIN` | Organization-wide | ✅ GVTEWAY + COMPVSS | Full platform control |
| `ATLVS_ADMIN` | Organization-wide | ✅ GVTEWAY + COMPVSS | Organization administration |
| `ATLVS_MANAGER` | Organization-wide | ✅ GVTEWAY + COMPVSS | Project & team management |
| `ATLVS_TEAM_MEMBER` | Organization-wide | ✅ GVTEWAY + COMPVSS | Standard team operations |
| `ATLVS_COLLABORATOR` | Project-scoped | ✅ GVTEWAY + COMPVSS | Limited to specific projects |
| `ATLVS_GUEST` | Temporary-scoped | ✅ GVTEWAY + COMPVSS | Time-limited access |

**Key Feature:** All ATLVS roles can toggle between ATLVS, GVTEWAY, and COMPVSS dashboards via breadcrumb navigation.

### GVTEWAY Roles (6 roles) - App-Locked

| Role | Category | Access Level | Description |
|------|----------|--------------|-------------|
| `GVTEWAY_ARTIST` | Talent | GVTEWAY only | Artist profile & content |
| `GVTEWAY_ARTIST_MANAGER` | Talent | GVTEWAY only | Manages artist accounts |
| `GVTEWAY_ARTIST_GUEST` | Talent | GVTEWAY only | Limited artist collaboration |
| `GVTEWAY_ARTIST_MEDIA` | Talent | GVTEWAY only | Media/press access |
| `GVTEWAY_BRAND_AMBASSADOR` | Patron | GVTEWAY only | Brand promotion features |
| `GVTEWAY_AFFILIATE` | Patron | GVTEWAY only | Affiliate marketing access |

**Key Feature:** GVTEWAY users cannot access ATLVS or COMPVSS apps.

### COMPVSS Roles (8 roles) - App-Locked

| Role | Tier | Access Level | Description |
|------|------|--------------|-------------|
| `COMPVSS_MANAGEMENT` | AAA | Build + Strike + Day of Show | Full project management |
| `COMPVSS_PRODUCTION` | AA | Build + Strike + Day of Show | Production coordination |
| `COMPVSS_CREW` | A | Build + Strike + Day of Show | Crew operations |
| `COMPVSS_STAFF` | B | Day of Show only | Event day staff |
| `COMPVSS_ARTIST` | Special | Project-scoped | Performing artist access |
| `COMPVSS_MEDIA` | Special | Project-scoped | Media/photography access |
| `COMPVSS_SPONSOR` | Special | Project-scoped | Sponsor portal access |
| `COMPVSS_VENDOR` | Special | Project-scoped | Vendor coordination |

**Key Feature:** COMPVSS users cannot access ATLVS or GVTEWAY apps.

---

## Multi-Level Breadcrumb Navigation System

### Hierarchy Structure

```
Organization → App → Project → Workspace (Team)
     ↓          ↓        ↓           ↓
  GHXSTSSHIP  ATLVS   Event-001   Production
```

### Breadcrumb Levels

#### Level 1: Organization Selector
- Search/filter organizations
- "All Organizations" view option
- "+ New organization" (admin only)
- Example: `GHXSTSSHIP ▼`

#### Level 2: App Selector
- ATLVS roles: Can toggle all 3 apps
- GVTEWAY roles: GVTEWAY only (no dropdown)
- COMPVSS roles: COMPVSS only (no dropdown)
- Example: `ATLVS ▼` or `GVTEWAY` (no dropdown)

#### Level 3: Project Selector
- Search/filter projects
- Recent projects
- Project status badges (Active, Archived, Draft)
- "+ New project" (manager+ only)
- Example: `grasshopper26.00 ▼`

#### Level 4: Workspace Selector
- Team/workspace name
- Environment badge (Production, Staging, Development)
- Team member count indicator
- Example: `main [Production] ▼`

---

## Implementation Phases

### Phase 1: Role System Architecture
- Design unified role enum with 20 roles
- Create role metadata structure
- Define role hierarchy

### Phase 2: Access Control Design
- Define cross-app access rules
- Create access validation logic
- Map scoped access levels

### Phase 3: Permission Matrix
- Map ATLVS permissions (6 roles × permissions)
- Map GVTEWAY permissions (6 roles × permissions)
- Map COMPVSS permissions (8 roles × permissions)

### Phase 4: Context Hierarchy Model
- Design Organization → App → Project → Workspace data model
- Create database schema for context hierarchy
- Define user-context relationships

### Phase 5: Breadcrumb Navigation System
- Design 4-level breadcrumb component architecture
- Create selector components (Org, App, Project, Workspace)
- Implement search/filter functionality

### Phase 6: Database Schema Updates
- Update Prisma schema with new UserRole enum
- Create Organization, Project, Workspace models
- Create *Member junction tables
- Create UserContext model for active context tracking

### Phase 7: RBAC System Refactor
- Update roles.ts with new role definitions
- Update permissions.ts with app-scoped permissions
- Create app-access helper functions

### Phase 8: Context Management Service
- Create ContextService for context switching
- Implement validation logic
- Handle context persistence

### Phase 9: Session & Auth Updates
- Extend session type with context info
- Update session callbacks
- Add context to JWT

### Phase 10: Breadcrumb Component Implementation
- Build ContextBreadcrumb component
- Create OrgSelector, AppSelector, ProjectSelector, WorkspaceSelector
- Implement dropdown search/filter

### Phase 11: Layout Integration
- Integrate breadcrumb into AtlvsLayout
- Integrate breadcrumb into GvtewayLayout
- Integrate breadcrumb into CompvssLayout

### Phase 12: Migration Strategy
- Create role migration mapping
- Build data migration scripts
- Create default organization/projects

### Phase 13: Route Protection
- Update middleware with new role checks
- Add context validation to routes
- Implement app-access guards

### Phase 14: UI Role Adaptation
- Update all components with new role checks
- Implement context-aware rendering
- Update navigation based on roles

### Phase 15: Testing & Documentation
- Create unit tests for role system
- Create integration tests for context switching
- Write user documentation
- Create admin guide for role management

---

## Key Technical Files

### Database Schema
- `prisma/schema.prisma` - UserRole enum, context models

### RBAC System
- `src/lib/rbac/roles.ts` - Role definitions & hierarchy
- `src/lib/rbac/permissions.ts` - Permission mappings
- `src/lib/rbac/app-access.ts` - Cross-app access logic

### Services
- `src/lib/services/shared/ContextService.ts` - Context management
- `src/lib/services/shared/PermissionService.ts` - Permission checking

### Components
- `src/components/navigation/ContextBreadcrumb.tsx` - Main breadcrumb
- `src/components/navigation/OrgSelector.tsx` - Organization dropdown
- `src/components/navigation/AppSelector.tsx` - App switcher
- `src/components/navigation/ProjectSelector.tsx` - Project dropdown
- `src/components/navigation/WorkspaceSelector.tsx` - Workspace dropdown

### Auth
- `src/app/api/auth/[...nextauth]/route.ts` - Session with context
- `src/lib/auth.ts` - Auth helpers with role checks
- `src/types/next-auth.d.ts` - Extended session type

### Middleware
- `src/middleware.ts` - Route protection with context validation

---

## Migration Strategy

### Old Role → New Role Mapping

```typescript
const roleMigrationMap = {
  'CONSUMER': 'GVTEWAY_ARTIST',
  'EXTERNAL_TEAM': 'COMPVSS_CREW',
  'INTERNAL_TEAM': 'ATLVS_TEAM_MEMBER',
  'ADMIN': 'ATLVS_SUPER_ADMIN',
};
```

### Migration Steps

1. Create default organization for existing users
2. Map existing roles to new roles
3. Create default projects per app
4. Assign users to appropriate projects
5. Initialize UserContext for each user
6. Set active context based on role

---

## Access Control Rules

### Cross-App Access Matrix

| User Role | ATLVS | GVTEWAY | COMPVSS | Special Access |
|-----------|-------|---------|---------|----------------|
| LEGEND_* | ✅ Full | ✅ Full | ✅ Full | God Mode + Impersonation |
| ATLVS_* | ✅ Primary | ✅ Toggle | ✅ Toggle | - |
| GVTEWAY_* | ❌ | ✅ Primary | ❌ | - |
| COMPVSS_* | ❌ | ❌ | ✅ Primary | - |

### Scoped Access Rules

- **God Mode:** LEGEND_SUPER_ADMIN, LEGEND_ADMIN, LEGEND_DEVELOPER, LEGEND_COLLABORATOR, LEGEND_SUPPORT, LEGEND_INCOGNITO
- **Org-wide:** ATLVS_SUPER_ADMIN, ATLVS_ADMIN, ATLVS_MANAGER, ATLVS_TEAM_MEMBER
- **Project-scoped:** ATLVS_COLLABORATOR, COMPVSS_ARTIST, COMPVSS_MEDIA, COMPVSS_SPONSOR, COMPVSS_VENDOR
- **Temporary-scoped:** ATLVS_GUEST, GVTEWAY_ARTIST_GUEST

### Legend Role Special Capabilities

- **Email Validation:** All Legend roles require @ghxstship.pro email domain
- **Impersonation:**
  - `LEGEND_SUPPORT`: Can impersonate users with permission approval
  - `LEGEND_INCOGNITO`: Can impersonate any user without permission
- **Audit Logging:** All Legend role actions are logged with full audit trail
- **Access via ATLVS:** Legend roles only accessible through ATLVS interface
- **Bypass Permissions:** Legend roles bypass all standard permission checks
- **Development Access:** Full repository and codebase access for debugging

---

## Breadcrumb Behavior Rules

### Rule 1: App Selector Visibility
- Legend roles: Show dropdown with all 3 apps + god mode indicator
- ATLVS roles: Show dropdown with all 3 apps
- GVTEWAY roles: Show "GVTEWAY" text only (no dropdown)
- COMPVSS roles: Show "COMPVSS" text only (no dropdown)

### Rule 2: Context Persistence
- Store active context in session
- Persist to database on change
- Restore last context on login

### Rule 3: Context Validation
- Validate user has access to selected context
- Redirect to default if invalid
- Show error toast if access denied

### Rule 4: Context Switching
- Preserve project/workspace when switching apps (if accessible)
- Reset to org-level view if project not accessible in new app
- Update URL to reflect new context

---

## Success Criteria

- ✅ All 26 roles defined and stored in database (20 standard + 6 Legend)
- ✅ Legend roles restricted to @ghxstship.pro email domain
- ✅ User impersonation working for LEGEND_SUPPORT and LEGEND_INCOGNITO
- ✅ Audit logging active for all Legend role actions
- ✅ ATLVS users can toggle between all 3 apps
- ✅ GVTEWAY/COMPVSS users are app-locked
- ✅ 4-level breadcrumb navigation functional
- ✅ Context persists across sessions
- ✅ All existing users migrated to new roles
- ✅ Permissions enforced at all levels
- ✅ Legend roles bypass standard permissions
- ✅ UI adapts to role and context
- ✅ God mode indicator visible for Legend roles
- ✅ Documentation complete
- ✅ All tests passing

---

## Timeline Estimate

- **Phase 1-3:** 2 days (Architecture & Design)
- **Phase 4-6:** 3 days (Database & Schema)
- **Phase 7-9:** 3 days (RBAC & Auth)
- **Phase 10-11:** 4 days (UI Components)
- **Phase 12-13:** 2 days (Migration & Protection)
- **Phase 14-15:** 3 days (Adaptation & Testing)

**Total:** ~17 days

---

## Risk Mitigation

- **Data Loss:** Full database backup before migration
- **Access Issues:** Rollback plan with old role system
- **Performance:** Index all foreign keys, cache context lookups
- **User Confusion:** In-app tutorials for new navigation
- **Breaking Changes:** Feature flag for gradual rollout
