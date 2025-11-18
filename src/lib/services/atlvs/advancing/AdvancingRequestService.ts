import { prisma } from '@/lib/prisma';
import { AdvancingStatus, Priority, AdvancingCategory, Prisma } from '@prisma/client';
import { StatusService } from './StatusService';
import { HistoryService } from './HistoryService';
import { NotificationService } from './NotificationService';

export interface CreateAdvancingRequestInput {
  userId: string;
  eventId?: string;
  category: AdvancingCategory;
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date;
  metadata?: Record<string, unknown> | null;
}

export interface UpdateAdvancingRequestInput {
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date;
  metadata?: Record<string, unknown> | null;
}

export interface AdvancingRequestFilters {
  userId?: string;
  status?: AdvancingStatus;
  category?: AdvancingCategory;
  priority?: Priority;
  search?: string;
}

export class AdvancingRequestService {
  private statusService: StatusService;
  private historyService: HistoryService;
  private notificationService: NotificationService;

  constructor() {
    this.statusService = new StatusService();
    this.historyService = new HistoryService();
    this.notificationService = new NotificationService();
  }

  /**
   * Create a new advancing request
   */
  async create(input: CreateAdvancingRequestInput) {
    const request = await prisma.advancingRequest.create({
      data: {
        userId: input.userId,
        eventId: input.eventId,
        category: input.category,
        title: input.title,
        description: input.description,
        priority: input.priority || Priority.MEDIUM,
        dueDate: input.dueDate,
        status: AdvancingStatus.PENDING,
        metadata: (input.metadata as Prisma.InputJsonValue) || Prisma.JsonNull,
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

    // Create history entry
    await this.historyService.create({
      requestId: request.id,
      userId: input.userId,
      action: 'created',
      toValue: AdvancingStatus.PENDING,
      metadata: { category: input.category },
    });

    return request;
  }

  /**
   * Get request by ID with all relations
   */
  async getById(id: string) {
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
      },
    });

    if (!request) {
      throw new Error('Advancing request not found');
    }

    return request;
  }

  /**
   * List requests with filters and pagination
   */
  async list(
    filters: AdvancingRequestFilters = {},
    page: number = 1,
    limit: number = 20
  ) {
    const where: {
      userId?: string;
      status?: AdvancingStatus;
      category?: AdvancingCategory;
      priority?: Priority;
      OR?: Array<{
        title?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [requests, total] = await Promise.all([
      prisma.advancingRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.advancingRequest.count({ where }),
    ]);

    return {
      data: requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update request
   */
  async update(id: string, userId: string, input: UpdateAdvancingRequestInput) {
    const existing = await this.getById(id);

    const request = await prisma.advancingRequest.update({
      where: { id },
      data: {
        ...input,
        metadata: input.metadata ? (input.metadata as Prisma.InputJsonValue) : undefined,
      },
      include: {
        user: true,
      },
    });

    // Track changes in history
    const changes: string[] = [];
    if (input.title && input.title !== existing.title) {
      changes.push('title');
      await this.historyService.create({
        requestId: id,
        userId,
        action: 'updated_title',
        fromValue: existing.title,
        toValue: input.title,
      });
    }

    if (input.priority && input.priority !== existing.priority) {
      changes.push('priority');
      await this.historyService.create({
        requestId: id,
        userId,
        action: 'updated_priority',
        fromValue: existing.priority,
        toValue: input.priority,
      });
    }

    return request;
  }

  /**
   * Update request status with validation
   */
  async updateStatus(
    id: string,
    userId: string,
    newStatus: AdvancingStatus,
    note?: string
  ) {
    const request = await this.getById(id);

    // Validate status transition
    const isValid = await this.statusService.validateTransition(
      request.status,
      newStatus
    );

    if (!isValid) {
      throw new Error(
        `Invalid status transition from ${request.status} to ${newStatus}`
      );
    }

    const updated = await prisma.advancingRequest.update({
      where: { id },
      data: {
        status: newStatus,
        reviewedAt: newStatus === AdvancingStatus.UNDER_REVIEW ? new Date() : undefined,
        approvedAt: newStatus === AdvancingStatus.APPROVED ? new Date() : undefined,
      },
      include: {
        user: true,
      },
    });

    // Create history entry
    await this.historyService.create({
      requestId: id,
      userId,
      action: 'status_changed',
      fromValue: request.status,
      toValue: newStatus,
      metadata: note ? { note } : undefined,
    });

    return updated;
  }

  /**
   * Delete request
   */
  async delete(id: string, userId: string) {
    const request = await this.getById(id);

    // Only allow deletion by owner or admin
    if (request.userId !== userId) {
      throw new Error('Unauthorized to delete this request');
    }

    await prisma.advancingRequest.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * Submit request for review
   */
  async submitForReview(id: string, userId: string) {
    return this.updateStatus(id, userId, AdvancingStatus.UNDER_REVIEW);
  }

  /**
   * Approve request
   */
  async approve(id: string, userId: string, notes?: string) {
    return this.updateStatus(id, userId, AdvancingStatus.APPROVED, notes);
  }

  /**
   * Reject request
   */
  async reject(id: string, userId: string, reason: string) {
    return this.updateStatus(id, userId, AdvancingStatus.REJECTED, reason);
  }

  /**
   * Get request history
   */
  async getHistory(id: string) {
    return this.historyService.listByRequest(id);
  }

  /**
   * Get request statistics
   */
  async getStats(userId?: string) {
    const where = userId ? { userId } : {};

    const [total, byStatus, byPriority, byCategory] = await Promise.all([
      prisma.advancingRequest.count({ where }),
      prisma.advancingRequest.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      prisma.advancingRequest.groupBy({
        by: ['priority'],
        where,
        _count: true,
      }),
      prisma.advancingRequest.groupBy({
        by: ['category'],
        where,
        _count: true,
      }),
    ]);

    return {
      total,
      byStatus: Object.fromEntries(
        byStatus.map((s) => [s.status, s._count])
      ),
      byPriority: Object.fromEntries(
        byPriority.map((p) => [p.priority, p._count])
      ),
      byCategory: Object.fromEntries(
        byCategory.map((c) => [c.category, c._count])
      ),
    };
  }
}
