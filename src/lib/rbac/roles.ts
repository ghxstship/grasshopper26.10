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
  ATLVS_SUPER_ADMIN = 'atlvs:super_admin',

  // ATLVS Roles
  ATLVS_ADMIN = 'atlvs:admin',
  ATLVS_TEAM_MEMBER = 'atlvs:team_member',
  ATLVS_VIEWER = 'atlvs:viewer',

  // COMPVSS Roles
  COMPVSS_ADMIN = 'compvss:admin',
  COMPVSS_TEAM_MEMBER = 'compvss:team_member',
  COMPVSS_COLLABORATOR = 'compvss:collaborator',
  COMPVSS_VIEWER = 'compvss:viewer',

  // GVTEWAY Roles
  GVTEWAY_ADMIN = 'gvteway:admin',
  GVTEWAY_EXPERIENCE_CREATOR = 'gvteway:experience_creator',
  GVTEWAY_VENUE_MANAGER = 'gvteway:venue_manager',
  GVTEWAY_ARTIST = 'gvteway:artist',
  GVTEWAY_ARTIST_VERIFIED = 'gvteway:artist_verified',
  GVTEWAY_MEMBER = 'gvteway:member',
  GVTEWAY_MEMBER_PLUS = 'gvteway:member_plus',
  GVTEWAY_MEMBER_EXTRA = 'gvteway:member_extra',
  GVTEWAY_MEMBER_GUEST = 'gvteway:member_guest',
  GVTEWAY_AFFILIATE = 'gvteway:affiliate',
  GVTEWAY_MODERATOR = 'gvteway:moderator',

}

/**
 * Role hierarchy - higher roles inherit permissions from lower roles
 */
export const RoleHierarchy: Record<Role, Role[]> = {
  // Legend - God Mode (inherit all permissions)
  [Role.LEGEND_SUPER_ADMIN]: [Role.ATLVS_SUPER_ADMIN],
  [Role.LEGEND_ADMIN]: [Role.ATLVS_SUPER_ADMIN],
  [Role.LEGEND_DEVELOPER]: [Role.ATLVS_SUPER_ADMIN],
  [Role.LEGEND_COLLABORATOR]: [Role.ATLVS_ADMIN],
  [Role.LEGEND_SUPPORT]: [Role.ATLVS_ADMIN],
  [Role.LEGEND_INCOGNITO]: [Role.ATLVS_SUPER_ADMIN],

  // System
  [Role.ATLVS_SUPER_ADMIN]: [Role.ATLVS_ADMIN],

  // ATLVS
  [Role.ATLVS_ADMIN]: [Role.ATLVS_TEAM_MEMBER],
  [Role.ATLVS_TEAM_MEMBER]: [Role.ATLVS_VIEWER],
  [Role.ATLVS_VIEWER]: [],

  // COMPVSS
  [Role.COMPVSS_ADMIN]: [Role.COMPVSS_TEAM_MEMBER],
  [Role.COMPVSS_TEAM_MEMBER]: [Role.COMPVSS_VIEWER],
  [Role.COMPVSS_COLLABORATOR]: [Role.COMPVSS_VIEWER],
  [Role.COMPVSS_VIEWER]: [],

  // GVTEWAY
  [Role.GVTEWAY_ADMIN]: [
    Role.GVTEWAY_EXPERIENCE_CREATOR,
    Role.GVTEWAY_VENUE_MANAGER,
    Role.GVTEWAY_MODERATOR,
  ],
  [Role.GVTEWAY_EXPERIENCE_CREATOR]: [Role.GVTEWAY_MEMBER],
  [Role.GVTEWAY_VENUE_MANAGER]: [Role.GVTEWAY_MEMBER],
  [Role.GVTEWAY_ARTIST_VERIFIED]: [Role.GVTEWAY_ARTIST],
  [Role.GVTEWAY_ARTIST]: [Role.GVTEWAY_MEMBER],
  [Role.GVTEWAY_MEMBER_EXTRA]: [Role.GVTEWAY_MEMBER_PLUS],
  [Role.GVTEWAY_MEMBER_PLUS]: [Role.GVTEWAY_MEMBER],
  [Role.GVTEWAY_MEMBER_GUEST]: [Role.GVTEWAY_MEMBER],
  [Role.GVTEWAY_MEMBER]: [],
  [Role.GVTEWAY_AFFILIATE]: [Role.GVTEWAY_MEMBER],
  [Role.GVTEWAY_MODERATOR]: [],
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
  [Role.ATLVS_SUPER_ADMIN]: {
    name: 'ATLVS Super Administrator',
    description: 'Highest level ATLVS administrative access',
    platform: 'atlvs',
    level: 'admin',
  },

  // ATLVS
  [Role.ATLVS_ADMIN]: {
    name: 'ATLVS Administrator',
    description: 'Full administrative access to ATLVS platform',
    platform: 'atlvs',
    level: 'admin',
  },
  [Role.ATLVS_TEAM_MEMBER]: {
    name: 'Team Member',
    description: 'Work on assigned tasks and projects',
    platform: 'atlvs',
    level: 'member',
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
  [Role.COMPVSS_TEAM_MEMBER]: {
    name: 'Team Member',
    description: 'External team member access',
    platform: 'compvss',
    level: 'member',
  },
  [Role.COMPVSS_COLLABORATOR]: {
    name: 'Collaborator',
    description: 'Collaborator partner access',
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
  [Role.GVTEWAY_EXPERIENCE_CREATOR]: {
    name: 'Experience Creator',
    description: 'Create and manage experiences',
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
  [Role.GVTEWAY_ARTIST_VERIFIED]: {
    name: 'Verified Artist',
    description: 'Verified artist with enhanced features',
    platform: 'gvteway',
    level: 'member',
  },
  [Role.GVTEWAY_MEMBER]: {
    name: 'Member',
    description: 'Standard member access',
    platform: 'gvteway',
    level: 'member',
  },
  [Role.GVTEWAY_MEMBER_PLUS]: {
    name: 'Member Plus',
    description: 'Enhanced membership with additional benefits',
    platform: 'gvteway',
    level: 'member',
  },
  [Role.GVTEWAY_MEMBER_EXTRA]: {
    name: 'Member Extra',
    description: 'Premium membership with exclusive access',
    platform: 'gvteway',
    level: 'member',
  },
  [Role.GVTEWAY_MEMBER_GUEST]: {
    name: 'Guest Member',
    description: 'Guest access to events',
    platform: 'gvteway',
    level: 'member',
  },
  [Role.GVTEWAY_AFFILIATE]: {
    name: 'Affiliate',
    description: 'Affiliate partner with promotional access',
    platform: 'gvteway',
    level: 'member',
  },
  [Role.GVTEWAY_MODERATOR]: {
    name: 'Moderator',
    description: 'Moderate content and users',
    platform: 'gvteway',
    level: 'manager',
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
