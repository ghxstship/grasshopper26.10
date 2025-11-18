/**
 * COMPVSS Issue Service
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { AuditService } from '../shared/audit.service';

export class IssueService {
  static async getAll(params: {
    organizationId?: string;
    status?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }) {
    const { organizationId, status, priority, page = 1, limit = 20 } = params;

    const where: Prisma.IssueReportWhereInput = {
      ...(organizationId && { organizationId }),
      ...(status && { status: status as any }),
      ...(priority && { priority: priority as any }),
    };

    const [issues, total] = await Promise.all([
      prisma.issueReport.findMany({
        where,
        include: {
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.issueReport.count({ where }),
    ]);

    return {
      issues,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string) {
    const issue = await prisma.issueReport.findUnique({
      where: { id },
      include: {
        organization: true,
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!issue) {
      throw new Error('Issue not found');
    }

    return issue;
  }

  static async create(data: {
    organizationId: string;
    title: string;
    description: string;
    priority: string;
    assignedToId?: string;
    createdBy: string;
  }) {
    const issue = await prisma.issueReport.create({
      data: {
        userId: data.createdBy,
        organizationId: data.organizationId,
        title: data.title,
        description: data.description,
        priority: data.priority as any,
        assignedToId: data.assignedToId,
        status: 'OPEN',
      },
    });

    await AuditService.log({
      userId: data.createdBy,
      action: 'CREATE',
      entity: 'Issue',
      entityId: issue.id,
      metadata: { title: data.title, priority: data.priority },
    });

    return issue;
  }

  static async update(
    id: string,
    userId: string,
    data: Partial<{
      title: string;
      description: string;
      priority: string;
      status: string;
      assignedToId: string;
    }>
  ) {
    const updated = await prisma.issueReport.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.priority && { priority: data.priority as any }),
        ...(data.status && { status: data.status as any }),
        ...(data.assignedToId !== undefined && { assignedToId: data.assignedToId }),
      },
    });

    await AuditService.log({
      userId,
      action: 'UPDATE',
      entity: 'Issue',
      entityId: id,
      metadata: data as Record<string, unknown>,
    });

    return updated;
  }

  static async resolve(id: string, userId: string, resolution: string) {
    const resolved = await prisma.issueReport.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        metadata: { resolution },
      },
    });

    await AuditService.log({
      userId,
      action: 'RESOLVE',
      entity: 'Issue',
      entityId: id,
      metadata: { resolution },
    });

    return resolved;
  }

  static async delete(id: string, userId: string) {
    await prisma.issueReport.delete({
      where: { id },
    });

    await AuditService.log({
      userId,
      action: 'DELETE',
      entity: 'Issue',
      entityId: id,
    });

    return { success: true };
  }
}
