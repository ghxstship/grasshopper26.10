/**
 * Server-Side Authentication Utilities
 * For use in Server Components and API Routes
 * Supports platform roles and event roles
 */

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { hasEventRolePlatformAccess, getEventRolePermissions, isEventRole } from '@/lib/rbac/event-roles';

/**
 * Require authentication in Server Components
 * Redirects to login if not authenticated
 */
export async function requireServerAuth() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/login');
  }
  
  return session.user;
}

/**
 * Require specific role in Server Components
 * Redirects to unauthorized if user doesn't have required role
 */
export async function requireServerRole(roles: string | string[]) {
  const user = await requireServerAuth();
  const acceptableRoles = Array.isArray(roles) ? roles : [roles];
  
  if (!acceptableRoles.includes(user.role as string)) {
    redirect('/unauthorized');
  }
  
  return user;
}

/**
 * Require platform access in Server Components
 * Supports both platform roles and event roles
 */
export async function requirePlatformAccess(platform: 'ATLVS' | 'COMPVSS' | 'GVTEWAY') {
  const PLATFORM_ROLES = {
    ATLVS: [
      'INTERNAL_TEAM',
      'ADMIN',
      'SUPER_ADMIN',
      'LEGEND_SUPER_ADMIN',
      'LEGEND_ADMIN',
      'LEGEND_DEVELOPER',
      'LEGEND_COLLABORATOR',
      'LEGEND_SUPPORT',
      'EXECUTIVE',
      'CORE_AAA',
      'AA',
      'PRODUCTION',
      'MANAGEMENT',
    ],
    COMPVSS: [
      'EXTERNAL_TEAM',
      'ADMIN',
      'SUPER_ADMIN',
      'LEGEND_SUPER_ADMIN',
      'LEGEND_ADMIN',
      'LEGEND_DEVELOPER',
      'LEGEND_COLLABORATOR',
      'LEGEND_SUPPORT',
      'EXECUTIVE',
      'CORE_AAA',
      'AA',
      'PRODUCTION',
      'MANAGEMENT',
    ],
    GVTEWAY: [
      'CONSUMER',
      'ADMIN',
      'SUPER_ADMIN',
      'ORGANIZER',
      'LEGEND_SUPER_ADMIN',
      'LEGEND_ADMIN',
      'LEGEND_DEVELOPER',
      'LEGEND_COLLABORATOR',
      'LEGEND_SUPPORT',
      'EXECUTIVE',
      'CORE_AAA',
      'AA',
      'PRODUCTION',
      'MANAGEMENT',
    ],
  };
  
  const user = await requireServerAuth();
  const userRole = user.role as string;
  
  // Check using both static role list and event role system
  const hasAccess = PLATFORM_ROLES[platform].includes(userRole) || 
                   hasEventRolePlatformAccess(userRole, platform);
  
  if (!hasAccess) {
    redirect('/unauthorized');
  }
  
  return user;
}

/**
 * Get user with permissions from database
 */
export async function getUserWithPermissions(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      compvssProfile: true,
      atlvsProfile: true,
      organizations: {
        include: {
          organization: true,
        },
      },
    },
  });
}

/**
 * Check if user has permission
 * Supports both platform roles and event roles
 */
export async function hasServerPermission(userId: string, permission: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  
  if (!user) return false;
  
  const userRole = user.role;
  
  // Check if it's an event role
  if (isEventRole(userRole)) {
    const eventPermissions = getEventRolePermissions(userRole);
    return eventPermissions.includes(permission);
  }
  
  // Define role-based permissions for platform roles
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
  
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
}

/**
 * Verify resource ownership
 */
export async function verifyResourceOwnership(
  userId: string,
  resourceType: string,
  resourceId: string
): Promise<boolean> {
  // Check based on resource type
  switch (resourceType) {
    case 'project':
      const project = await prisma.project.findFirst({
        where: {
          id: resourceId,
          createdBy: userId,
        },
      });
      return !!project;
      
    case 'task':
      const task = await prisma.task.findFirst({
        where: {
          id: resourceId,
          OR: [
            { createdBy: userId },
            { assigneeId: userId },
          ],
        },
      });
      return !!task;
      
    case 'budget':
      const budget = await prisma.budget.findFirst({
        where: {
          id: resourceId,
          project: {
            createdBy: userId,
          },
        },
      });
      return !!budget;
      
    default:
      return false;
  }
}

/**
 * Create audit log for server actions
 */
export async function createServerAuditLog(
  userId: string,
  action: string,
  entity: string,
  entityId?: string,
  metadata?: Record<string, unknown>
) {
  return await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
    },
  });
}
