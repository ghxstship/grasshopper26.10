/**
 * ATLVS Advancing Service
 * Handles advancing request operations for internal teams
 */

import { BaseService, ServiceResult, PaginationOptions, PaginatedResult } from '../base/BaseService';
import { AdvancingStatus, AdvancingCategory, Priority, Prisma } from '@prisma/client';

export interface CreateAdvancingRequestInput {
  userId: string;
  eventId?: string;
  category: AdvancingCategory;
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date;
  metadata?: Record<string, unknown>;
}

export interface UpdateAdvancingRequestInput {
  title?: string;
  description?: string;
  status?: AdvancingStatus;
  priority?: Priority;
  dueDate?: Date;
  metadata?: Record<string, unknown>;
}

export interface AdvancingRequestFilters {
  userId?: string;
  eventId?: string;
  category?: AdvancingCategory;
  status?: AdvancingStatus;
  priority?: Priority;
  search?: string;
}

export class AdvancingService extends BaseService {
  /**
   * Create a new advancing request
   */
  async create(input: CreateAdvancingRequestInput): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      this.validateRequired(input as unknown as Record<string, unknown>, ['userId', 'category', 'title']);

      const request = await this.prisma.advancingRequest.create({
        data: {
          userId: input.userId,
          eventId: input.eventId,
          category: input.category,
          title: input.title,
          description: input.description,
          priority: input.priority || Priority.MEDIUM,
          dueDate: input.dueDate,
          status: AdvancingStatus.PENDING,
          metadata: input.metadata ? (input.metadata as Prisma.InputJsonValue) : undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      await this.logAudit(input.userId, 'CREATE', 'AdvancingRequest', request.id, {
        category: input.category,
        title: input.title,
      });

      return request;
    }, 'create');
  }

