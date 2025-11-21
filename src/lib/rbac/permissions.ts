/**
 * RBAC Permissions System
 * Defines all permissions across the platform
 */

export enum Permission {
  // User Management
  USER_READ = 'user:read',
  USER_WRITE = 'user:write',
  USER_DELETE = 'user:delete',
  USER_MANAGE_ROLES = 'user:manage_roles',

  // Organization Management
  ORG_READ = 'org:read',
  ORG_WRITE = 'org:write',
  ORG_DELETE = 'org:delete',
  ORG_MANAGE_MEMBERS = 'org:manage_members',
  ORG_MANAGE_SETTINGS = 'org:manage_settings',

  // ATLVS - Projects
  PROJECT_READ = 'atlvs:project:read',
  PROJECT_WRITE = 'atlvs:project:write',
  PROJECT_DELETE = 'atlvs:project:delete',
  PROJECT_MANAGE = 'atlvs:project:manage',

  // ATLVS - Tasks
  TASK_READ = 'atlvs:task:read',
  TASK_WRITE = 'atlvs:task:write',
  TASK_DELETE = 'atlvs:task:delete',
  TASK_ASSIGN = 'atlvs:task:assign',
  TASK_COMPLETE = 'atlvs:task:complete',

  // ATLVS - Assets
  ASSET_READ = 'atlvs:asset:read',
  ASSET_WRITE = 'atlvs:asset:write',
  ASSET_DELETE = 'atlvs:asset:delete',
  ASSET_BOOK = 'atlvs:asset:book',
  ASSET_MANAGE = 'atlvs:asset:manage',

  // ATLVS - Budgets
  BUDGET_READ = 'atlvs:budget:read',
  BUDGET_WRITE = 'atlvs:budget:write',
  BUDGET_DELETE = 'atlvs:budget:delete',
  BUDGET_APPROVE = 'atlvs:budget:approve',

  // ATLVS - Expenses
  EXPENSE_READ = 'atlvs:expense:read',
  EXPENSE_WRITE = 'atlvs:expense:write',
  EXPENSE_DELETE = 'atlvs:expense:delete',
  EXPENSE_APPROVE = 'atlvs:expense:approve',

  // ATLVS - Teams
  TEAM_READ = 'atlvs:team:read',
  TEAM_WRITE = 'atlvs:team:write',
  TEAM_DELETE = 'atlvs:team:delete',
  TEAM_MANAGE_MEMBERS = 'atlvs:team:manage_members',

  // ATLVS - Advancing
  ADVANCING_READ = 'atlvs:advancing:read',
  ADVANCING_WRITE = 'atlvs:advancing:write',
  ADVANCING_DELETE = 'atlvs:advancing:delete',
  ADVANCING_APPROVE = 'atlvs:advancing:approve',
  ADVANCING_REVIEW = 'atlvs:advancing:review',

  // COMPVSS - Advancing
  COMPVSS_ADVANCING_READ = 'compvss:advancing:read',
  COMPVSS_ADVANCING_WRITE = 'compvss:advancing:write',
  COMPVSS_ADVANCING_APPROVE = 'compvss:advancing:approve',

  // COMPVSS - Teams
  COMPVSS_TEAM_READ = 'compvss:team:read',
  COMPVSS_TEAM_WRITE = 'compvss:team:write',
  COMPVSS_TEAM_MANAGE = 'compvss:team:manage',

  // COMPVSS - Issues
  COMPVSS_ISSUE_READ = 'compvss:issue:read',
  COMPVSS_ISSUE_WRITE = 'compvss:issue:write',
  COMPVSS_ISSUE_RESOLVE = 'compvss:issue:resolve',

  // COMPVSS - Expenses
  COMPVSS_EXPENSE_READ = 'compvss:expense:read',
  COMPVSS_EXPENSE_WRITE = 'compvss:expense:write',
  COMPVSS_EXPENSE_APPROVE = 'compvss:expense:approve',

  // COMPVSS - Affiliates
  COMPVSS_AFFILIATE_READ = 'compvss:affiliate:read',
  COMPVSS_AFFILIATE_WRITE = 'compvss:affiliate:write',
  COMPVSS_AFFILIATE_MANAGE = 'compvss:affiliate:manage',

  // COMPVSS - Check-in
  COMPVSS_CHECKIN_READ = 'compvss:checkin:read',
  COMPVSS_CHECKIN_WRITE = 'compvss:checkin:write',
  COMPVSS_CHECKIN_MANAGE = 'compvss:checkin:manage',

