/**
 * ATLVS Advancing Service
 * Handles all advancing request operations for internal team
 */

import { prisma } from '@/lib/prisma';
import { Prisma, AdvancingCategory, AdvancingStatus, Priority } from '@prisma/client';
import { BaseService } from '../base/BaseService';
import { AuditService } from '../shared/audit.service';

type JsonValue = Prisma.JsonValue;

export class AdvancingService extends BaseService {
  /**
   * Get all advancing requests with filtering and pagination
   */
  static async getAll(params: {
    userId?: string;
    status?: AdvancingStatus;
    category?: AdvancingCategory;
    priority?: Priority;
    page?: number;
    limit?: number;
  }) {
    const { userId, status, category, priority, page = 1, limit = 20 } = params;

    const where: Prisma.AdvancingRequestWhereInput = {
      ...(userId && { userId }),
      ...(status && { status }),
      ...(category && { category }),
      ...(priority && { priority }),
    };

    const [requests, total] = await Promise.all([
      prisma.advancingRequest.findMany({
        where,
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
              request: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          result: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.advancingRequest.count({ where }),
    ]);

    return {
      requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single advancing request by ID
   */
  static async getById(id: string, userId?: string) {
    const request = await prisma.advancingRequest.findUnique({
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
        approvers: true,
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
      throw new Error('Advancing request not found');
    }

    // Check permissions if userId provided
    if (userId && request.userId !== userId) {
      // Permission check would go here
      // For now, allow if user has access to the event
    }

    return request;
  }

  /**
   * Create a new advancing request
   */
  static async create(data: {
    userId: string;
    eventId?: string;
    category: AdvancingCategory;
    title: string;
    description?: string;
    priority?: Priority;
    dueDate?: Date;
    metadata?: JsonValue;
    submission?: JsonValue;
  }) {
    const { userId, submission, ...requestData } = data;

    // Create the main request
    const request = await prisma.advancingRequest.create({
      data: {
        ...requestData,
        userId,
        status: AdvancingStatus.PENDING,
        priority: requestData.priority || Priority.MEDIUM,
        metadata: requestData.metadata ? (requestData.metadata as Prisma.InputJsonValue) : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create category-specific submission if provided
    if (submission) {
      await this.createSubmission(request.id, data.category, submission);
    }

    // Log audit trail
    await AuditService.log({
      userId,
      action: 'CREATE',
      entity: 'AdvancingRequest',
      entityId: request.id,
      metadata: { category: data.category, title: data.title },
    });

    return request;
  }

  /**
   * Update an advancing request
   */
  static async update(
    id: string,
    userId: string,
    data: Partial<{
      title: string;
      description: string;
      priority: Priority;
      dueDate: Date;
      metadata: JsonValue;
    }>
  ) {
    // Check if request exists and user has permission
    const existing = await this.getById(id, userId);

    if (existing.userId !== userId) {
      throw new Error('Unauthorized to update this request');
    }

    if (existing.status !== AdvancingStatus.PENDING && existing.status !== AdvancingStatus.CHANGES_REQUESTED) {
      throw new Error('Cannot update request in current status');
    }

    const updated = await prisma.advancingRequest.update({
      where: { id },
      data: {
        ...data,
        metadata: data.metadata ? (data.metadata as Prisma.InputJsonValue) : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await AuditService.log({
      userId,
      action: 'UPDATE',
      entity: 'AdvancingRequest',
      entityId: id,
      metadata: data,
    });

    return updated;
  }

  /**
   * Update request status
   */
  static async getUserRole(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    return user?.role || 'reviewer';
  }

  static async updateStatus(
    id: string,
    userId: string,
    status: AdvancingStatus,
    comments?: string
  ) {
    const request = await this.getById(id);

    // Validate status transition
    this.validateStatusTransition(request.status, status);

    const updates: Prisma.AdvancingRequestUpdateInput = {
      status,
    };

    if (status === AdvancingStatus.UNDER_REVIEW) {
      updates.reviewedAt = new Date();
    } else if (status === AdvancingStatus.APPROVED) {
      updates.approvedAt = new Date();
    }

    const updated = await prisma.advancingRequest.update({
      where: { id },
      data: updates,
    });

    // Create approver record
    await prisma.advancingApprover.create({
      data: {
        requestId: id,
        userId,
        role: await this.getUserRole(userId),
        approved: status === AdvancingStatus.APPROVED,
        comments,
        reviewedAt: new Date(),
      },
    });

    await AuditService.log({
      userId,
      action: 'STATUS_UPDATE',
      entity: 'AdvancingRequest',
      entityId: id,
      metadata: { from: request.status, to: status, comments },
    });

    return updated;
  }

  /**
   * Delete an advancing request
   */
  static async delete(id: string, userId: string) {
    const request = await this.getById(id, userId);

    if (request.userId !== userId) {
      throw new Error('Unauthorized to delete this request');
    }

    if (request.status !== AdvancingStatus.PENDING) {
      throw new Error('Cannot delete request that is not pending');
    }

    await prisma.advancingRequest.delete({
      where: { id },
    });

    await AuditService.log({
      userId,
      action: 'DELETE',
      entity: 'AdvancingRequest',
      entityId: id,
    });

    return { success: true };
  }

  /**
   * Get request history/audit trail
   */
  static async getHistory(id: string) {
    const history = await AuditService.getEntityHistory('AdvancingRequest', id);
    return history;
  }

  /**
   * Create category-specific submission
   */
  private static async createSubmission(
    requestId: string,
    category: AdvancingCategory,
    data: JsonValue
  ) {
    const submissionData = { requestId, ...(data as object) } as any;
    
    switch (category) {
      case AdvancingCategory.ACCESS_CREDENTIALS:
        return prisma.accessSubmission.create({ data: submissionData });
      case AdvancingCategory.SITE_INFRASTRUCTURE:
        return prisma.infrastructureSubmission.create({ data: submissionData });
      case AdvancingCategory.SITE_ASSETS:
        return prisma.assetSubmission.create({ data: submissionData });
      case AdvancingCategory.SITE_UTILITIES:
        return prisma.utilitySubmission.create({ data: submissionData });
      case AdvancingCategory.SITE_VEHICLES:
        return prisma.vehicleSubmission.create({ data: submissionData });
      case AdvancingCategory.HEAVY_EQUIPMENT:
        return prisma.equipmentSubmission.create({ data: submissionData });
      case AdvancingCategory.TECHNICAL_PRODUCTION:
        return prisma.technicalSubmission.create({ data: submissionData });
      case AdvancingCategory.HOSPITALITY:
        return prisma.hospitalitySubmission.create({ data: submissionData });
      case AdvancingCategory.TRAVEL_LODGING:
        return prisma.travelSubmission.create({ data: submissionData });
      case AdvancingCategory.LOGISTICS:
        // Logistics uses the same submission model as travel for now
        // TODO: Create dedicated LogisticsSubmission model if needed
        return prisma.travelSubmission.create({ data: submissionData });
      default:
        throw new Error(`Unknown category: ${category}`);
    }
  }

  /**
   * Validate status transition
   */
  private static validateStatusTransition(from: AdvancingStatus, to: AdvancingStatus) {
    const validTransitions: Record<AdvancingStatus, AdvancingStatus[]> = {
      [AdvancingStatus.PENDING]: [
        AdvancingStatus.UNDER_REVIEW,
        AdvancingStatus.REJECTED,
      ],
      [AdvancingStatus.UNDER_REVIEW]: [
        AdvancingStatus.APPROVED,
        AdvancingStatus.REJECTED,
        AdvancingStatus.CHANGES_REQUESTED,
      ],
      [AdvancingStatus.CHANGES_REQUESTED]: [
        AdvancingStatus.UNDER_REVIEW,
        AdvancingStatus.REJECTED,
      ],
      [AdvancingStatus.APPROVED]: [AdvancingStatus.COMPLETED],
      [AdvancingStatus.REJECTED]: [],
      [AdvancingStatus.COMPLETED]: [],
    };

    if (!validTransitions[from].includes(to)) {
      throw new Error(`Invalid status transition from ${from} to ${to}`);
    }
  }

  /**
   * Get analytics for advancing requests
   */
  static async getAnalytics(params: {
    startDate?: Date;
    endDate?: Date;
    category?: AdvancingCategory;
  }) {
    const { startDate, endDate, category } = params;

    const where: Prisma.AdvancingRequestWhereInput = {
      ...(startDate && { createdAt: { gte: startDate } }),
      ...(endDate && { createdAt: { lte: endDate } }),
      ...(category && { category }),
    };

    const [
      totalRequests,
      statusBreakdown,
      categoryBreakdown,
      priorityBreakdown,
      avgProcessingTime,
    ] = await Promise.all([
      prisma.advancingRequest.count({ where }),
      prisma.advancingRequest.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      prisma.advancingRequest.groupBy({
        by: ['category'],
        where,
        _count: true,
      }),
      prisma.advancingRequest.groupBy({
        by: ['priority'],
        where,
        _count: true,
      }),
      this.calculateAvgProcessingTime(where),
    ]);

    return {
      totalRequests,
      statusBreakdown,
      categoryBreakdown,
      priorityBreakdown,
      avgProcessingTime,
    };
  }

  /**
   * Calculate average processing time
   */
  private static async calculateAvgProcessingTime(where: Prisma.AdvancingRequestWhereInput) {
    const completed = await prisma.advancingRequest.findMany({
      where: {
        ...where,
        status: AdvancingStatus.COMPLETED,
        approvedAt: { not: null },
      },
      select: {
        submittedAt: true,
        approvedAt: true,
      },
    });

    if (completed.length === 0) return 0;

    const totalTime = completed.reduce((sum, req) => {
      const time = req.approvedAt!.getTime() - req.submittedAt.getTime();
      return sum + time;
    }, 0);

    return Math.round(totalTime / completed.length / (1000 * 60 * 60)); // hours
  }
}
