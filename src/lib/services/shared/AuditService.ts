/**
 * Audit Service
 * Handles audit logging for all system actions
 */

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export interface AuditLogEntry {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  /**
   * Log an audit entry
   */
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: entry.userId,
          action: entry.action,
          entity: entry.entity,
          entityId: entry.entityId,
          ...(entry.metadata && { metadata: entry.metadata as Prisma.InputJsonValue }),
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
        },
      });
    } catch (error) {
      // Don't throw - audit logging should not break the main operation
      console.error('[AuditService] Failed to log audit entry:', error);
    }
  }

  /**
   * Get audit logs for a specific entity
   */
  async getEntityLogs(entity: string, entityId: string, limit = 50) {
    return prisma.auditLog.findMany({
      where: {
        entity,
        entityId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Get audit logs for a specific user
   */
  async getUserLogs(userId: string, limit = 50) {
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
   * Search audit logs
   */
  async search(filters: {
    userId?: string;
    entity?: string;
    entityId?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) {
    const where: Record<string, unknown> = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.entity) where.entity = filters.entity;
    if (filters.entityId) where.entityId = filters.entityId;
    if (filters.action) where.action = filters.action;

    if (filters.startDate || filters.endDate) {
      where.createdAt = {
        ...(filters.startDate && { gte: filters.startDate }),
        ...(filters.endDate && { lte: filters.endDate }),
      };
    }

    return prisma.auditLog.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: filters.limit || 100,
    });
  }
}
