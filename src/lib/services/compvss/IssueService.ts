/**
 * COMPVSS Issue Service
 * Handles issue reporting and tracking for external teams
 */

import { BaseService, ServiceResult, PaginationOptions, PaginatedResult } from '../base/BaseService';
import { Prisma, IssueStatus, Priority } from '@prisma/client';
import { NotificationService } from '../shared/NotificationService';

export interface CreateIssueInput {
  userId: string;
  title: string;
  description: string;
  priority?: Priority;
  category?: string;
  location?: string;
  images?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateIssueInput {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: IssueStatus;
  category?: string;
  location?: string;
  assignedTo?: string;
  metadata?: Record<string, unknown>;
}

export interface IssueFilters {
  userId?: string;
  status?: IssueStatus;
  priority?: Priority;
  category?: string;
  location?: string;
  assignedTo?: string;
  search?: string;
}

export class IssueService extends BaseService {
  private notificationService: NotificationService;

  constructor() {
    super();
    this.notificationService = new NotificationService();
  }

  /**
   * Create a new issue report
   */
  async create(input: CreateIssueInput): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      this.validateRequired(input as unknown as Record<string, unknown>, [
        'userId',
        'title',
        'description',
      ]);

      const issue = await this.prisma.issueReport.create({
        data: {
          userId: input.userId,
          title: input.title,
          description: input.description,
          priority: input.priority || Priority.MEDIUM,
          status: IssueStatus.OPEN,
          category: input.category,
          location: input.location,
          images: input.images || [],
          metadata: input.metadata as Prisma.InputJsonValue,
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

      await this.logAudit(input.userId, 'CREATE', 'IssueReport', issue.id, {
        title: input.title,
        priority: input.priority,
      });

      return issue;
    }, 'create');
  }

  /**
   * Get issue by ID
   */
  async getById(id: string, userId?: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const issue = await this.prisma.issueReport.findUnique({
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

      if (!issue) {
        throw {
          name: 'NotFoundError',
          message: 'Issue not found',
        };
      }

      // Check permission if userId provided
      if (userId && issue.userId !== userId) {
        const hasPermission = await this.checkPermission(userId, 'IssueReport', 'read');
        if (!hasPermission) {
          throw {
            name: 'ForbiddenError',
            message: 'You do not have permission to view this issue',
          };
        }
      }

      return issue;
    }, 'getById');
  }

  /**
   * List issues with filters and pagination
   */
  async list(
    filters?: IssueFilters,
    pagination?: PaginationOptions
  ): Promise<ServiceResult<PaginatedResult<unknown>>> {
    return this.execute(async () => {
      const { skip, limit } = this.buildPagination(pagination);

      const where: Prisma.IssueReportWhereInput = {};

      if (filters?.userId) where.userId = filters.userId;
      if (filters?.status) where.status = filters.status;
      if (filters?.priority) where.priority = filters.priority;
      if (filters?.category) where.category = filters.category;
      if (filters?.location) where.location = filters.location;
      if (filters?.assignedTo) where.assignedTo = filters.assignedTo;

      if (filters?.search) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const [issues, total] = await Promise.all([
        this.prisma.issueReport.findMany({
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
        this.prisma.issueReport.count({ where }),
      ]);

      return this.buildPaginatedResult(issues, total, pagination);
    }, 'list');
  }

  /**
   * Update issue
   */
  async update(
    id: string,
    input: UpdateIssueInput,
    userId: string
  ): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const existing = await this.prisma.issueReport.findUnique({
        where: { id },
      });

      if (!existing) {
        throw {
          name: 'NotFoundError',
          message: 'Issue not found',
        };
      }

      if (existing.userId !== userId) {
        const hasPermission = await this.checkPermission(userId, 'IssueReport', 'update');
        if (!hasPermission) {
          throw {
            name: 'ForbiddenError',
            message: 'You do not have permission to update this issue',
          };
        }
      }

      const issue = await this.prisma.issueReport.update({
        where: { id },
        data: {
          title: input.title,
          description: input.description,
          priority: input.priority,
          status: input.status,
          category: input.category,
          location: input.location,
          assignedTo: input.assignedTo,
          resolvedAt: input.status === IssueStatus.RESOLVED ? new Date() : undefined,
          metadata: input.metadata as Prisma.InputJsonValue,
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

      await this.logAudit(userId, 'UPDATE', 'IssueReport', id, {
        changes: input,
      });

      // Notify assigned user if assignment changed
      if (input.assignedTo && input.assignedTo !== existing.assignedTo) {
        await this.notificationService.create({
          userId: input.assignedTo,
          title: 'Issue Assigned',
          message: `You have been assigned to issue: ${issue.title}`,
          type: 'ISSUE_ASSIGNED',
          actionUrl: `/compvss/issues/${id}`,
        });
      }

      return issue;
    }, 'update');
  }

  /**
   * Delete issue
   */
  async delete(id: string, userId: string): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const existing = await this.prisma.issueReport.findUnique({
        where: { id },
      });

      if (!existing) {
        throw {
          name: 'NotFoundError',
          message: 'Issue not found',
        };
      }

      if (existing.userId !== userId) {
        const hasPermission = await this.checkPermission(userId, 'IssueReport', 'delete');
        if (!hasPermission) {
          throw {
            name: 'ForbiddenError',
            message: 'You do not have permission to delete this issue',
          };
        }
      }

      await this.prisma.issueReport.delete({
        where: { id },
      });

      await this.logAudit(userId, 'DELETE', 'IssueReport', id);
    }, 'delete');
  }

