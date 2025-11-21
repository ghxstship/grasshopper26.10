/**
 * Permission Guard Component
 * Checks if user has specific permissions
 */

'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { usePermissions, type Permission } from '@/hooks/auth/usePermissions';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: Permission;
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  permission,
  fallback = null,
}: PermissionGuardProps) {
  const { data: session } = useSession();
  const { hasPermission } = usePermissions();

  if (!session?.user) {
    return <>{fallback}</>;
  }

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface MultiPermissionGuardProps {
  children: React.ReactNode;
  permissions: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export function MultiPermissionGuard({
  children,
  permissions,
  requireAll = false,
  fallback = null,
}: MultiPermissionGuardProps) {
  const { data: session } = useSession();
  const { hasAllPermissions, hasAnyPermission } = usePermissions();

  if (!session?.user) {
    return <>{fallback}</>;
  }

  const hasAccess = requireAll
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
