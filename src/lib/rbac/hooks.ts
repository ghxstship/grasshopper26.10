/**
 * RBAC React Hooks
 * Client-side hooks for permission and role checking
 */

'use client';

import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { Permission, hasPermission, hasAnyPermission, hasAllPermissions } from './permissions';
import { Role, hasRole, hasAnyRole } from './roles';

/**
 * Hook to get current user's roles
 */
export function useRoles(): Role[] {
  const { data: session } = useSession();
  return (session?.user as { roles?: Role[] })?.roles || [];
}

/**
 * Hook to get current user's permissions
 */
export function usePermissions(): Permission[] {
  const { data: session } = useSession();
  return (session?.user as { permissions?: Permission[] })?.permissions || [];
}

/**
 * Hook to check if user has a specific permission
 */
export function useHasPermission(permission: Permission): boolean {
  const permissions = usePermissions();
  return useMemo(() => hasPermission(permissions, permission), [permissions, permission]);
}

/**
 * Hook to check if user has any of the specified permissions
 */
export function useHasAnyPermission(requiredPermissions: Permission[]): boolean {
  const permissions = usePermissions();
  return useMemo(
    () => hasAnyPermission(permissions, requiredPermissions),
    [permissions, requiredPermissions]
  );
}

/**
 * Hook to check if user has all of the specified permissions
 */
export function useHasAllPermissions(requiredPermissions: Permission[]): boolean {
  const permissions = usePermissions();
  return useMemo(
    () => hasAllPermissions(permissions, requiredPermissions),
    [permissions, requiredPermissions]
  );
}

/**
 * Hook to check if user has a specific role
 */
export function useHasRole(role: Role): boolean {
  const roles = useRoles();
  return useMemo(() => hasRole(roles, role), [roles, role]);
}

/**
 * Hook to check if user has any of the specified roles
 */
export function useHasAnyRole(requiredRoles: Role[]): boolean {
  const roles = useRoles();
  return useMemo(() => hasAnyRole(roles, requiredRoles), [roles, requiredRoles]);
}

/**
 * Hook to check if user is admin (any admin role)
 */
export function useIsAdmin(): boolean {
  const roles = useRoles();
  return useMemo(() => {
    const adminRoles = [
      Role.SUPER_ADMIN,
      Role.SYSTEM_ADMIN,
      Role.ATLVS_ADMIN,
      Role.COMPVSS_ADMIN,
      Role.GVTEWAY_ADMIN,
      Role.ORG_OWNER,
      Role.ORG_ADMIN,
    ];
    return hasAnyRole(roles, adminRoles);
  }, [roles]);
}

/**
 * Hook to check if user is super admin
 */
export function useIsSuperAdmin(): boolean {
  return useHasRole(Role.SUPER_ADMIN);
}

/**
 * Hook to get user's platform-specific role
 */
export function usePlatformRole(platform: 'atlvs' | 'compvss' | 'gvteway'): Role | null {
  const roles = useRoles();
  
  return useMemo(() => {
    const platformPrefix = `${platform}:`;
    const platformRole = roles.find((role) => role.startsWith(platformPrefix));
    return platformRole || null;
  }, [roles, platform]);
}

/**
 * Hook for conditional rendering based on permissions
 */
export function useCanAccess(permission: Permission): {
  canAccess: boolean;
  isLoading: boolean;
} {
  const { status } = useSession();
  const hasAccess = useHasPermission(permission);

  return {
    canAccess: hasAccess,
    isLoading: status === 'loading',
  };
}

/**
 * Hook for conditional rendering based on roles
 */
export function useCanAccessWithRole(role: Role): {
  canAccess: boolean;
  isLoading: boolean;
} {
  const { status } = useSession();
  const hasAccess = useHasRole(role);

  return {
    canAccess: hasAccess,
    isLoading: status === 'loading',
  };
}