  // GVTEWAY - Events
  EVENT_READ = 'gvteway:event:read',
  EVENT_WRITE = 'gvteway:event:write',
  EVENT_DELETE = 'gvteway:event:delete',
  EVENT_PUBLISH = 'gvteway:event:publish',
  EVENT_MANAGE = 'gvteway:event:manage',

  // GVTEWAY - Tickets
  TICKET_READ = 'gvteway:ticket:read',
  TICKET_PURCHASE = 'gvteway:ticket:purchase',
  TICKET_TRANSFER = 'gvteway:ticket:transfer',
  TICKET_REFUND = 'gvteway:ticket:refund',
  TICKET_VALIDATE = 'gvteway:ticket:validate',

  // GVTEWAY - Orders
  ORDER_READ = 'gvteway:order:read',
  ORDER_MANAGE = 'gvteway:order:manage',
  ORDER_REFUND = 'gvteway:order:refund',

  // GVTEWAY - Products
  PRODUCT_READ = 'gvteway:product:read',
  PRODUCT_WRITE = 'gvteway:product:write',
  PRODUCT_DELETE = 'gvteway:product:delete',
  PRODUCT_MANAGE = 'gvteway:product:manage',

  // GVTEWAY - Venues
  VENUE_READ = 'gvteway:venue:read',
  VENUE_WRITE = 'gvteway:venue:write',
  VENUE_DELETE = 'gvteway:venue:delete',
  VENUE_MANAGE = 'gvteway:venue:manage',

  // GVTEWAY - Artists
  ARTIST_READ = 'gvteway:artist:read',
  ARTIST_WRITE = 'gvteway:artist:write',
  ARTIST_VERIFY = 'gvteway:artist:verify',
  ARTIST_MANAGE = 'gvteway:artist:manage',

  // GVTEWAY - Memberships
  MEMBERSHIP_READ = 'gvteway:membership:read',
  MEMBERSHIP_PURCHASE = 'gvteway:membership:purchase',
  MEMBERSHIP_MANAGE = 'gvteway:membership:manage',

  // GVTEWAY - Adventures
  ADVENTURE_READ = 'gvteway:adventure:read',
  ADVENTURE_WRITE = 'gvteway:adventure:write',
  ADVENTURE_BOOK = 'gvteway:adventure:book',
  ADVENTURE_MANAGE = 'gvteway:adventure:manage',

  // GVTEWAY - Social
  SOCIAL_READ = 'gvteway:social:read',
  SOCIAL_WRITE = 'gvteway:social:write',
  SOCIAL_DELETE = 'gvteway:social:delete',
  SOCIAL_MODERATE = 'gvteway:social:moderate',

  // File Management
  FILE_READ = 'file:read',
  FILE_WRITE = 'file:write',
  FILE_DELETE = 'file:delete',

  // Analytics & Reports
  ANALYTICS_READ = 'analytics:read',
  ANALYTICS_EXPORT = 'analytics:export',
  REPORT_READ = 'report:read',
  REPORT_GENERATE = 'report:generate',

  // System Administration
  SYSTEM_ADMIN = 'system:admin',
  SYSTEM_SETTINGS = 'system:settings',
  SYSTEM_AUDIT = 'system:audit',
  SYSTEM_BACKUP = 'system:backup',
}

/**
 * Permission groups for easier management
 */
