/**
 * RBAC Roles System
 * Defines all roles across the platform
 */

export enum Role {
  // Legend Roles - God Mode / Development & Support
  LEGEND_SUPER_ADMIN = 'legend:super_admin',
  LEGEND_ADMIN = 'legend:admin',
  LEGEND_DEVELOPER = 'legend:developer',
  LEGEND_COLLABORATOR = 'legend:collaborator',
  LEGEND_SUPPORT = 'legend:support',
  LEGEND_INCOGNITO = 'legend:incognito',

  // System Roles
  SUPER_ADMIN = 'super_admin',
  SYSTEM_ADMIN = 'system_admin',

  // ATLVS Roles
  ATLVS_ADMIN = 'atlvs:admin',
  ATLVS_PROJECT_MANAGER = 'atlvs:project_manager',
  ATLVS_TEAM_LEAD = 'atlvs:team_lead',
  ATLVS_TEAM_MEMBER = 'atlvs:team_member',
  ATLVS_ASSET_MANAGER = 'atlvs:asset_manager',
  ATLVS_BUDGET_APPROVER = 'atlvs:budget_approver',
  ATLVS_ADVANCING_APPROVER = 'atlvs:advancing_approver',
  ATLVS_VIEWER = 'atlvs:viewer',

  // COMPVSS Roles
  COMPVSS_ADMIN = 'compvss:admin',
  COMPVSS_MANAGER = 'compvss:manager',
  COMPVSS_TEAM_LEAD = 'compvss:team_lead',
  COMPVSS_TEAM_MEMBER = 'compvss:team_member',
  COMPVSS_AFFILIATE = 'compvss:affiliate',
  COMPVSS_VIEWER = 'compvss:viewer',

  // GVTEWAY Roles
  GVTEWAY_ADMIN = 'gvteway:admin',
  GVTEWAY_EVENT_ORGANIZER = 'gvteway:event_organizer',
  GVTEWAY_VENUE_MANAGER = 'gvteway:venue_manager',
  GVTEWAY_ARTIST = 'gvteway:artist',
  GVTEWAY_VERIFIED_ARTIST = 'gvteway:verified_artist',
  GVTEWAY_CUSTOMER = 'gvteway:customer',
  GVTEWAY_VIP_MEMBER = 'gvteway:vip_member',
  GVTEWAY_MODERATOR = 'gvteway:moderator',

  // Organization Roles
  ORG_OWNER = 'org:owner',
  ORG_ADMIN = 'org:admin',
  ORG_MEMBER = 'org:member',
  ORG_VIEWER = 'org:viewer',
}

/**
 * Role hierarchy - higher roles inherit permissions from lower roles
 */
