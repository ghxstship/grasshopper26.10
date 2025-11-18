/**
 * Permission Service
 * Handles RBAC (Role-Based Access Control) and permission checks
 */

import { BaseService, ServiceResult } from '../base/BaseService';
import { UserRole } from '@prisma/client';

export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, unknown>;
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

export class PermissionService extends BaseService {
  // Define role-based permissions
  private rolePermissions: Map<UserRole, Permission[]> = new Map([
    [
      UserRole.ADMIN,
      [
        { resource: '*', action: '*' }, // Full access
      ],
    ],
    [
      UserRole.INTERNAL_TEAM,
      [
        // ATLVS permissions
        { resource: 'Project', action: 'read' },
        { resource: 'Project', action: 'create' },
        { resource: 'Project', action: 'update' },
        { resource: 'Project', action: 'delete' },
        { resource: 'Asset', action: 'read' },
        { resource: 'Asset', action: 'create' },
        { resource: 'Asset', action: 'update' },
        { resource: 'Asset', action: 'book' },
        { resource: 'Budget', action: 'read' },
        { resource: 'Budget', action: 'create' },
        { resource: 'Budget', action: 'update' },
        { resource: 'Budget', action: 'approve' },
        { resource: 'AdvancingRequest', action: 'read' },
        { resource: 'AdvancingRequest', action: 'approve' },
        { resource: 'AdvancingRequest', action: 'reject' },
        { resource: 'Automation', action: 'read' },
        { resource: 'Automation', action: 'create' },
        { resource: 'Automation', action: 'execute' },
        { resource: 'Analytics', action: 'read' },
      ],
    ],
    [
      UserRole.EXTERNAL_TEAM,
      [
        // COMPVSS permissions
        { resource: 'AdvancingRequest', action: 'read' },
        { resource: 'AdvancingRequest', action: 'create' },
        { resource: 'AdvancingRequest', action: 'update' },
        { resource: 'IssueReport', action: 'read' },
        { resource: 'IssueReport', action: 'create' },
        { resource: 'ExpenseReport', action: 'read' },
        { resource: 'ExpenseReport', action: 'create' },
        { resource: 'CheckIn', action: 'create' },
        { resource: 'Affiliate', action: 'read' },
      ],
    ],
    [
      UserRole.CONSUMER,
      [
        // GVTEWAY permissions
        { resource: 'Event', action: 'read' },
        { resource: 'Ticket', action: 'read' },
        { resource: 'Ticket', action: 'purchase' },
        { resource: 'Order', action: 'read' },
        { resource: 'Cart', action: 'read' },
        { resource: 'Cart', action: 'update' },
        { resource: 'Wishlist', action: 'read' },
        { resource: 'Wishlist', action: 'create' },
        { resource: 'Wishlist', action: 'delete' },
        { resource: 'SocialPost', action: 'read' },
        { resource: 'SocialPost', action: 'create' },
        { resource: 'Alert', action: 'read' },
        { resource: 'Alert', action: 'create' },
      ],
    ],
  ]);

  /**
   * Check if user has permission (public method)
   */
  async hasResourcePermission(
    userId: string,
    resource: string,
    action: string
  ): Promise<ServiceResult<boolean>> {
    return this.execute(async () => {
      // Get user with role
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!user) {
        return false;
      }

      // Admin has all permissions
      if (user.role === UserRole.ADMIN) {
        return true;
      }

      // Get role permissions
      const permissions = this.rolePermissions.get(user.role) || [];

      // Check for wildcard permission
      const hasWildcard = permissions.some(
        p => (p.resource === '*' && p.action === '*') ||
             (p.resource === resource && p.action === '*') ||
             (p.resource === '*' && p.action === action)
      );

      if (hasWildcard) {
        return true;
      }

      // Check for specific permission
      const hasPermission = permissions.some(
        p => p.resource === resource && p.action === action
      );

      return hasPermission;
    }, 'checkPermission');
  }

  /**
   * Check multiple permissions (AND logic)
   */
  async checkPermissions(
    userId: string,
    checks: Array<{ resource: string; action: string }>
  ): Promise<ServiceResult<boolean>> {
    return this.execute(async () => {
      const results = await Promise.all(
        checks.map(check => this.hasResourcePermission(userId, check.resource, check.action))
      );

      return results.every(r => r.success && r.data === true);
    }, 'checkPermissions');
  }

  /**
   * Get user permissions
   */
  async getUserPermissions(userId: string): Promise<ServiceResult<Permission[]>> {
    return this.execute(async () => {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!user) {
        return [];
      }

      return this.rolePermissions.get(user.role) || [];
    }, 'getUserPermissions');
  }

  /**
   * Check if user owns resource
   */
  async checkOwnership(
    userId: string,
    resource: string,
    resourceId: string
  ): Promise<ServiceResult<boolean>> {
    return this.execute(async () => {
      // Map resource to Prisma model
      const modelMap: Record<string, string> = {
        AdvancingRequest: 'advancingRequest',
        Project: 'project',
        Task: 'task',
        IssueReport: 'issueReport',
        ExpenseReport: 'expenseReport',
        Order: 'order',
        Ticket: 'ticket',
        SocialPost: 'socialPost',
        Wishlist: 'wishlist',
        Alert: 'alert',
      };

      const modelName = modelMap[resource];
      if (!modelName) {
        return false;
      }

      // Check ownership
       
      const record = await (this.prisma as any)[modelName].findUnique({
        where: { id: resourceId },
        select: { userId: true },
      });

      return record?.userId === userId;
    }, 'checkOwnership');
  }

  /**
   * Require permission (throws error if not authorized)
   */
  async requirePermission(
    userId: string,
    resource: string,
    action: string
  ): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const result = await this.hasResourcePermission(userId, resource, action);
      
      if (!result.success || !result.data) {
        throw {
          name: 'ForbiddenError',
          message: `You do not have permission to ${action} ${resource}`,
        };
      }
    }, 'requirePermission');
  }

  /**
   * Require ownership (throws error if not owner)
   */
  async requireOwnership(
    userId: string,
    resource: string,
    resourceId: string
  ): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const result = await this.checkOwnership(userId, resource, resourceId);
      
      if (!result.success || !result.data) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not have permission to access this resource',
        };
      }
    }, 'requireOwnership');
  }

  /**
   * Check if user has role
   */
  async hasRole(userId: string, role: UserRole): Promise<ServiceResult<boolean>> {
    return this.execute(async () => {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      return user?.role === role;
    }, 'hasRole');
  }

  /**
   * Check if user has any of the roles
   */
  async hasAnyRole(userId: string, roles: UserRole[]): Promise<ServiceResult<boolean>> {
    return this.execute(async () => {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      return roles.includes(user?.role as UserRole);
    }, 'hasAnyRole');
  }
}
