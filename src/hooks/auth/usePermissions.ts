/**
 * Permissions Hook
 * Checks user permissions and roles including event roles
 */

import { useUser } from './useUser';
import { useMemo } from 'react';
import { getEventRolePermissions, isEventRole } from '@/lib/rbac/event-roles';

export type Permission =
  | 'events:create'
  | 'events:edit'
  | 'events:delete'
  | 'events:view'
  | 'tickets:manage'
  | 'orders:view'
  | 'orders:view:own'
  | 'orders:view:clients'
  | 'orders:refund'
  | 'advancing:submit'
  | 'advancing:approve'
  | 'projects:create'
  | 'projects:edit'
  | 'projects:view'
  | 'tasks:assign'
  | 'tasks:view'
  | 'budgets:manage'
  | 'budgets:view'
  | 'users:manage'
  | 'venue:access:all'
  | 'venue:access:restricted'
  | 'venue:access:production'
  | 'venue:access:management'
  | 'venue:access:crew'
  | 'venue:access:staff'
  | 'venue:access:vendor'
  | 'venue:access:performer'
  | 'venue:access:agent'
  | 'venue:access:media'
  | 'venue:access:sponsor'
  | 'venue:access:partner'
  | 'venue:access:industry'
  | 'venue:access:intern'
  | 'venue:access:volunteer'
  | 'venue:access:backstage'
  | 'venue:access:platinum_vip'
  | 'venue:access:vip'
  | 'venue:access:ga'
  | 'venue:access:guest'
  | 'venue:access:influencer'
  | 'venue:access:brand_ambassador'
  | 'venue:access:affiliate'
  | 'backstage:access'
  | 'greenroom:access'
  | 'vip:lounge:access'
  | 'priority:entry'
  | 'photo:pit:access'
  | 'media:kit:access'
  | 'referral:create'
  | 'commission:view';

export type Role = 'CONSUMER' | 'EXTERNAL_TEAM' | 'INTERNAL_TEAM' | 'ADMIN';

const ROLE_PERMISSIONS: Record<string, string[]> = {
  CONSUMER: ['orders:view', 'events:view'],
  EXTERNAL_TEAM: ['advancing:submit', 'orders:view', 'events:view'],
  INTERNAL_TEAM: [
    'events:create',
    'events:edit',
    'events:view',
    'tickets:manage',
    'orders:view',
    'orders:refund',
    'advancing:approve',
    'projects:create',
    'projects:edit',
    'projects:view',
    'tasks:assign',
    'tasks:view',
    'budgets:manage',
  ],
  ADMIN: [
    'events:create',
    'events:edit',
    'events:delete',
    'events:view',
    'tickets:manage',
    'orders:view',
    'orders:refund',
    'advancing:submit',
    'advancing:approve',
    'projects:create',
    'projects:edit',
    'projects:view',
    'tasks:assign',
    'tasks:view',
    'budgets:manage',
    'users:manage',
  ],
};

export function usePermissions() {
  const { user } = useUser();

  const permissions = useMemo(() => {
    if (!user) return [];
    
    const userRole = user.role as string;
    
    // Check if it's an event role
    if (isEventRole(userRole)) {
      return getEventRolePermissions(userRole);
    }
    
    // Fall back to standard role permissions
    return ROLE_PERMISSIONS[userRole] || [];
  }, [user]);

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  const hasRole = (role: Role): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: Role[]): boolean => {
    return roles.some((role) => user?.role === role);
  };

  const can = (permission: Permission): boolean => {
    return hasPermission(permission);
  };

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every((perm) =>
      permissions.includes(perm as Permission)
    );
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some((perm) =>
      permissions.includes(perm as Permission)
    );
  };

  return {
    permissions,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
    can,
  };
}