export const RoleHierarchy: Record<Role, Role[]> = {
  // Legend - God Mode (inherit all permissions)
  [Role.LEGEND_SUPER_ADMIN]: [Role.SUPER_ADMIN],
  [Role.LEGEND_ADMIN]: [Role.SUPER_ADMIN],
  [Role.LEGEND_DEVELOPER]: [Role.SUPER_ADMIN],
  [Role.LEGEND_COLLABORATOR]: [Role.SYSTEM_ADMIN],
  [Role.LEGEND_SUPPORT]: [Role.SYSTEM_ADMIN],
  [Role.LEGEND_INCOGNITO]: [Role.SUPER_ADMIN],

  // System
  [Role.SUPER_ADMIN]: [Role.SYSTEM_ADMIN],
  [Role.SYSTEM_ADMIN]: [],

  // ATLVS
  [Role.ATLVS_ADMIN]: [
    Role.ATLVS_PROJECT_MANAGER,
    Role.ATLVS_ASSET_MANAGER,
    Role.ATLVS_BUDGET_APPROVER,
    Role.ATLVS_ADVANCING_APPROVER,
  ],
  [Role.ATLVS_PROJECT_MANAGER]: [Role.ATLVS_TEAM_LEAD],
  [Role.ATLVS_TEAM_LEAD]: [Role.ATLVS_TEAM_MEMBER],
  [Role.ATLVS_TEAM_MEMBER]: [Role.ATLVS_VIEWER],
  [Role.ATLVS_ASSET_MANAGER]: [Role.ATLVS_VIEWER],
  [Role.ATLVS_BUDGET_APPROVER]: [Role.ATLVS_VIEWER],
  [Role.ATLVS_ADVANCING_APPROVER]: [Role.ATLVS_VIEWER],
  [Role.ATLVS_VIEWER]: [],

  // COMPVSS
  [Role.COMPVSS_ADMIN]: [Role.COMPVSS_MANAGER],
  [Role.COMPVSS_MANAGER]: [Role.COMPVSS_TEAM_LEAD],
  [Role.COMPVSS_TEAM_LEAD]: [Role.COMPVSS_TEAM_MEMBER],
  [Role.COMPVSS_TEAM_MEMBER]: [Role.COMPVSS_VIEWER],
  [Role.COMPVSS_AFFILIATE]: [Role.COMPVSS_VIEWER],
  [Role.COMPVSS_VIEWER]: [],

  // GVTEWAY
  [Role.GVTEWAY_ADMIN]: [
    Role.GVTEWAY_EVENT_ORGANIZER,
    Role.GVTEWAY_VENUE_MANAGER,
    Role.GVTEWAY_MODERATOR,
  ],
  [Role.GVTEWAY_EVENT_ORGANIZER]: [Role.GVTEWAY_CUSTOMER],
  [Role.GVTEWAY_VENUE_MANAGER]: [Role.GVTEWAY_CUSTOMER],
  [Role.GVTEWAY_VERIFIED_ARTIST]: [Role.GVTEWAY_ARTIST],
  [Role.GVTEWAY_ARTIST]: [Role.GVTEWAY_CUSTOMER],
  [Role.GVTEWAY_VIP_MEMBER]: [Role.GVTEWAY_CUSTOMER],
  [Role.GVTEWAY_CUSTOMER]: [],
  [Role.GVTEWAY_MODERATOR]: [],

  // Organization
  [Role.ORG_OWNER]: [Role.ORG_ADMIN],
  [Role.ORG_ADMIN]: [Role.ORG_MEMBER],
  [Role.ORG_MEMBER]: [Role.ORG_VIEWER],
  [Role.ORG_VIEWER]: [],
};

/**
 * Role metadata
 */
export interface RoleMetadata {
  name: string;
  description: string;
  platform: 'atlvs' | 'compvss' | 'gvteway' | 'system' | 'organization' | 'legend';
  level: 'admin' | 'manager' | 'member' | 'viewer' | 'god';
  requiresEmail?: string;
  canImpersonate?: boolean;
  requiresPermissionToImpersonate?: boolean;
}

