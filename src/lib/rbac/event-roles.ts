/**
 * Event Role System
 * Comprehensive role hierarchy and permissions for event-specific roles
 */

export type EventRole = 
  // All Platforms Event Roles
  | 'EXECUTIVE'
  | 'CORE_AAA'
  | 'AA'
  | 'PRODUCTION'
  | 'MANAGEMENT'
  // COMPVSS Event Roles
  | 'CREW'
  | 'STAFF'
  | 'VENDOR'
  | 'ENTERTAINER'
  | 'ARTIST'
  | 'AGENT'
  | 'MEDIA'
  | 'SPONSOR'
  | 'PARTNER'
  | 'INDUSTRY'
  | 'INTERN'
  | 'VOLUNTEER'
  // GVTEWAY Event Roles
  | 'GUEST'
  | 'BACKSTAGE_L1'
  | 'BACKSTAGE_L2'
  | 'PLATINUM_VIP_L1'
  | 'PLATINUM_VIP_L2'
  | 'VIP_L1'
  | 'VIP_L2'
  | 'VIP_L3'
  | 'GA_L1'
  | 'GA_L2'
  | 'GA_L3'
  | 'GA_L4'
  | 'GA_L5'
  | 'INFLUENCER'
  | 'BRAND_AMBASSADOR'
  | 'AFFILIATE';

/**
 * Role hierarchy levels (higher = more access)
 */
export const ROLE_HIERARCHY: Record<EventRole | string, number> = {
  // All Platforms (Highest tier)
  EXECUTIVE: 1000,
  CORE_AAA: 900,
  AA: 800,
  PRODUCTION: 700,
  MANAGEMENT: 600,
  
  // COMPVSS Roles
  CREW: 500,
  STAFF: 450,
  VENDOR: 400,
  ENTERTAINER: 350,
  ARTIST: 350,
  AGENT: 300,
  MEDIA: 250,
  SPONSOR: 200,
  PARTNER: 200,
  INDUSTRY: 150,
  INTERN: 100,
  VOLUNTEER: 50,
  
  // GVTEWAY Roles (Backstage highest)
  BACKSTAGE_L2: 500,
  BACKSTAGE_L1: 450,
  PLATINUM_VIP_L2: 400,
  PLATINUM_VIP_L1: 350,
  VIP_L3: 300,
  VIP_L2: 250,
  VIP_L1: 200,
  GA_L5: 150,
  GA_L4: 120,
  GA_L3: 100,
  GA_L2: 80,
  GA_L1: 60,
  GUEST: 50,
  INFLUENCER: 150,
  BRAND_AMBASSADOR: 120,
  AFFILIATE: 100,
};

/**
 * Platform access by event role
 */
export const EVENT_ROLE_PLATFORM_ACCESS: Record<string, string[]> = {
  // All Platforms roles have access to everything
  EXECUTIVE: ['ATLVS', 'COMPVSS', 'GVTEWAY'],
  CORE_AAA: ['ATLVS', 'COMPVSS', 'GVTEWAY'],
  AA: ['ATLVS', 'COMPVSS', 'GVTEWAY'],
  PRODUCTION: ['ATLVS', 'COMPVSS', 'GVTEWAY'],
  MANAGEMENT: ['ATLVS', 'COMPVSS', 'GVTEWAY'],
  
  // COMPVSS roles
  CREW: ['COMPVSS'],
  STAFF: ['COMPVSS'],
  VENDOR: ['COMPVSS'],
  ENTERTAINER: ['COMPVSS', 'GVTEWAY'],
  ARTIST: ['COMPVSS', 'GVTEWAY'],
  AGENT: ['COMPVSS'],
  MEDIA: ['COMPVSS', 'GVTEWAY'],
  SPONSOR: ['COMPVSS', 'GVTEWAY'],
  PARTNER: ['COMPVSS', 'GVTEWAY'],
  INDUSTRY: ['COMPVSS'],
  INTERN: ['COMPVSS'],
  VOLUNTEER: ['COMPVSS'],
  
  // GVTEWAY roles
  GUEST: ['GVTEWAY'],
  BACKSTAGE_L1: ['GVTEWAY'],
  BACKSTAGE_L2: ['GVTEWAY'],
  PLATINUM_VIP_L1: ['GVTEWAY'],
  PLATINUM_VIP_L2: ['GVTEWAY'],
  VIP_L1: ['GVTEWAY'],
  VIP_L2: ['GVTEWAY'],
  VIP_L3: ['GVTEWAY'],
  GA_L1: ['GVTEWAY'],
  GA_L2: ['GVTEWAY'],
  GA_L3: ['GVTEWAY'],
  GA_L4: ['GVTEWAY'],
  GA_L5: ['GVTEWAY'],
  INFLUENCER: ['GVTEWAY'],
  BRAND_AMBASSADOR: ['GVTEWAY'],
  AFFILIATE: ['GVTEWAY'],
};

/**
 * Event role permissions
 */
