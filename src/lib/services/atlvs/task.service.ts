/**
 * ATLVS Task Service
 * Handles all task management operations
 */

import { prisma } from '@/lib/prisma';
import { TaskStatus, Priority, Prisma } from '@prisma/client';
import { AuditService } from '../shared/audit.service';

export class TaskService {
  /**
   * Get all tasks with filtering and pagination
   */
  static async getAll(params: {
    projectId?: string;
    assigneeId?: string;
    createdBy?: string;
    status?: TaskStatus;
    priority?: Priority;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { projectId, assigneeId, createdBy, status, priority, search, page = 1, limit = 20 } = params;

    const where: Prisma.TaskWhereInput = {
      ...(projectId && { projectId }),
      ...(assigneeId && { assigneeId }),
      ...(createdBy && { createdBy }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
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
              timeEntries: true,
            },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single task by ID
   */
  static async getById(id: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        dependencies: {
          include: {
            dependsOn: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },
          },
        },
        dependents: {
          include: {
            task: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },
          },
        },
        timeEntries: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }

  /**
   * Create a new task
   */
  static async create(data: {
    projectId?: string;
    title: string;
    description?: string;
    priority?: Priority;
    assigneeId?: string;
    createdBy: string;
    dueDate?: Date;
    startDate?: Date;
    estimatedHours?: number;
    tags?: string[];
    metadata?: Prisma.JsonValue;
  }) {
    const task = await prisma.task.create({
      data: {
        ...data,
        status: TaskStatus.PENDING,
        priority: data.priority || Priority.MEDIUM,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
      entity: 'Task',
      entityId: task.id,
      metadata: { title: data.title, projectId: data.projectId },
    });

    return task;
  }

  /**
   * Update a task
   */
  static async update(
    id: string,
    userId: string,
    data: Partial<{
      title: string;
      description: string;
      status: TaskStatus;
      priority: Priority;
      assigneeId: string;
      dueDate: Date;
      startDate: Date;
      estimatedHours: number;
      actualHours: number;
      tags: string[];
      metadata: Prisma.JsonValue;
    }>
  ) {
    const updated = await prisma.task.update({
      where: { id },
      data,
      include: {
        assignee: {
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
      entity: 'Task',
      entityId: id,
      metadata: data as Record<string, unknown>,
    });

    return updated;
  }

  /**
   * Delete a task
   */
  static async delete(id: string, userId: string) {
    // Check if task has dependents
    const dependents = await prisma.taskDependency.count({
      where: { dependsOnId: id },
    });

    if (dependents > 0) {
      throw new Error('Cannot delete task with dependent tasks');
    }

    await prisma.task.delete({
      where: { id },
    });

    await AuditService.log({
      userId,
      action: 'DELETE',
      entity: 'Task',
      entityId: id,
    });

    return { success: true };
  }

  /**
   * Complete a task
   */
  static async complete(id: string, userId: string) {
    const task = await this.getById(id);

    // Check if all dependencies are completed
    const incompleteDeps = task.dependencies.filter(
      (dep) => dep.dependsOn.status !== TaskStatus.COMPLETED
    );

    if (incompleteDeps.length > 0) {
      throw new Error('Cannot complete task with incomplete dependencies');
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        status: TaskStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    await AuditService.log({
      userId,
      action: 'COMPLETE',
      entity: 'Task',
      entityId: id,
    });

    return updated;
  }

  /**
   * Add task dependency
   */
  static async addDependency(taskId: string, dependsOnId: string, type = 'finish_to_start') {
    // Check for circular dependencies
    const wouldCreateCycle = await this.checkCircularDependency(taskId, dependsOnId);
    
    if (wouldCreateCycle) {
      throw new Error('Cannot create circular dependency');
    }

    const dependency = await prisma.taskDependency.create({
      data: {
        taskId,
        dependsOnId,
        type,
      },
    });

    return dependency;
  }

  /**
   * Check for circular dependencies
   */
  private static async checkCircularDependency(taskId: string, dependsOnId: string): Promise<boolean> {
    // If dependsOnId depends on taskId (directly or indirectly), it's circular
    const dependencies = await prisma.taskDependency.findMany({
      where: { taskId: dependsOnId },
      select: { dependsOnId: true },
    });

    if (dependencies.some((dep) => dep.dependsOnId === taskId)) {
      return true;
    }

    // Check transitive dependencies
    for (const dep of dependencies) {
      const isCircular = await this.checkCircularDependency(taskId, dep.dependsOnId);
      if (isCircular) return true;
    }

    return false;
  }

  /**
   * Add time entry
   */
  static async addTimeEntry(data: {
    taskId: string;
    userId: string;
    description?: string;
    hours: number;
    date: Date;
    billable?: boolean;
    metadata?: Prisma.JsonValue;
  }) {
    const entry = await prisma.timeEntry.create({
      data,
    });

    // Update task actual hours
    const task = await prisma.task.findUnique({
      where: { id: data.taskId },
      select: { actualHours: true },
    });

    const newActualHours = (task?.actualHours || 0) + data.hours;

    await prisma.task.update({
      where: { id: data.taskId },
      data: { actualHours: newActualHours },
    });

    await AuditService.log({
      userId: data.userId,
      action: 'TIME_ENTRY',
      entity: 'Task',
      entityId: data.taskId,
      metadata: { hours: data.hours, date: data.date },
    });

    return entry;
  }

  /**
   * Get task analytics
   */
  static async getAnalytics(params: {
    projectId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { projectId, startDate, endDate } = params;

    const where: Prisma.TaskWhereInput = {
      ...(projectId && { projectId }),
      ...(startDate && { createdAt: { gte: startDate } }),
      ...(endDate && { createdAt: { lte: endDate } }),
    };

    const [
      totalTasks,
      statusBreakdown,
      priorityBreakdown,
      completionRate,
      avgCompletionTime,
    ] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      prisma.task.groupBy({
        by: ['priority'],
        where,
        _count: true,
      }),
      this.calculateCompletionRate(where),
      this.calculateAvgCompletionTime(where),
    ]);

    return {
      totalTasks,
      statusBreakdown,
      priorityBreakdown,
      completionRate,
      avgCompletionTime,
    };
  }

  /**
   * Calculate completion rate
   */
  private static async calculateCompletionRate(where: Prisma.TaskWhereInput) {
    const total = await prisma.task.count({ where });
    if (total === 0) return 0;

    const completed = await prisma.task.count({
      where: {
        ...where,
        status: TaskStatus.COMPLETED,
      },
    });

    return Math.round((completed / total) * 100);
  }

  /**
   * Calculate average completion time
   */
  private static async calculateAvgCompletionTime(where: Prisma.TaskWhereInput) {
    const completed = await prisma.task.findMany({
      where: {
        ...where,
        status: TaskStatus.COMPLETED,
        completedAt: { not: null },
      },
      select: {
        createdAt: true,
        completedAt: true,
      },
    });

    if (completed.length === 0) return 0;

    const totalTime = completed.reduce((sum, task) => {
      const time = task.completedAt!.getTime() - task.createdAt.getTime();
      return sum + time;
    }, 0);

    return Math.round(totalTime / completed.length / (1000 * 60 * 60 * 24)); // days
  }
}
