/**
 * Role-based access control and permissions
 */

export type Role = 'USER' | 'ADMIN' | 'ORGANIZER' | 'VENUE_MANAGER' | 'TEAM_MEMBER' | 'PRODUCTION_MANAGER';

export type Permission =
  // Event permissions
  | 'events:create'
  | 'events:read'
  | 'events:update'
  | 'events:delete'
  | 'events:publish'
  
  // Ticket permissions
  | 'tickets:create'
  | 'tickets:read'
  | 'tickets:update'
  | 'tickets:transfer'
  | 'tickets:refund'
  
  // Order permissions
  | 'orders:create'
  | 'orders:read'
  | 'orders:update'
  | 'orders:refund'
  
  // User permissions
  | 'users:read'
  | 'users:update'
  | 'users:delete'
  | 'users:manage_roles'
  
  // Advancing permissions
  | 'advancing:create'
  | 'advancing:read'
  | 'advancing:update'
  | 'advancing:approve'
  | 'advancing:reject'
  
  // Project permissions
  | 'projects:create'
  | 'projects:read'
  | 'projects:update'
  | 'projects:delete'
  
  // Analytics permissions
  | 'analytics:read'
  | 'analytics:export'
  
  // Admin permissions
  | 'admin:access'
  | 'admin:settings';

/**
 * Role permission matrix
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  USER: [
    'events:read',
    'tickets:read',
    'tickets:transfer',
    'orders:create',
    'orders:read',
    'users:read',
    'users:update',
  ],
  
  ORGANIZER: [
    'events:create',
    'events:read',
    'events:update',
    'events:delete',
    'events:publish',
    'tickets:create',
    'tickets:read',
    'tickets:update',
    'tickets:refund',
    'orders:read',
    'orders:refund',
    'analytics:read',
    'analytics:export',
  ],
  
  VENUE_MANAGER: [
    'events:read',
    'events:update',
    'tickets:read',
    'orders:read',
    'analytics:read',
  ],
  
  TEAM_MEMBER: [
    'events:read',
    'advancing:create',
    'advancing:read',
    'advancing:update',
    'users:read',
  ],
  
  PRODUCTION_MANAGER: [
    'events:read',
    'advancing:read',
    'advancing:approve',
    'advancing:reject',
    'projects:create',
    'projects:read',
    'projects:update',
    'analytics:read',
  ],
  
  ADMIN: [
    'events:create',
    'events:read',
    'events:update',
    'events:delete',
    'events:publish',
    'tickets:create',
    'tickets:read',
    'tickets:update',
    'tickets:transfer',
    'tickets:refund',
    'orders:create',
    'orders:read',
    'orders:update',
    'orders:refund',
    'users:read',
    'users:update',
    'users:delete',
    'users:manage_roles',
    'advancing:create',
    'advancing:read',
    'advancing:update',
    'advancing:approve',
    'advancing:reject',
    'projects:create',
    'projects:read',
    'projects:update',
    'projects:delete',
    'analytics:read',
    'analytics:export',
    'admin:access',
    'admin:settings',
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if a user can perform an action
 */
export function canPerformAction(
  userRole: Role,
  action: Permission,
  resourceOwnerId?: string,
  userId?: string
): boolean {
  // Check role permission
  if (!hasPermission(userRole, action)) {
    return false;
  }

  // If checking ownership, verify user owns the resource
  if (resourceOwnerId && userId && resourceOwnerId !== userId) {
    // Only allow if user has admin privileges
    return userRole === 'ADMIN';
  }

  return true;
}