export const EVENT_ROLE_PERMISSIONS: Record<string, string[]> = {
  // All Platforms Roles
  EXECUTIVE: [
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
    'venue:access:all',
    'backstage:access',
  ],
  CORE_AAA: [
    'events:create',
    'events:edit',
    'tickets:manage',
    'orders:view',
    'advancing:approve',
    'projects:create',
    'projects:edit',
    'tasks:assign',
    'budgets:manage',
    'venue:access:all',
    'backstage:access',
  ],
  AA: [
    'events:edit',
    'tickets:manage',
    'orders:view',
    'advancing:submit',
    'projects:edit',
    'tasks:assign',
    'budgets:view',
    'venue:access:restricted',
    'backstage:access',
  ],
  PRODUCTION: [
    'events:view',
    'advancing:submit',
    'projects:view',
    'tasks:view',
    'venue:access:production',
    'backstage:access',
  ],
  MANAGEMENT: [
    'events:view',
    'orders:view',
    'projects:view',
    'budgets:view',
    'venue:access:management',
  ],
  
  // COMPVSS Roles
  CREW: [
    'advancing:submit',
    'tasks:view',
    'venue:access:crew',
    'backstage:access',
  ],
  STAFF: [
    'advancing:submit',
    'tasks:view',
    'venue:access:staff',
  ],
  VENDOR: [
    'advancing:submit',
    'orders:view:own',
    'venue:access:vendor',
  ],
  ENTERTAINER: [
    'events:view',
    'venue:access:performer',
    'backstage:access',
    'greenroom:access',
  ],
  ARTIST: [
    'events:view',
    'venue:access:performer',
    'backstage:access',
    'greenroom:access',
  ],
  AGENT: [
    'events:view',
    'orders:view:clients',
    'venue:access:agent',
  ],
  MEDIA: [
    'events:view',
    'venue:access:media',
    'photo:pit:access',
  ],
  SPONSOR: [
    'events:view',
    'venue:access:sponsor',
  ],
  PARTNER: [
    'events:view',
    'venue:access:partner',
  ],
  INDUSTRY: [
    'events:view',
    'venue:access:industry',
  ],
  INTERN: [
    'tasks:view',
    'venue:access:intern',
  ],
  VOLUNTEER: [
    'tasks:view',
    'venue:access:volunteer',
  ],
  
  // GVTEWAY Roles
  BACKSTAGE_L2: [
    'events:view',
    'orders:view:own',
    'venue:access:backstage',
    'backstage:access',
    'greenroom:access',
    'vip:lounge:access',
  ],
  BACKSTAGE_L1: [
    'events:view',
    'orders:view:own',
    'venue:access:backstage',
    'backstage:access',
  ],
  PLATINUM_VIP_L2: [
    'events:view',
    'orders:view:own',
    'venue:access:platinum_vip',
    'vip:lounge:access',
    'priority:entry',
  ],
  PLATINUM_VIP_L1: [
    'events:view',
    'orders:view:own',
    'venue:access:platinum_vip',
    'vip:lounge:access',
  ],
  VIP_L3: [
    'events:view',
    'orders:view:own',
    'venue:access:vip',
    'vip:lounge:access',
  ],
  VIP_L2: [
    'events:view',
    'orders:view:own',
    'venue:access:vip',
  ],
  VIP_L1: [
    'events:view',
    'orders:view:own',
    'venue:access:vip',
  ],
  GA_L5: [
    'events:view',
    'orders:view:own',
    'venue:access:ga',
    'priority:entry',
  ],
  GA_L4: [
    'events:view',
    'orders:view:own',
    'venue:access:ga',
  ],
  GA_L3: [
    'events:view',
    'orders:view:own',
    'venue:access:ga',
  ],
  GA_L2: [
    'events:view',
    'orders:view:own',
    'venue:access:ga',
  ],
  GA_L1: [
    'events:view',
    'orders:view:own',
    'venue:access:ga',
  ],
  GUEST: [
    'events:view',
    'venue:access:guest',
  ],
  INFLUENCER: [
    'events:view',
    'orders:view:own',
    'venue:access:influencer',
    'media:kit:access',
  ],
  BRAND_AMBASSADOR: [
    'events:view',
    'orders:view:own',
    'venue:access:brand_ambassador',
    'referral:create',
  ],
  AFFILIATE: [
    'events:view',
    'orders:view:own',
    'venue:access:affiliate',
    'referral:create',
    'commission:view',
  ],
};

/**
 * Check if role has access to platform
 */
export function hasEventRolePlatformAccess(
  role: string,
  platform: 'ATLVS' | 'COMPVSS' | 'GVTEWAY'
): boolean {
  const platforms = EVENT_ROLE_PLATFORM_ACCESS[role];
  return platforms ? platforms.includes(platform) : false;
}

/**
 * Check if role has specific permission
 */
export function hasEventRolePermission(
  role: string,
  permission: string
): boolean {
  const permissions = EVENT_ROLE_PERMISSIONS[role];
  return permissions ? permissions.includes(permission) : false;
}

/**
 * Compare role hierarchy (returns true if role1 >= role2)
 */
export function isRoleHigherOrEqual(role1: string, role2: string): boolean {
  const level1 = ROLE_HIERARCHY[role1] || 0;
  const level2 = ROLE_HIERARCHY[role2] || 0;
  return level1 >= level2;
}

/**
 * Get all permissions for a role
 */
export function getEventRolePermissions(role: string): string[] {
  return EVENT_ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if role is an event role
 */
export function isEventRole(role: string): boolean {
  return role in EVENT_ROLE_PERMISSIONS;
}

/**
 * Get platform access for role
 */
export function getEventRolePlatformAccess(role: string): string[] {
  return EVENT_ROLE_PLATFORM_ACCESS[role] || [];
}
