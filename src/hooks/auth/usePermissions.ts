/**
 * Permissions Hook
 * Checks user permissions and roles
 */

import { useUser } from './useUser';
import { useMemo } from 'react';

export type Permission =
  | 'events:create'
  | 'events:edit'
  | 'events:delete'
  | 'tickets:manage'
  | 'orders:view'
  | 'orders:refund'
  | 'advancing:submit'
  | 'advancing:approve'
  | 'projects:create'
  | 'projects:edit'
  | 'tasks:assign'
  | 'budgets:manage'
  | 'users:manage';

export type Role = 'CONSUMER' | 'EXTERNAL_TEAM' | 'INTERNAL_TEAM' | 'ADMIN';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
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
  ADMIN: [
    'events:create',
    'events:edit',
    'events:delete',
    'tickets:manage',
    'orders:view',
    'orders:refund',
    'advancing:submit',
    'advancing:approve',
    'projects:create',
    'projects:edit',
    'tasks:assign',
    'budgets:manage',
    'users:manage',
  ],
};

export function usePermissions() {
  const { user } = useUser();

  const permissions = useMemo(() => {
    if (!user) return [];
    return ROLE_PERMISSIONS[user.role as Role] || [];
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

  return {
    permissions,
    hasPermission,
    hasRole,
    hasAnyRole,
    can,
  };
}
