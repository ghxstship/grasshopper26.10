/**
 * ATLVS Project Service
 * Handles all project management operations
 */

import { prisma } from '@/lib/prisma';
import { ProjectStatus, Priority, Prisma } from '@prisma/client';
import { AuditService } from '../shared/audit.service';

export class ProjectService {
  /**
   * Get all projects with filtering and pagination
   */
  static async getAll(params: {
    organizationId?: string;
    status?: ProjectStatus;
    priority?: Priority;
    createdBy?: string;
    page?: number;
    limit?: number;
  }) {
    const { organizationId, status, priority, createdBy, page = 1, limit = 20 } = params;

    const where: Prisma.ProjectWhereInput = {
      ...(organizationId && { organizationId }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(createdBy && { createdBy }),
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              tasks: true,
              milestones: true,
              budgets: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single project by ID
   */
  static async getById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        organization: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        phases: {
          orderBy: { order: 'asc' },
        },
        milestones: {
          orderBy: { dueDate: 'asc' },
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10, // Latest 10 tasks
        },
        budgets: true,
        documents: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  }

  /**
   * Create a new project
   */
  static async create(data: {
    organizationId: string;
    name: string;
    slug: string;
    description?: string;
    priority?: Priority;
    startDate?: Date;
    endDate?: Date;
    budget?: number;
    createdBy: string;
    metadata?: Prisma.JsonValue;
  }) {
    const project = await prisma.project.create({
      data: {
        ...data,
        status: ProjectStatus.PLANNING,
        priority: data.priority || Priority.MEDIUM,
        spent: 0,
      },
      include: {
        organization: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await AuditService.log({
      userId: data.createdBy,
      action: 'CREATE',
      entity: 'Project',
      entityId: project.id,
      metadata: { name: data.name, organizationId: data.organizationId },
    });

    return project;
  }

  /**
   * Update a project
   */
  static async update(
    id: string,
    userId: string,
    data: Partial<{
      name: string;
      description: string;
      status: ProjectStatus;
      priority: Priority;
      startDate: Date;
      endDate: Date;
      budget: number;
      metadata: Prisma.JsonValue;
    }>
  ) {
    const updated = await prisma.project.update({
      where: { id },
      data,
      include: {
        organization: true,
        creator: {
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
      entity: 'Project',
      entityId: id,
      metadata: data as Record<string, unknown>,
    });

    return updated;
  }

  /**
   * Delete a project
   */
  static async delete(id: string, userId: string) {
    await prisma.project.delete({
      where: { id },
    });

    await AuditService.log({
      userId,
      action: 'DELETE',
      entity: 'Project',
      entityId: id,
    });

    return { success: true };
  }

  /**
   * Get project timeline
   */
  static async getTimeline(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        phases: {
          orderBy: { order: 'asc' },
        },
        milestones: {
          orderBy: { dueDate: 'asc' },
        },
        tasks: {
          where: {
            dueDate: { not: null },
          },
          orderBy: { dueDate: 'asc' },
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return {
      project: {
        id: project.id,
        name: project.name,
        startDate: project.startDate,
        endDate: project.endDate,
      },
      phases: project.phases,
      milestones: project.milestones,
      tasks: project.tasks,
    };
  }

  /**
   * Get project budget summary
   */
  static async getBudgetSummary(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        budgets: {
          include: {
            categories: true,
            expenses: true,
          },
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const totalBudget = project.budgets.reduce((sum, b) => sum + Number(b.amount), 0);
    const totalSpent = project.budgets.reduce((sum, b) => sum + Number(b.spent), 0);
    const remaining = totalBudget - totalSpent;
    const percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {
      totalBudget,
      totalSpent,
      remaining,
      percentUsed,
      budgets: project.budgets.map((budget) => ({
        id: budget.id,
        name: budget.name,
        amount: Number(budget.amount),
        spent: Number(budget.spent),
        remaining: Number(budget.amount) - Number(budget.spent),
        categories: budget.categories,
        expenseCount: budget.expenses.length,
      })),
    };
  }

  /**
   * Get project team members
   */
  static async getTeam(id: string) {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: id,
        assigneeId: { not: null },
      },
      select: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      distinct: ['assigneeId'],
    });

    const uniqueMembers = tasks
      .map((t) => t.assignee)
      .filter((member): member is NonNullable<typeof member> => member !== null);

    return uniqueMembers;
  }

  /**
   * Get project analytics
   */
  static async getAnalytics(id: string) {
    const [project, taskStats, budgetStats] = await Promise.all([
      prisma.project.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              tasks: true,
              milestones: true,
              documents: true,
            },
          },
        },
      }),
      prisma.task.groupBy({
        by: ['status'],
        where: { projectId: id },
        _count: true,
      }),
      this.getBudgetSummary(id),
    ]);

    if (!project) {
      throw new Error('Project not found');
    }

    const completedMilestones = await prisma.milestone.count({
      where: {
        projectId: id,
        completed: true,
      },
    });

    return {
      project: {
        id: project.id,
        name: project.name,
        status: project.status,
        priority: project.priority,
      },
      counts: {
        tasks: project._count.tasks,
        milestones: project._count.milestones,
        completedMilestones,
        documents: project._count.documents,
      },
      taskBreakdown: taskStats,
      budget: budgetStats,
    };
  }
}
