/**
 * ATLVS Project Service
 * Handles project management operations for internal teams
 */

import { BaseService, ServiceResult, PaginationOptions, PaginatedResult } from '../base/BaseService';
import { Prisma, ProjectStatus } from '@prisma/client';

export interface CreateProjectInput {
  userId: string;
  organizationId?: string;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  status?: ProjectStatus;
  metadata?: Record<string, unknown>;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  status?: ProjectStatus;
  metadata?: Record<string, unknown>;
}

export interface ProjectFilters {
  organizationId?: string;
  userId?: string;
  status?: ProjectStatus;
  search?: string;
}

export class ProjectService extends BaseService {
  /**
   * Create a new project
   */
  async create(input: CreateProjectInput): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      this.validateRequired(input as unknown as Record<string, unknown>, ['userId', 'name']);

      const slug = this.generateSlug(input.name);

      const project = await this.prisma.project.create({
        data: {
          createdBy: input.userId,
          organizationId: input.organizationId,
          name: input.name,
          slug,
          description: input.description,
          startDate: input.startDate,
          endDate: input.endDate,
          budget: input.budget,
          status: input.status || ProjectStatus.PLANNING,
          metadata: input.metadata as Prisma.InputJsonValue,
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          organization: true,
        },
      });

      await this.logAudit(input.userId, 'CREATE', 'Project', project.id, {
        name: input.name,
      });

      return project;
    }, 'create');
  }

  /**
   * Get project by ID
   */
  async getById(id: string, userId?: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const project = await this.prisma.project.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          organization: true,
          tasks: {
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
          documents: {
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!project) {
        throw {
          name: 'NotFoundError',
          message: 'Project not found',
        };
      }

      // Check permission if userId provided
      if (userId && project.createdBy !== userId) {
        const hasPermission = await this.checkPermission(userId, 'Project', 'read');
        if (!hasPermission) {
          throw {
            name: 'ForbiddenError',
            message: 'You do not have permission to view this project',
          };
        }
      }

      return project;
    }, 'getById');
  }

  /**
   * List projects with filters and pagination
   */
  async list(
    filters?: ProjectFilters,
    pagination?: PaginationOptions
  ): Promise<ServiceResult<PaginatedResult<unknown>>> {
    return this.execute(async () => {
      const { skip, limit } = this.buildPagination(pagination);

      const where: Prisma.ProjectWhereInput = {};

      if (filters?.organizationId) where.organizationId = filters.organizationId;
      if (filters?.userId) where.createdBy = filters.userId;
      if (filters?.status) where.status = filters.status;

      if (filters?.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const [projects, total] = await Promise.all([
        this.prisma.project.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
            organization: true,
            _count: {
              select: {
                tasks: true,
                documents: true,
              },
            },
          },
        }),
        this.prisma.project.count({ where }),
      ]);

      return this.buildPaginatedResult(projects, total, pagination);
    }, 'list');
  }

  /**
   * Update project
   */
  async update(
    id: string,
    input: UpdateProjectInput,
    userId: string
  ): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      // Check if project exists and user has permission
      const existing = await this.prisma.project.findUnique({
        where: { id },
      });

      if (!existing) {
        throw {
          name: 'NotFoundError',
          message: 'Project not found',
        };
      }

      if (existing.createdBy !== userId) {
        const hasPermission = await this.checkPermission(userId, 'Project', 'update');
        if (!hasPermission) {
          throw {
            name: 'ForbiddenError',
            message: 'You do not have permission to update this project',
          };
        }
      }

      const project = await this.prisma.project.update({
        where: { id },
        data: {
          name: input.name,
          description: input.description,
          startDate: input.startDate,
          endDate: input.endDate,
          budget: input.budget,
          status: input.status,
          metadata: input.metadata as Prisma.InputJsonValue,
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          organization: true,
        },
      });

      await this.logAudit(userId, 'UPDATE', 'Project', id, {
        changes: input,
      });

      return project;
    }, 'update');
  }

  /**
   * Delete project
   */
  async delete(id: string, userId: string): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const existing = await this.prisma.project.findUnique({
        where: { id },
      });

      if (!existing) {
        throw {
          name: 'NotFoundError',
          message: 'Project not found',
        };
      }

      if (existing.createdBy !== userId) {
        const hasPermission = await this.checkPermission(userId, 'Project', 'delete');
        if (!hasPermission) {
          throw {
            name: 'ForbiddenError',
            message: 'You do not have permission to delete this project',
          };
        }
      }

      await this.prisma.project.delete({
        where: { id },
      });

      await this.logAudit(userId, 'DELETE', 'Project', id);
    }, 'delete');
  }

  /**
   * Get project phases
   */
  async getPhases(id: string): Promise<ServiceResult<unknown[]>> {
    return this.execute(async () => {
      const phases = await this.prisma.projectPhase.findMany({
        where: { projectId: id },
        orderBy: { order: 'asc' },
      });

      return phases;
    }, 'getPhases');
  }

  /**
   * Get project milestones
   */
  async getMilestones(id: string): Promise<ServiceResult<unknown[]>> {
    return this.execute(async () => {
      const milestones = await this.prisma.milestone.findMany({
        where: { projectId: id },
        orderBy: { dueDate: 'asc' },
      });

      return milestones;
    }, 'getMilestones');
  }

  /**
   * Get project statistics
   */
  async getStatistics(id: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const [taskStats, timeStats, budgetStats] = await Promise.all([
        this.prisma.task.groupBy({
          by: ['status'],
          where: { projectId: id },
          _count: true,
        }),
        this.prisma.timeEntry.aggregate({
          where: { task: { projectId: id } },
          _sum: { hours: true },
        }),
        this.prisma.project.findUnique({
          where: { id },
          select: { budget: true },
        }),
      ]);

      return {
        tasks: taskStats,
        totalHours: timeStats._sum.hours || 0,
        budget: budgetStats?.budget || 0,
      };
    }, 'getStatistics');
  }
}
