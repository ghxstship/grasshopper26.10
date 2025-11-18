/**
 * Audit Service
 * Handles audit logging for all entities across the platform
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export interface AuditLogParams {
  userId?: string;
  action: string;
  entity?: string;
  entityType?: string;
  entityId?: string;
  resource?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  /**
   * Log an audit event
   */
  static async log(params: AuditLogParams) {
    try {
      await prisma.auditLog.create({
        data: {
          userId: params.userId,
          action: params.action,
          entity: params.entity || params.entityType || params.resource || 'unknown',
          entityId: params.entityId || params.resourceId,
          metadata: params.metadata as Prisma.JsonValue,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });
    } catch (error) {
      // Log error but don't throw - audit logging should not break main flow
      console.error('Audit log error:', error);
    }
  }

  /**
   * Log Legend role action with enhanced tracking
   */
  static async logLegendAction(params: AuditLogParams & { legendRole: string }) {
    try {
      await prisma.auditLog.create({
        data: {
          userId: params.userId,
          action: params.action,
          entity: params.entity || params.entityType || params.resource || 'legend_action',
          entityId: params.entityId || params.resourceId,
          metadata: {
            ...params.metadata,
            legendRole: params.legendRole,
            timestamp: new Date().toISOString(),
          } as Prisma.JsonValue,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });
    } catch (error) {
      console.error('Legend audit log error:', error);
    }
  }

  /**
   * Get audit history for a specific entity
   */
  static async getEntityHistory(entity: string, entityId: string) {
    return prisma.auditLog.findMany({
      where: {
        entity,
        entityId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Limit to last 100 entries
    });
  }

  /**
   * Get audit history for a user
   */
  static async getUserHistory(userId: string, limit = 50) {
    return prisma.auditLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Get recent audit logs with filtering
   */
  static async getRecent(params: {
    entity?: string;
    action?: string;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const { entity, action, userId, startDate, endDate, page = 1, limit = 50 } = params;

    const where: Prisma.AuditLogWhereInput = {
      ...(entity && { entity }),
      ...(action && { action }),
      ...(userId && { userId }),
      ...(startDate && { createdAt: { gte: startDate } }),
      ...(endDate && { createdAt: { lte: endDate } }),
    };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Delete old audit logs (data retention)
   */
  static async cleanup(daysToKeep = 365) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return result.count;
  }
}
