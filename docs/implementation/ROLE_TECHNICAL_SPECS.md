# Role Reorganization - Technical Specifications

Complete technical specifications for implementing the role reorganization and multi-level navigation system.

## Database Schema Changes

See `ROLE_DATABASE_SCHEMA.md` for complete Prisma schema definitions including:
- New UserRole enum (26 roles: 20 standard + 6 Legend)
- Legend roles for god-mode development and support access
- Organization, Project, Workspace models
- OrganizationMember, ProjectMember, WorkspaceMember junction tables
- UserContext model for active context tracking
- ImpersonationSession model for tracking user impersonation
- AuditLog model for Legend role action tracking
- All necessary indexes and relationships

## RBAC System Files

### Core Files to Create/Update

1. **`src/lib/rbac/roles.ts`** - Role enum, hierarchy, metadata
2. **`src/lib/rbac/permissions.ts`** - Permission enum, role-permission mappings
3. **`src/lib/rbac/app-access.ts`** - Cross-app access logic
4. **`src/lib/rbac/utils.ts`** - Helper functions for role checking

### Services to Create/Update

1. **`src/lib/services/shared/ContextService.ts`** - Context switching logic
2. **`src/lib/services/shared/PermissionService.ts`** - Update for new roles
3. **`src/lib/services/shared/OrganizationService.ts`** - Organization management
4. **`src/lib/services/shared/ProjectService.ts`** - Project management
5. **`src/lib/services/shared/ImpersonationService.ts`** - User impersonation for Legend roles
6. **`src/lib/services/shared/AuditLogService.ts`** - Audit logging for Legend actions

## Component Architecture

### Navigation Components

1. **`src/components/navigation/ContextBreadcrumb.tsx`** - Main breadcrumb container
2. **`src/components/navigation/OrgSelector.tsx`** - Organization dropdown
3. **`src/components/navigation/AppSelector.tsx`** - App switcher (ATLVS only)
4. **`src/components/navigation/ProjectSelector.tsx`** - Project dropdown
5. **`src/components/navigation/WorkspaceSelector.tsx`** - Workspace dropdown

### Component Features

- Search/filter functionality
- Recent items tracking
- Keyboard navigation
- Loading states
- Error handling
- Responsive design

## Auth & Session Updates

### Session Type Extensions

Update `src/types/next-auth.d.ts` to include:
- Active context (org, app, project, workspace)
- Allowed apps array
- Cross-app access flag
- Role metadata

### Auth Callbacks

Update `src/app/api/auth/[...nextauth]/route.ts`:
- Fetch user context on session creation
- Include context in session object
- Calculate allowed apps based on role

## Migration Strategy

### Phase 1: Schema Migration
1. Run Prisma migration to add new models
2. Create default organization
3. Migrate existing user roles
4. Create organization memberships
5. Initialize user contexts

### Phase 2: Code Migration
1. Update all role checks to use new enum
2. Replace permission checks with new system
3. Update UI components for role-based rendering
4. Add context validation to routes

### Phase 3: Testing
1. Unit tests for role/permission logic
2. Integration tests for context switching
3. E2E tests for navigation flows
4. Performance testing for context queries

## API Endpoints

### Context Management APIs

- `POST /api/context/switch-org` - Switch organization
- `POST /api/context/switch-app` - Switch app (ATLVS only)
- `POST /api/context/switch-project` - Switch project
- `POST /api/context/switch-workspace` - Switch workspace
- `GET /api/context/available-orgs` - Get available organizations
- `GET /api/context/available-projects` - Get available projects
- `GET /api/context/available-workspaces` - Get available workspaces

### Legend Role APIs

- `POST /api/legend/impersonate` - Start user impersonation (LEGEND_SUPPORT, LEGEND_INCOGNITO)
- `POST /api/legend/end-impersonation` - End user impersonation
- `GET /api/legend/impersonation-sessions` - Get active impersonation sessions
- `POST /api/legend/request-permission` - Request impersonation permission (LEGEND_SUPPORT)
- `GET /api/legend/audit-logs` - Get audit logs for Legend actions
- `POST /api/legend/validate-email` - Validate @ghxstship.pro email domain

## Performance Considerations

### Database Indexes
- Index on userId + organizationId
- Index on userId + projectId
- Index on userId + workspaceId
- Index on organizationId + app
- Index on projectId + environment

### Caching Strategy
- Cache user context in session
- Cache organization/project lists
- Invalidate on context switch
- Use React Query for client-side caching

## Security Considerations

### Access Validation
- Validate org membership before switching
- Validate project access before switching
- Validate workspace access before switching
- Check role permissions for all operations
- Validate cross-app access based on role
- Validate @ghxstship.pro email domain for Legend roles
- Verify impersonation permissions for LEGEND_SUPPORT

### Route Protection
- Middleware to check context validity
- App-level guards for GVTEWAY/COMPVSS users
- Project-scoped access for COLLABORATOR roles
- Time-based access for GUEST roles
- Email domain validation for Legend role access
- Two-factor authentication for Legend roles

### Legend Role Security
- Email domain whitelist (@ghxstship.pro only)
- Audit logging for all Legend actions
- Impersonation session tracking
- Permission approval workflow for LEGEND_SUPPORT
- IP whitelist for Legend role access (optional)
- Rate limiting on impersonation attempts
- Automatic session expiry for impersonation

## Testing Checklist

- [ ] All 26 roles defined in database (20 standard + 6 Legend)
- [ ] Legend roles restricted to @ghxstship.pro email
- [ ] User impersonation working for LEGEND_SUPPORT and LEGEND_INCOGNITO
- [ ] Audit logging active for Legend actions
- [ ] Permission approval workflow for LEGEND_SUPPORT
- [ ] Role hierarchy working correctly
- [ ] Permission checks functioning
- [ ] Legend roles bypass standard permissions
- [ ] Cross-app access enforced
- [ ] Context switching works
- [ ] Breadcrumb navigation functional
- [ ] God mode indicator visible for Legend roles
- [ ] Search/filter working
- [ ] Recent items tracking
- [ ] Session persistence
- [ ] Route protection active
- [ ] Migration script tested
- [ ] Performance acceptable
- [ ] All tests passing
- [ ] Documentation complete

## Rollout Plan

1. **Week 1:** Database schema + migration
2. **Week 2:** RBAC system + services
3. **Week 3:** Components + navigation
4. **Week 4:** Testing + bug fixes
5. **Week 5:** Documentation + deployment

## Success Metrics

- All users successfully migrated
- Zero data loss during migration
- Context switching < 200ms
- No unauthorized access incidents
- User satisfaction with new navigation
- Reduced support tickets for access issues
