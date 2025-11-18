/**
 * ATLVS Team Service
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { AuditService } from '../shared/audit.service';

export class TeamService {
  static async list({ projectId, organizationId, page = 1, limit = 20 }: {
    projectId?: string;
    organizationId?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const where: Prisma.TeamWhereInput = {
      ...(projectId && { projectId }),
      ...(organizationId && { organizationId }),
    };

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        include: {
          _count: {
            select: {
              members: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.team.count({ where }),
    ]);

    return {
      teams,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string) {
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        members: {
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
        },
      },
    });

    if (!team) {
      throw new Error('Team not found');
    }

    return team;
  }

  static async create(data: {
    projectId: string;
    name: string;
    description?: string;
    createdBy: string;
  }) {
    const team = await prisma.team.create({
      data: {
        projectId: data.projectId,
        name: data.name,
        description: data.description,
      },
    });

    await AuditService.log({
      userId: data.createdBy,
      action: 'CREATE',
      entity: 'Team',
      entityId: team.id,
      metadata: { name: data.name, projectId: data.projectId },
    });

    return team;
  }

  static async update(
    id: string,
    userId: string,
    data: Partial<{
      name: string;
      description: string;
    }>
  ) {
    const updated = await prisma.team.update({
      where: { id },
      data,
    });

    await AuditService.log({
      userId,
      action: 'UPDATE',
      entity: 'Team',
      entityId: id,
      metadata: data as Record<string, unknown>,
    });

    return updated;
  }

  static async delete(id: string, userId: string) {
    await prisma.team.delete({
      where: { id },
    });

    await AuditService.log({
      userId,
      action: 'DELETE',
      entity: 'Team',
      entityId: id,
    });

    return { success: true };
  }

  static async addMember(params: {
    teamId: string;
    userId: string;
    role: string;
    addedBy: string;
  }) {
    const member = await prisma.teamMember.create({
      data: {
        teamId: params.teamId,
        userId: params.userId,
        role: params.role,
      },
    });

    await AuditService.log({
      userId: params.addedBy,
      action: 'ADD_MEMBER',
      entity: 'Team',
      entityId: params.teamId,
      metadata: { userId: params.userId, role: params.role },
    });

    return member;
  }

  static async removeMember(params: {
    teamId: string;
    userId: string;
    removedBy: string;
  }) {
    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId: params.teamId,
          userId: params.userId,
        },
      },
    });

    await AuditService.log({
      userId: params.removedBy,
      action: 'REMOVE_MEMBER',
      entity: 'Team',
      entityId: params.teamId,
      metadata: { userId: params.userId },
    });

    return { success: true };
  }
}