export const PermissionGroups = {
  // ATLVS Groups
  ATLVS_PROJECT_MANAGER: [
    Permission.PROJECT_READ,
    Permission.PROJECT_WRITE,
    Permission.PROJECT_MANAGE,
    Permission.TASK_READ,
    Permission.TASK_WRITE,
    Permission.TASK_ASSIGN,
    Permission.BUDGET_READ,
    Permission.BUDGET_WRITE,
    Permission.TEAM_READ,
    Permission.TEAM_WRITE,
  ],

  ATLVS_TEAM_MEMBER: [
    Permission.PROJECT_READ,
    Permission.TASK_READ,
    Permission.TASK_WRITE,
    Permission.TASK_COMPLETE,
    Permission.ASSET_READ,
    Permission.ASSET_BOOK,
    Permission.EXPENSE_READ,
    Permission.EXPENSE_WRITE,
  ],

  ATLVS_ASSET_MANAGER: [
    Permission.ASSET_READ,
    Permission.ASSET_WRITE,
    Permission.ASSET_MANAGE,
    Permission.ASSET_BOOK,
  ],

  ATLVS_BUDGET_APPROVER: [
    Permission.BUDGET_READ,
    Permission.BUDGET_APPROVE,
    Permission.EXPENSE_READ,
    Permission.EXPENSE_APPROVE,
  ],

  ATLVS_ADVANCING_APPROVER: [
    Permission.ADVANCING_READ,
    Permission.ADVANCING_REVIEW,
    Permission.ADVANCING_APPROVE,
  ],

  // COMPVSS Groups
  COMPVSS_ADMIN: [
    Permission.COMPVSS_ADVANCING_READ,
    Permission.COMPVSS_ADVANCING_WRITE,
    Permission.COMPVSS_ADVANCING_APPROVE,
    Permission.COMPVSS_TEAM_READ,
    Permission.COMPVSS_TEAM_WRITE,
    Permission.COMPVSS_TEAM_MANAGE,
    Permission.COMPVSS_ISSUE_READ,
    Permission.COMPVSS_ISSUE_WRITE,
    Permission.COMPVSS_ISSUE_RESOLVE,
    Permission.COMPVSS_EXPENSE_READ,
    Permission.COMPVSS_EXPENSE_WRITE,
    Permission.COMPVSS_EXPENSE_APPROVE,
  ],

  COMPVSS_TEAM_MEMBER: [
    Permission.COMPVSS_ADVANCING_READ,
    Permission.COMPVSS_ADVANCING_WRITE,
    Permission.COMPVSS_ISSUE_READ,
    Permission.COMPVSS_ISSUE_WRITE,
    Permission.COMPVSS_EXPENSE_READ,
    Permission.COMPVSS_EXPENSE_WRITE,
    Permission.COMPVSS_CHECKIN_READ,
    Permission.COMPVSS_CHECKIN_WRITE,
  ],

  // GVTEWAY Groups
  GVTEWAY_EXPERIENCE_CREATOR: [
    Permission.EVENT_READ,
    Permission.EVENT_WRITE,
    Permission.EVENT_PUBLISH,
    Permission.EVENT_MANAGE,
    Permission.TICKET_READ,
    Permission.TICKET_VALIDATE,
    Permission.VENUE_READ,
    Permission.VENUE_WRITE,
    Permission.PRODUCT_READ,
    Permission.PRODUCT_WRITE,
  ],

  GVTEWAY_ARTIST: [
    Permission.EVENT_READ,
    Permission.ARTIST_READ,
    Permission.ARTIST_WRITE,
    Permission.SOCIAL_READ,
    Permission.SOCIAL_WRITE,
  ],

  GVTEWAY_MEMBER: [
    Permission.EVENT_READ,
    Permission.TICKET_READ,
    Permission.TICKET_PURCHASE,
    Permission.TICKET_TRANSFER,
    Permission.ORDER_READ,
    Permission.MEMBERSHIP_READ,
    Permission.MEMBERSHIP_PURCHASE,
    Permission.ADVENTURE_READ,
    Permission.ADVENTURE_BOOK,
    Permission.SOCIAL_READ,
    Permission.SOCIAL_WRITE,
  ],

  // System Groups
  ATLVS_SUPER_ADMIN: Object.values(Permission),
};

/**
 * Check if a permission is granted
 */
export function hasPermission(
  userPermissions: Permission[],
  requiredPermission: Permission
): boolean {
  return userPermissions.includes(requiredPermission);
}

/**
 * Check if any of the required permissions are granted
 */
export function hasAnyPermission(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );
}

/**
 * Check if all required permissions are granted
 */
export function hasAllPermissions(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  );
}

/**
 * Get permissions for a role
 */
export function getPermissionsForRole(role: string): Permission[] {
  const rolePermissionMap: Record<string, Permission[]> = {
    // ATLVS Roles
    'atlvs:super_admin': PermissionGroups.ATLVS_SUPER_ADMIN,
    'atlvs:team_member': PermissionGroups.ATLVS_TEAM_MEMBER,

    // COMPVSS Roles
    'compvss:admin': PermissionGroups.COMPVSS_ADMIN,
    'compvss:team_member': PermissionGroups.COMPVSS_TEAM_MEMBER,

    // GVTEWAY Roles
    'gvteway:experience_creator': PermissionGroups.GVTEWAY_EXPERIENCE_CREATOR,
    'gvteway:artist': PermissionGroups.GVTEWAY_ARTIST,
    'gvteway:member': PermissionGroups.GVTEWAY_MEMBER,
  };

  return rolePermissionMap[role] || [];
}
