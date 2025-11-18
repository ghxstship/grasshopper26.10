/**
 * COMPVSS Team Service
 * Handles external team management for COMPVSS
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { AuditService } from '../shared/audit.service';

export class CompvssTeamService {
  /**
   * Get all teams with filtering
   */
  static async getAll(params: {
    organizationId?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { organizationId, status, search, page = 1, limit = 20 } = params;

    const where: Prisma.CompvssTeamWhereInput = {
      ...(organizationId && { organizationId }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [teams, total] = await Promise.all([
      prisma.compvssTeam.findMany({
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
      prisma.compvssTeam.count({ where }),
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

  /**
   * Get a single team by ID
   */
  static async getById(id: string) {
    const team = await prisma.compvssTeam.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });

    if (!team) {
      throw new Error('Team not found');
    }

    return team;
  }

  /**
   * Create a new team
   */
  static async create(data: {
    organizationId: string;
    name: string;
    description?: string;
    contactEmail?: string;
    contactPhone?: string;
    createdBy: string;
    metadata?: Prisma.JsonValue;
  }) {
    const team = await prisma.compvssTeam.create({
      data: {
        name: data.name,
        type: 'PRODUCTION_CREW', // Default type
        description: data.description,
        metadata: data.metadata || {},
      },
    });

    await AuditService.log({
      userId: data.createdBy,
      action: 'CREATE',
      entity: 'CompvssTeam',
      entityId: team.id,
      metadata: { name: data.name, organizationId: data.organizationId },
    });

    return team;
  }

  /**
   * Update a team
   */
  static async update(
    id: string,
    userId: string,
    data: Partial<{
      name: string;
      description: string;
      contactEmail: string;
      contactPhone: string;
      status: string;
      metadata: Prisma.JsonValue;
    }>
  ) {
    const updated = await prisma.compvssTeam.update({
      where: { id },
      data,
      include: {
        members: true,
      },
    });

    await AuditService.log({
      userId,
      action: 'UPDATE',
      entity: 'CompvssTeam',
      entityId: id,
      metadata: data as Record<string, unknown>,
    });

    return updated;
  }

  /**
   * Delete a team
   */
  static async delete(id: string, userId: string) {
    const team = await prisma.compvssTeam.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });

    if (!team) {
      throw new Error('Team not found');
    }

    if (team.members && team.members.length > 0) {
      throw new Error('Cannot delete team with active members');
    }

    await prisma.compvssTeam.delete({
      where: { id },
    });

    await AuditService.log({
      userId,
      action: 'DELETE',
      entity: 'CompvssTeam',
      entityId: id,
    });

    return { success: true };
  }

  /**
   * Add member to team
   */
  static async addMember(params: {
    teamId: string;
    userId: string;
    role: string;
    addedBy: string;
  }) {
    const { teamId, userId, role, addedBy } = params;

    const member = await prisma.teamMember.create({
      data: {
        teamId,
        userId,
        role,
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
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    await AuditService.log({
      userId: addedBy,
      action: 'ADD_MEMBER',
      entity: 'CompvssTeam',
      entityId: teamId,
      metadata: { userId, role },
    });

    return member;
  }

  /**
   * Remove member from team
   */
  static async removeMember(params: {
    teamId: string;
    userId: string;
    removedBy: string;
  }) {
    const { teamId, userId, removedBy } = params;

    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });

    await AuditService.log({
      userId: removedBy,
      action: 'REMOVE_MEMBER',
      entity: 'CompvssTeam',
      entityId: teamId,
      metadata: { userId },
    });

    return { success: true };
  }

  /**
   * Update member role
   */
  static async updateMemberRole(params: {
    teamId: string;
    userId: string;
    role: string;
    updatedBy: string;
  }) {
    const { teamId, userId, role, updatedBy } = params;

    const updated = await prisma.teamMember.update({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
      data: {
        role,
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
      userId: updatedBy,
      action: 'UPDATE_MEMBER_ROLE',
      entity: 'CompvssTeam',
      entityId: teamId,
      metadata: { userId, role },
    });

    return updated;
  }

  /**
   * Get team members
   */
  static async getMembers(teamId: string) {
    return prisma.teamMember.findMany({
      where: { teamId },
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
      orderBy: {
        joinedAt: 'desc',
      },
    });
  }

  /**
   * Get team statistics
   */
  static async getStats(teamId: string) {
    const [memberCount] = await Promise.all([
      prisma.teamMember.count({ where: { teamId } }),
    ]);

    return {
      memberCount,
    };
  }
}
