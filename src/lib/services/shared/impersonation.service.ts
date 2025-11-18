/**
 * Impersonation Service
 * Handles user impersonation for Legend roles
 */

import { prisma } from '@/lib/prisma';
import { Role, canImpersonate, requiresPermissionToImpersonate, isValidLegendEmail } from '@/lib/rbac/roles';
import { AuditService } from './audit.service';

export interface ImpersonationSession {
  id: string;
  impersonatorId: string;
  targetUserId: string;
  startedAt: Date;
  endedAt?: Date;
  reason?: string;
  ipAddress?: string;
}

export interface ImpersonationRequest {
  targetUserId: string;
  reason?: string;
  duration?: number; // in minutes
}

export class ImpersonationService {

  /**
   * Start impersonating a user
   */
  static async startImpersonation(
    impersonatorId: string,
    request: ImpersonationRequest,
    ipAddress?: string
  ): Promise<ImpersonationSession> {
    // Get impersonator user
    const impersonator = await prisma.user.findUnique({
      where: { id: impersonatorId },
      select: { id: true, email: true, role: true },
    });

    if (!impersonator) {
      throw new Error('Impersonator not found');
    }

    // Validate Legend email domain
    if (!isValidLegendEmail(impersonator.email)) {
      throw new Error('Impersonation requires @ghxstship.pro email domain');
    }

    // Check if role can impersonate
    if (!canImpersonate(impersonator.role as Role)) {
      throw new Error('User role does not have impersonation privileges');
    }

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id: request.targetUserId },
      select: { id: true, email: true, role: true },
    });

    if (!targetUser) {
      throw new Error('Target user not found');
    }

    // Check if permission is required
    if (requiresPermissionToImpersonate(impersonator.role as Role)) {
      // Check if target user has granted permission
      const permission = await prisma.impersonationPermission.findFirst({
        where: {
          userId: request.targetUserId,
          grantedToId: impersonatorId,
          expiresAt: {
            gte: new Date(),
          },
        },
      });

      if (!permission) {
        throw new Error('Impersonation permission not granted by target user');
      }
    }

    // Create impersonation session
    const session = await prisma.impersonationSession.create({
      data: {
        impersonatorId,
        targetUserId: request.targetUserId,
        reason: request.reason,
        ipAddress,
        expiresAt: request.duration
          ? new Date(Date.now() + request.duration * 60 * 1000)
          : undefined,
      },
    });

    // Log audit event
    await AuditService.log({
      userId: impersonatorId,
      action: 'impersonation.started',
      resource: 'user',
      resourceId: request.targetUserId,
      metadata: {
        targetEmail: targetUser.email,
        reason: request.reason,
        ipAddress,
      },
    });

    return {
      id: session.id,
      impersonatorId: session.impersonatorId,
      targetUserId: session.targetUserId,
      startedAt: session.startedAt,
      reason: session.reason || undefined,
      ipAddress: session.ipAddress || undefined,
    };
  }

  /**
   * End impersonation session
   */
  static async endImpersonation(sessionId: string): Promise<void> {
    const session = await prisma.impersonationSession.findUnique({
      where: { id: sessionId },
      include: {
        impersonator: { select: { id: true, email: true } },
        targetUser: { select: { id: true, email: true } },
      },
    });

    if (!session) {
      throw new Error('Impersonation session not found');
    }

    if (session.endedAt) {
      throw new Error('Impersonation session already ended');
    }

    // Update session
    await prisma.impersonationSession.update({
      where: { id: sessionId },
      data: { endedAt: new Date() },
    });

    // Log audit event
    await AuditService.log({
      userId: session.impersonatorId,
      action: 'impersonation.ended',
      resource: 'user',
      resourceId: session.targetUserId,
      metadata: {
        targetEmail: session.targetUser.email,
        duration: Date.now() - session.startedAt.getTime(),
      },
    });
  }

  /**
   * Get active impersonation session for user
   */
  static async getActiveSession(impersonatorId: string): Promise<ImpersonationSession | null> {
    const session = await prisma.impersonationSession.findFirst({
      where: {
        impersonatorId,
        endedAt: null,
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } },
        ],
      },
      orderBy: { startedAt: 'desc' },
    });

    if (!session) {
      return null;
    }

    return {
      id: session.id,
      impersonatorId: session.impersonatorId,
      targetUserId: session.targetUserId,
      startedAt: session.startedAt,
      endedAt: session.endedAt || undefined,
      reason: session.reason || undefined,
      ipAddress: session.ipAddress || undefined,
    };
  }

  /**
   * Grant impersonation permission to another user
   */
  static async grantPermission(
    userId: string,
    grantedToId: string,
    expiresInDays: number = 30
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    await prisma.impersonationPermission.create({
      data: {
        userId,
        grantedToId,
        expiresAt,
      },
    });

    // Log audit event
    await AuditService.log({
      userId,
      action: 'impersonation.permission_granted',
      resource: 'user',
      resourceId: grantedToId,
      metadata: {
        expiresAt: expiresAt.toISOString(),
      },
    });
  }

  /**
   * Revoke impersonation permission
   */
  static async revokePermission(userId: string, grantedToId: string): Promise<void> {
    await prisma.impersonationPermission.deleteMany({
      where: {
        userId,
        grantedToId,
      },
    });

    // Log audit event
    await AuditService.log({
      userId,
      action: 'impersonation.permission_revoked',
      resource: 'user',
      resourceId: grantedToId,
    });
  }

  /**
   * Get all active permissions for a user
   */
  static async getPermissions(userId: string) {
    return prisma.impersonationPermission.findMany({
      where: {
        userId,
        expiresAt: {
          gte: new Date(),
        },
      },
      include: {
        grantedTo: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Get impersonation history for a user
   */
  static async getHistory(userId: string, limit: number = 50) {
    return prisma.impersonationSession.findMany({
      where: {
        OR: [
          { impersonatorId: userId },
          { targetUserId: userId },
        ],
      },
      include: {
        impersonator: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        targetUser: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { startedAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Validate if impersonation is allowed
   */
  static async validateImpersonation(
    impersonatorId: string,
    targetUserId: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    // Get impersonator
    const impersonator = await prisma.user.findUnique({
      where: { id: impersonatorId },
      select: { email: true, role: true },
    });

    if (!impersonator) {
      return { allowed: false, reason: 'Impersonator not found' };
    }

    // Check email domain
    if (!isValidLegendEmail(impersonator.email)) {
      return { allowed: false, reason: 'Invalid email domain' };
    }

    // Check role permissions
    if (!canImpersonate(impersonator.role as Role)) {
      return { allowed: false, reason: 'Role does not have impersonation privileges' };
    }

    // Check if permission is required
    if (requiresPermissionToImpersonate(impersonator.role as Role)) {
      const permission = await prisma.impersonationPermission.findFirst({
        where: {
          userId: targetUserId,
          grantedToId: impersonatorId,
          expiresAt: {
            gte: new Date(),
          },
        },
      });

      if (!permission) {
        return { allowed: false, reason: 'Permission not granted' };
      }
    }

    return { allowed: true };
  }
}
