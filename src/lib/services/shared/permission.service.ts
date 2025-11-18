/**
 * Permission Service
 * Handles authorization checks and RBAC
 */

import { prisma } from '@/lib/prisma';
import { userHasPermission } from '@/lib/rbac/utils';
import { Permission } from '@/lib/rbac/permissions';

export class PermissionService {
  /**
   * Check if user has a specific permission
   */
  static async hasPermission(userId: string, permission: string): Promise<boolean> {
    return await userHasPermission(userId, permission as Permission);
  }

  /**
   * Check if user has any of the specified permissions
   */
  static async hasAnyPermission(
    userId: string,
    permissionList: string[]
  ): Promise<boolean> {
    for (const permission of permissionList) {
      if (await this.hasPermission(userId, permission)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if user has all of the specified permissions
   */
  static async hasAllPermissions(
    userId: string,
    permissionList: string[]
  ): Promise<boolean> {
    for (const permission of permissionList) {
      if (!(await this.hasPermission(userId, permission))) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get all permissions for a user
   */
  static async getUserPermissions(userId: string): Promise<string[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || !user.role) {
      return [];
    }

    // Return empty array - permissions are checked individually via checkPermission
    return [];
  }

  /**
   * Check if user has a specific role
   */
  static async hasRole(userId: string, role: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return user?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  static async hasAnyRole(userId: string, roleList: string[]): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return roleList.includes(user?.role || '');
  }

  /**
   * Check if user is organization admin
   */
  static async isOrganizationAdmin(
    userId: string,
    organizationId: string
  ): Promise<boolean> {
    const member = await prisma.organizationMember.findFirst({
      where: {
        userId,
        organizationId,
      },
    });

    return member?.role === 'ADMIN' || member?.role === 'OWNER';
  }

  /**
   * Check if user is project member
   */
  static async isProjectMember(userId: string, projectId: string): Promise<boolean> {
    // Find teams for this project
    const teams = await prisma.team.findMany({
      where: { projectId },
      select: { id: true },
    });
    
    if (teams.length === 0) return false;
    
    // Check if user is member of any of these teams
    const member = await prisma.teamMember.findFirst({
      where: {
        userId,
        teamId: { in: teams.map(t => t.id) },
      },
    });

    return !!member;
  }

  /**
   * Check if user owns a resource
   */
  static async ownsResource(
    userId: string,
    resourceType: string,
    resourceId: string
  ): Promise<boolean> {
    switch (resourceType) {
      case 'event':
        const event = await prisma.event.findUnique({
          where: { id: resourceId },
          select: { organizationId: true },
        });
        if (!event) return false;
        // Check if user is owner/admin of the organization
        const eventOrgMember = await prisma.organizationMember.findFirst({
          where: {
            userId,
            organizationId: event.organizationId,
            role: { in: ['OWNER', 'ADMIN'] },
          },
        });
        return !!eventOrgMember;

      case 'project':
        const project = await prisma.project.findUnique({
          where: { id: resourceId },
          select: { createdBy: true },
        });
        return project?.createdBy === userId;

      case 'organization':
        const orgMember = await prisma.organizationMember.findFirst({
          where: {
            userId,
            organizationId: resourceId,
          },
        });
        return orgMember?.role === 'OWNER';

      default:
        return false;
    }
  }

  /**
   * Require permission or throw error
   */
  static async requirePermission(userId: string, permission: string): Promise<void> {
    const hasPermission = await this.hasPermission(userId, permission);
    if (!hasPermission) {
      throw new Error(`Permission denied: ${permission}`);
    }
  }

  /**
   * Require role or throw error
   */
  static async requireRole(userId: string, role: string): Promise<void> {
    const hasRole = await this.hasRole(userId, role);
    if (!hasRole) {
      throw new Error(`Role required: ${role}`);
    }
  }

  /**
   * Require resource ownership or throw error
   */
  static async requireOwnership(
    userId: string,
    resourceType: string,
    resourceId: string
  ): Promise<void> {
    const owns = await this.ownsResource(userId, resourceType, resourceId);
    if (!owns) {
      throw new Error(`You do not own this ${resourceType}`);
    }
  }
}