export const RoleMetadataMap: Record<Role, RoleMetadata> = {
  // Legend Roles - God Mode
  [Role.LEGEND_SUPER_ADMIN]: {
    name: 'Legend Super Admin',
    description: 'God Mode - Absolute platform control, all permissions',
    platform: 'legend',
    level: 'god',
    requiresEmail: '@ghxstship.pro',
    canImpersonate: true,
    requiresPermissionToImpersonate: false,
  },
  [Role.LEGEND_ADMIN]: {
    name: 'Legend Admin',
    description: 'Internal product management with cross-app access',
    platform: 'legend',
    level: 'god',
    requiresEmail: '@ghxstship.pro',
    canImpersonate: true,
    requiresPermissionToImpersonate: false,
  },
  [Role.LEGEND_DEVELOPER]: {
    name: 'Legend Developer',
    description: 'Internal product team with full repo access',
    platform: 'legend',
    level: 'god',
    requiresEmail: '@ghxstship.pro',
    canImpersonate: true,
    requiresPermissionToImpersonate: false,
  },
  [Role.LEGEND_COLLABORATOR]: {
    name: 'Legend Collaborator',
    description: 'External scoped full repo access',
    platform: 'legend',
    level: 'god',
    requiresEmail: '@ghxstship.pro',
    canImpersonate: false,
  },
  [Role.LEGEND_SUPPORT]: {
    name: 'Legend Support',
    description: 'Tech support with user impersonation (requires permission)',
    platform: 'legend',
    level: 'god',
    requiresEmail: '@ghxstship.pro',
    canImpersonate: true,
    requiresPermissionToImpersonate: true,
  },
  [Role.LEGEND_INCOGNITO]: {
    name: 'Legend Incognito',
    description: 'Can impersonate any user without permission',
    platform: 'legend',
    level: 'god',
    requiresEmail: '@ghxstship.pro',
    canImpersonate: true,
    requiresPermissionToImpersonate: false,
  },

  // System
  [Role.SUPER_ADMIN]: {
    name: 'Super Administrator',
    description: 'Full system access across all platforms',
    platform: 'system',
    level: 'admin',
  },
  [Role.SYSTEM_ADMIN]: {
    name: 'System Administrator',
    description: 'System-level administrative access',
    platform: 'system',
    level: 'admin',
  },

  // ATLVS
  [Role.ATLVS_ADMIN]: {
    name: 'ATLVS Administrator',
    description: 'Full administrative access to ATLVS platform',
    platform: 'atlvs',
    level: 'admin',
  },
  [Role.ATLVS_PROJECT_MANAGER]: {
    name: 'Project Manager',
    description: 'Manage projects, tasks, and budgets',
    platform: 'atlvs',
    level: 'manager',
  },
  [Role.ATLVS_TEAM_LEAD]: {
    name: 'Team Lead',
    description: 'Lead a team and manage team tasks',
    platform: 'atlvs',
    level: 'manager',
  },
  [Role.ATLVS_TEAM_MEMBER]: {
    name: 'Team Member',
    description: 'Work on assigned tasks and projects',
    platform: 'atlvs',
    level: 'member',
  },
  [Role.ATLVS_ASSET_MANAGER]: {
    name: 'Asset Manager',
    description: 'Manage assets and equipment',
    platform: 'atlvs',
    level: 'manager',
  },
  [Role.ATLVS_BUDGET_APPROVER]: {
    name: 'Budget Approver',
    description: 'Approve budgets and expenses',
    platform: 'atlvs',
    level: 'manager',
  },
  [Role.ATLVS_ADVANCING_APPROVER]: {
    name: 'Advancing Approver',
    description: 'Review and approve advancing requests',
    platform: 'atlvs',
    level: 'manager',
  },
  [Role.ATLVS_VIEWER]: {
    name: 'Viewer',
    description: 'Read-only access to ATLVS',
    platform: 'atlvs',
    level: 'viewer',
  },

  // COMPVSS
  [Role.COMPVSS_ADMIN]: {
    name: 'COMPVSS Administrator',
    description: 'Full administrative access to COMPVSS platform',
    platform: 'compvss',
    level: 'admin',
  },
  [Role.COMPVSS_MANAGER]: {
    name: 'COMPVSS Manager',
    description: 'Manage teams and approve requests',
    platform: 'compvss',
    level: 'manager',
  },
  [Role.COMPVSS_TEAM_LEAD]: {
    name: 'Team Lead',
    description: 'Lead external team operations',
    platform: 'compvss',
    level: 'manager',
  },
  [Role.COMPVSS_TEAM_MEMBER]: {
    name: 'Team Member',
    description: 'External team member access',
    platform: 'compvss',
    level: 'member',
  },
  [Role.COMPVSS_AFFILIATE]: {
    name: 'Affiliate',
    description: 'Affiliate partner access',
    platform: 'compvss',
    level: 'member',
  },
  [Role.COMPVSS_VIEWER]: {
    name: 'Viewer',
    description: 'Read-only access to COMPVSS',
    platform: 'compvss',
    level: 'viewer',
  },

  // GVTEWAY
  [Role.GVTEWAY_ADMIN]: {
    name: 'GVTEWAY Administrator',
    description: 'Full administrative access to GVTEWAY platform',
    platform: 'gvteway',
    level: 'admin',
  },
  [Role.GVTEWAY_EVENT_ORGANIZER]: {
    name: 'Event Organizer',
    description: 'Create and manage events',
    platform: 'gvteway',
    level: 'manager',
  },
  [Role.GVTEWAY_VENUE_MANAGER]: {
    name: 'Venue Manager',
    description: 'Manage venue operations',
    platform: 'gvteway',
    level: 'manager',
  },
  [Role.GVTEWAY_ARTIST]: {
    name: 'Artist',
    description: 'Artist profile and content management',
    platform: 'gvteway',
    level: 'member',
  },
  [Role.GVTEWAY_VERIFIED_ARTIST]: {
    name: 'Verified Artist',
    description: 'Verified artist with enhanced features',
    platform: 'gvteway',
    level: 'member',
  },
  [Role.GVTEWAY_CUSTOMER]: {
    name: 'Customer',
    description: 'Standard customer access',
    platform: 'gvteway',
    level: 'member',
  },
  [Role.GVTEWAY_VIP_MEMBER]: {
    name: 'VIP Member',
    description: 'VIP membership with exclusive access',
    platform: 'gvteway',
    level: 'member',
  },
  [Role.GVTEWAY_MODERATOR]: {
    name: 'Moderator',
    description: 'Moderate content and users',
    platform: 'gvteway',
    level: 'manager',
  },

  // Organization
  [Role.ORG_OWNER]: {
    name: 'Organization Owner',
    description: 'Organization owner with full control',
    platform: 'organization',
    level: 'admin',
  },
  [Role.ORG_ADMIN]: {
    name: 'Organization Admin',
    description: 'Organization administrator',
    platform: 'organization',
    level: 'admin',
  },
  [Role.ORG_MEMBER]: {
    name: 'Organization Member',
    description: 'Organization member',
    platform: 'organization',
    level: 'member',
  },
  [Role.ORG_VIEWER]: {
    name: 'Organization Viewer',
    description: 'Read-only organization access',
    platform: 'organization',
    level: 'viewer',
  },
};