  /**
   * Assign issue to user
   */
  async assign(id: string, assignedTo: string, assignedBy: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const hasPermission = await this.checkPermission(assignedBy, 'IssueReport', 'update');
      if (!hasPermission) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not have permission to assign issues',
        };
      }

      const issue = await this.prisma.issueReport.update({
        where: { id },
        data: {
          assignedTo,
          status: IssueStatus.IN_PROGRESS,
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

      await this.logAudit(assignedBy, 'ASSIGN', 'IssueReport', id, {
        assignedTo,
      });

      await this.notificationService.create({
        userId: assignedTo,
        title: 'Issue Assigned',
        message: `You have been assigned to issue: ${issue.title}`,
        type: 'ISSUE_ASSIGNED',
        actionUrl: `/compvss/issues/${id}`,
      });

      return issue;
    }, 'assign');
  }

  /**
   * Resolve issue
   */
  async resolve(id: string, userId: string, resolution?: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const issue = await this.prisma.issueReport.update({
        where: { id },
        data: {
          status: IssueStatus.RESOLVED,
          resolvedAt: new Date(),
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

      await this.logAudit(userId, 'RESOLVE', 'IssueReport', id, {
        resolution,
      });

      // Notify issue creator
      await this.notificationService.create({
        userId: issue.userId,
        title: 'Issue Resolved',
        message: `Your issue "${issue.title}" has been resolved`,
        type: 'ISSUE_RESOLVED',
        actionUrl: `/compvss/issues/${id}`,
      });

      return issue;
    }, 'resolve');
  }

  /**
   * Close issue
   */
  async close(id: string, userId: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const issue = await this.prisma.issueReport.update({
        where: { id },
        data: {
          status: IssueStatus.CLOSED,
        },
      });

      await this.logAudit(userId, 'CLOSE', 'IssueReport', id);

      return issue;
    }, 'close');
  }

  /**
   * Get issue statistics
   */
  async getStatistics(filters?: IssueFilters): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const where: Prisma.IssueReportWhereInput = {};

      if (filters?.userId) where.userId = filters.userId;
      if (filters?.category) where.category = filters.category;
      if (filters?.location) where.location = filters.location;
      if (filters?.assignedTo) where.assignedTo = filters.assignedTo;

      const [total, byStatus, byPriority, byCategory] = await Promise.all([
        this.prisma.issueReport.count({ where }),
        this.prisma.issueReport.groupBy({
          by: ['status'],
          where,
          _count: true,
        }),
        this.prisma.issueReport.groupBy({
          by: ['priority'],
          where,
          _count: true,
        }),
        this.prisma.issueReport.groupBy({
          by: ['category'],
          where,
          _count: true,
        }),
      ]);

      return {
        total,
        byStatus,
        byPriority,
        byCategory,
      };
    }, 'getStatistics');
  }

  /**
   * Get user's issues
   */
  async getUserIssues(userId: string, includeResolved = false): Promise<ServiceResult<unknown[]>> {
    return this.execute(async () => {
      const where: Prisma.IssueReportWhereInput = {
        userId,
        ...((!includeResolved && {
          status: {
            in: [IssueStatus.OPEN, IssueStatus.IN_PROGRESS],
          },
        })),
      };

      const issues = await this.prisma.issueReport.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return issues;
    }, 'getUserIssues');
  }

  /**
   * Get assigned issues
   */
  async getAssignedIssues(userId: string): Promise<ServiceResult<unknown[]>> {
    return this.execute(async () => {
      const issues = await this.prisma.issueReport.findMany({
        where: {
          assignedTo: userId,
          status: {
            in: [IssueStatus.OPEN, IssueStatus.IN_PROGRESS],
          },
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'asc' },
        ],
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

      return issues;
    }, 'getAssignedIssues');
  }
}