  /**
   * Get advancing request by ID
   */
  async getById(id: string, userId?: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const request = await this.prisma.advancingRequest.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          approvers: {
            include: {
              request: false,
            },
          },
          result: true,
          accessSubmission: true,
          infrastructureSubmission: true,
          assetSubmission: true,
          utilitySubmission: true,
          vehicleSubmission: true,
          equipmentSubmission: true,
          technicalSubmission: true,
          hospitalitySubmission: true,
          travelSubmission: true,
        },
      });

      if (!request) {
        throw {
          name: 'NotFoundError',
          message: 'Advancing request not found',
        };
      }

      // Check permission if userId provided
      if (userId && request.userId !== userId) {
        const hasPermission = await this.checkPermission(userId, 'AdvancingRequest', 'read');
        if (!hasPermission) {
          throw {
            name: 'ForbiddenError',
            message: 'You do not have permission to view this request',
          };
        }
      }

      return request;
    }, 'getById');
  }

  /**
   * List advancing requests with filters and pagination
   */
  async list(
    filters?: AdvancingRequestFilters,
    pagination?: PaginationOptions
  ): Promise<ServiceResult<PaginatedResult<unknown>>> {
    return this.execute(async () => {
      const { page: _page, limit, skip } = this.buildPagination(pagination);

      const where: Prisma.AdvancingRequestWhereInput = {};

      if (filters?.userId) where.userId = filters.userId;
      if (filters?.eventId) where.eventId = filters.eventId;
      if (filters?.category) where.category = filters.category;
      if (filters?.status) where.status = filters.status;
      if (filters?.priority) where.priority = filters.priority;

      if (filters?.search) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const [requests, total] = await Promise.all([
        this.prisma.advancingRequest.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        }),
        this.prisma.advancingRequest.count({ where }),
      ]);

      return this.buildPaginatedResult(requests, total, pagination);
    }, 'list');
  }

  /**
   * Update advancing request
   */
  async update(
    id: string,
    input: UpdateAdvancingRequestInput,
    userId: string
  ): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      // Check if request exists and user has permission
      const existing = await this.prisma.advancingRequest.findUnique({
        where: { id },
      });

      if (!existing) {
        throw {
          name: 'NotFoundError',
          message: 'Advancing request not found',
        };
      }

      if (existing.userId !== userId) {
        const hasPermission = await this.checkPermission(userId, 'AdvancingRequest', 'update');
        if (!hasPermission) {
          throw {
            name: 'ForbiddenError',
            message: 'You do not have permission to update this request',
          };
        }
      }

      const request = await this.prisma.advancingRequest.update({
        where: { id },
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          priority: input.priority,
          dueDate: input.dueDate,
          metadata: input.metadata ? (input.metadata as Prisma.InputJsonValue) : undefined,
          reviewedAt: input.status && input.status !== existing.status ? new Date() : undefined,
          approvedAt:
            input.status === AdvancingStatus.APPROVED && existing.status !== AdvancingStatus.APPROVED
              ? new Date()
              : undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      await this.logAudit(userId, 'UPDATE', 'AdvancingRequest', id, {
        changes: input,
      });

      return request;
    }, 'update');
  }

  /**
   * Delete advancing request
   */
  async delete(id: string, userId: string): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const existing = await this.prisma.advancingRequest.findUnique({
        where: { id },
      });

      if (!existing) {
        throw {
          name: 'NotFoundError',
          message: 'Advancing request not found',
        };
      }

      if (existing.userId !== userId) {
        const hasPermission = await this.checkPermission(userId, 'AdvancingRequest', 'delete');
        if (!hasPermission) {
          throw {
            name: 'ForbiddenError',
            message: 'You do not have permission to delete this request',
          };
        }
      }

      await this.prisma.advancingRequest.delete({
        where: { id },
      });

      await this.logAudit(userId, 'DELETE', 'AdvancingRequest', id);
    }, 'delete');
  }

  /**
   * Approve advancing request
   */
  async approve(id: string, userId: string, comments?: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const hasPermission = await this.checkPermission(userId, 'AdvancingRequest', 'approve');
      if (!hasPermission) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not have permission to approve requests',
        };
      }

      const request = await this.prisma.advancingRequest.update({
        where: { id },
        data: {
          status: AdvancingStatus.APPROVED,
          approvedAt: new Date(),
          reviewedAt: new Date(),
        },
      });

      // Create approver record
      await this.prisma.advancingApprover.create({
        data: {
          requestId: id,
          userId,
          role: 'Approver',
          approved: true,
          comments,
          reviewedAt: new Date(),
        },
      });

      await this.logAudit(userId, 'APPROVE', 'AdvancingRequest', id, { comments });

      return request;
    }, 'approve');
  }

  /**
   * Reject advancing request
   */
  async reject(id: string, userId: string, comments?: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const hasPermission = await this.checkPermission(userId, 'AdvancingRequest', 'approve');
      if (!hasPermission) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not have permission to reject requests',
        };
      }

      const request = await this.prisma.advancingRequest.update({
        where: { id },
        data: {
          status: AdvancingStatus.REJECTED,
          reviewedAt: new Date(),
        },
      });

      // Create approver record
      await this.prisma.advancingApprover.create({
        data: {
          requestId: id,
          userId,
          role: 'Approver',
          approved: false,
          comments,
          reviewedAt: new Date(),
        },
      });

      await this.logAudit(userId, 'REJECT', 'AdvancingRequest', id, { comments });

      return request;
    }, 'reject');
  }

  /**
   * Get request history/audit trail
   */
  async getHistory(id: string): Promise<ServiceResult<unknown[]>> {
    return this.execute(async () => {
      const logs = await this.auditService.getEntityLogs('AdvancingRequest', id);
      return logs;
    }, 'getHistory');
  }

  /**
   * Get analytics/statistics
   */
  async getAnalytics(filters?: AdvancingRequestFilters): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const where: Prisma.AdvancingRequestWhereInput = {};

      if (filters?.userId) where.userId = filters.userId;
      if (filters?.eventId) where.eventId = filters.eventId;
      if (filters?.category) where.category = filters.category;

      const [total, byStatus, byCategory, byPriority] = await Promise.all([
        this.prisma.advancingRequest.count({ where }),
        this.prisma.advancingRequest.groupBy({
          by: ['status'],
          where,
          _count: true,
        }),
        this.prisma.advancingRequest.groupBy({
          by: ['category'],
          where,
          _count: true,
        }),
        this.prisma.advancingRequest.groupBy({
          by: ['priority'],
          where,
          _count: true,
        }),
      ]);

      return {
        total,
        byStatus,
        byCategory,
        byPriority,
      };
    }, 'getAnalytics');
  }
}