/**
 * Check if a role has another role (including hierarchy)
 */
export function hasRole(userRoles: Role[], requiredRole: Role): boolean {
  if (userRoles.includes(requiredRole)) {
    return true;
  }

  // Check if user has a higher role in the hierarchy
  for (const userRole of userRoles) {
    const inheritedRoles = getAllInheritedRoles(userRole);
    if (inheritedRoles.includes(requiredRole)) {
      return true;
    }
  }

  return false;
}

/**
 * Get all roles inherited by a role (recursive)
 */
export function getAllInheritedRoles(role: Role): Role[] {
  const inherited = RoleHierarchy[role] || [];
  const allInherited = [...inherited];

  for (const inheritedRole of inherited) {
    allInherited.push(...getAllInheritedRoles(inheritedRole));
  }

  return [...new Set(allInherited)];
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(userRoles: Role[], requiredRoles: Role[]): boolean {
  return requiredRoles.some((role) => hasRole(userRoles, role));
}

/**
 * Check if user has a Legend role
 */
export function isLegendRole(role: Role): boolean {
  return role.startsWith('legend:');
}

/**
 * Check if user has any Legend role
 */
export function hasLegendRole(userRoles: Role[]): boolean {
  return userRoles.some(isLegendRole);
}

/**
 * Get all Legend roles
 */
export const LEGEND_ROLES = [
  Role.LEGEND_SUPER_ADMIN,
  Role.LEGEND_ADMIN,
  Role.LEGEND_DEVELOPER,
  Role.LEGEND_COLLABORATOR,
  Role.LEGEND_SUPPORT,
  Role.LEGEND_INCOGNITO,
] as const;

/**
 * Check if email domain is valid for Legend roles
 */
export function isValidLegendEmail(email: string): boolean {
  return email.endsWith('@ghxstship.pro');
}

/**
 * Check if role can impersonate users
 */
export function canImpersonate(role: Role): boolean {
  const metadata = RoleMetadataMap[role];
  return metadata?.canImpersonate === true;
}

/**
 * Check if role requires permission to impersonate
 */
export function requiresPermissionToImpersonate(role: Role): boolean {
  const metadata = RoleMetadataMap[role];
  return metadata?.requiresPermissionToImpersonate === true;
}
