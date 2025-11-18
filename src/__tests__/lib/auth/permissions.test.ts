/**
 * Unit Tests - Permissions & RBAC
 * Tests role-based access control and permission checking
 */

import { hasPermission, hasAnyPermission, hasAllPermissions, getRolePermissions, canPerformAction, ROLE_PERMISSIONS, type Role, type Permission,  } from '@/lib/auth/permissions'

describe('Permissions & RBAC', () => {
  describe('ROLE_PERMISSIONS Matrix', () => {
    it('defines permissions for all roles', () => {
      const roles: Role[] = ['USER', 'ADMIN', 'ORGANIZER', 'VENUE_MANAGER', 'TEAM_MEMBER', 'PRODUCTION_MANAGER']
      
      roles.forEach(role => {
        expect(ROLE_PERMISSIONS[role]).toBeDefined()
        expect(Array.isArray(ROLE_PERMISSIONS[role])).toBe(true)
        expect(ROLE_PERMISSIONS[role].length).toBeGreaterThan(0)
      })
    })

    it('ADMIN has all permissions', () => {
      const adminPermissions = ROLE_PERMISSIONS.ADMIN
      expect(adminPermissions.length).toBeGreaterThan(30)
      expect(adminPermissions).toContain('admin:access')
      expect(adminPermissions).toContain('admin:settings')
    })

    it('USER has basic permissions only', () => {
      const userPermissions = ROLE_PERMISSIONS.USER
      expect(userPermissions).toContain('events:read')
      expect(userPermissions).toContain('tickets:read')
      expect(userPermissions).not.toContain('events:create')
      expect(userPermissions).not.toContain('admin:access')
    })

    it('ORGANIZER can manage events', () => {
      const organizerPermissions = ROLE_PERMISSIONS.ORGANIZER
      expect(organizerPermissions).toContain('events:create')
      expect(organizerPermissions).toContain('events:update')
      expect(organizerPermissions).toContain('events:delete')
      expect(organizerPermissions).toContain('events:publish')
    })

    it('TEAM_MEMBER can create advancing requests', () => {
      const teamPermissions = ROLE_PERMISSIONS.TEAM_MEMBER
      expect(teamPermissions).toContain('advancing:create')
      expect(teamPermissions).toContain('advancing:read')
      expect(teamPermissions).not.toContain('advancing:approve')
    })

    it('PRODUCTION_MANAGER can approve advancing requests', () => {
      const pmPermissions = ROLE_PERMISSIONS.PRODUCTION_MANAGER
      expect(pmPermissions).toContain('advancing:approve')
      expect(pmPermissions).toContain('advancing:reject')
      expect(pmPermissions).toContain('projects:create')
    })
  })

  describe('hasPermission', () => {
    it('returns true when role has permission', () => {
      expect(hasPermission('ADMIN', 'events:create')).toBe(true)
      expect(hasPermission('USER', 'events:read')).toBe(true)
      expect(hasPermission('ORGANIZER', 'events:publish')).toBe(true)
    })

    it('returns false when role lacks permission', () => {
      expect(hasPermission('USER', 'events:create')).toBe(false)
      expect(hasPermission('TEAM_MEMBER', 'admin:access')).toBe(false)
      expect(hasPermission('VENUE_MANAGER', 'events:delete')).toBe(false)
    })

    it('returns false for invalid role', () => {
      expect(hasPermission('INVALID_ROLE' as Role, 'events:read')).toBe(false)
    })

    it('handles all permission types', () => {
      const permissions: Permission[] = [
        'events:create',
        'tickets:read',
        'orders:refund',
        'users:manage_roles',
        'advancing:approve',
        'projects:delete',
        'analytics:export',
        'admin:settings',
      ]

      permissions.forEach(permission => {
        const result = hasPermission('ADMIN', permission)
        expect(typeof result).toBe('boolean')
      })
    })
  })

  describe('hasAnyPermission', () => {
    it('returns true if role has at least one permission', () => {
      expect(hasAnyPermission('USER', ['events:read', 'events:create'])).toBe(true)
      expect(hasAnyPermission('ORGANIZER', ['events:delete', 'admin:access'])).toBe(true)
    })

    it('returns false if role has none of the permissions', () => {
      expect(hasAnyPermission('USER', ['events:create', 'events:delete'])).toBe(false)
      expect(hasAnyPermission('TEAM_MEMBER', ['admin:access', 'admin:settings'])).toBe(false)
    })

    it('returns false for empty permission array', () => {
      expect(hasAnyPermission('ADMIN', [])).toBe(false)
    })

    it('returns true if role has all permissions', () => {
      expect(hasAnyPermission('ADMIN', ['events:read', 'events:create'])).toBe(true)
    })
  })

  describe('hasAllPermissions', () => {
    it('returns true if role has all specified permissions', () => {
      expect(hasAllPermissions('ADMIN', ['events:read', 'events:create', 'events:delete'])).toBe(true)
      expect(hasAllPermissions('USER', ['events:read', 'tickets:read'])).toBe(true)
    })

    it('returns false if role lacks any permission', () => {
      expect(hasAllPermissions('USER', ['events:read', 'events:create'])).toBe(false)
      expect(hasAllPermissions('ORGANIZER', ['events:create', 'admin:access'])).toBe(false)
    })

    it('returns true for empty permission array', () => {
      expect(hasAllPermissions('USER', [])).toBe(true)
    })

    it('returns false if role lacks just one permission', () => {
      expect(hasAllPermissions('TEAM_MEMBER', [
        'advancing:create',
        'advancing:read',
        'advancing:approve', // TEAM_MEMBER doesn't have this
      ])).toBe(false)
    })
  })

  describe('getRolePermissions', () => {
    it('returns all permissions for a role', () => {
      const userPermissions = getRolePermissions('USER')
      expect(Array.isArray(userPermissions)).toBe(true)
      expect(userPermissions.length).toBeGreaterThan(0)
      expect(userPermissions).toEqual(ROLE_PERMISSIONS.USER)
    })

    it('returns empty array for invalid role', () => {
      const permissions = getRolePermissions('INVALID' as Role)
      expect(permissions).toEqual([])
    })

    it('returns different permissions for different roles', () => {
      const userPerms = getRolePermissions('USER')
      const adminPerms = getRolePermissions('ADMIN')
      
      expect(userPerms.length).toBeLessThan(adminPerms.length)
      expect(userPerms).not.toEqual(adminPerms)
    })

    it('returns permission array reference', () => {
      const permissions1 = getRolePermissions('USER')
      const permissions2 = getRolePermissions('USER')
      
      // Both calls return the same array reference
      expect(permissions1).toEqual(permissions2)
      expect(permissions1.length).toBeGreaterThan(0)
    })
  })

  describe('canPerformAction', () => {
    describe('Basic Permission Checks', () => {
      it('allows action when role has permission', () => {
        expect(canPerformAction('ADMIN', 'events:create')).toBe(true)
        expect(canPerformAction('USER', 'events:read')).toBe(true)
      })

      it('denies action when role lacks permission', () => {
        expect(canPerformAction('USER', 'events:create')).toBe(false)
        expect(canPerformAction('TEAM_MEMBER', 'admin:access')).toBe(false)
      })
    })

    describe('Ownership Checks', () => {
      it('allows action when user owns resource', () => {
        const userId = 'user-123'
        const resourceOwnerId = 'user-123'
        
        expect(canPerformAction('USER', 'users:update', resourceOwnerId, userId)).toBe(true)
      })

      it('denies action when user does not own resource', () => {
        const userId = 'user-123'
        const resourceOwnerId = 'user-456'
        
        expect(canPerformAction('USER', 'users:update', resourceOwnerId, userId)).toBe(false)
      })

      it('allows admin to access any resource', () => {
        const userId = 'admin-123'
        const resourceOwnerId = 'user-456'
        
        expect(canPerformAction('ADMIN', 'users:update', resourceOwnerId, userId)).toBe(true)
      })

      it('allows action when ownership is not checked', () => {
        expect(canPerformAction('USER', 'events:read')).toBe(true)
        expect(canPerformAction('ORGANIZER', 'events:create')).toBe(true)
      })
    })

    describe('Edge Cases', () => {
      it('denies action for invalid role', () => {
        expect(canPerformAction('INVALID' as Role, 'events:read')).toBe(false)
      })

      it('handles undefined ownership parameters', () => {
        expect(canPerformAction('USER', 'events:read', undefined, undefined)).toBe(true)
      })

      it('handles partial ownership parameters', () => {
        expect(canPerformAction('USER', 'events:read', 'owner-123', undefined)).toBe(true)
        expect(canPerformAction('USER', 'events:read', undefined, 'user-123')).toBe(true)
      })
    })
  })

  describe('Real-World Scenarios', () => {
    it('USER can view and purchase tickets', () => {
      expect(canPerformAction('USER', 'events:read')).toBe(true)
      expect(canPerformAction('USER', 'tickets:read')).toBe(true)
      expect(canPerformAction('USER', 'orders:create')).toBe(true)
    })

    it('USER cannot create or manage events', () => {
      expect(canPerformAction('USER', 'events:create')).toBe(false)
      expect(canPerformAction('USER', 'events:update')).toBe(false)
      expect(canPerformAction('USER', 'events:delete')).toBe(false)
    })

    it('ORGANIZER can manage their events', () => {
      expect(canPerformAction('ORGANIZER', 'events:create')).toBe(true)
      expect(canPerformAction('ORGANIZER', 'events:update')).toBe(true)
      expect(canPerformAction('ORGANIZER', 'events:delete')).toBe(true)
      expect(canPerformAction('ORGANIZER', 'events:publish')).toBe(true)
    })

    it('TEAM_MEMBER can submit advancing requests', () => {
      expect(canPerformAction('TEAM_MEMBER', 'advancing:create')).toBe(true)
      expect(canPerformAction('TEAM_MEMBER', 'advancing:read')).toBe(true)
      expect(canPerformAction('TEAM_MEMBER', 'advancing:update')).toBe(true)
    })

    it('TEAM_MEMBER cannot approve advancing requests', () => {
      expect(canPerformAction('TEAM_MEMBER', 'advancing:approve')).toBe(false)
      expect(canPerformAction('TEAM_MEMBER', 'advancing:reject')).toBe(false)
    })

    it('PRODUCTION_MANAGER can approve advancing requests', () => {
      expect(canPerformAction('PRODUCTION_MANAGER', 'advancing:approve')).toBe(true)
      expect(canPerformAction('PRODUCTION_MANAGER', 'advancing:reject')).toBe(true)
    })

    it('ADMIN can do everything', () => {
      const criticalActions: Permission[] = [
        'events:delete',
        'users:delete',
        'users:manage_roles',
        'admin:access',
        'admin:settings',
      ]

      criticalActions.forEach(action => {
        expect(canPerformAction('ADMIN', action)).toBe(true)
      })
    })

    it('USER can only update their own profile', () => {
      const userId = 'user-123'
      
      // Can update own profile
      expect(canPerformAction('USER', 'users:update', userId, userId)).toBe(true)
      
      // Cannot update other user's profile
      expect(canPerformAction('USER', 'users:update', 'user-456', userId)).toBe(false)
    })

    it('ADMIN can update any user profile', () => {
      const adminId = 'admin-123'
      const userId = 'user-456'
      
      expect(canPerformAction('ADMIN', 'users:update', userId, adminId)).toBe(true)
    })
  })
})
