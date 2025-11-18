/**
 * GVTEWAY Membership Service
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { AuditService } from '../shared/audit.service';

export class MembershipService {
  static async getAll(params: {
    status?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }) {
    const { userId, status, page = 1, limit = 20 } = params;

    const where: Prisma.MembershipWhereInput = {
      ...(userId && { userId }),
      ...(status && { status: status as any }),
    };

    const [memberships, total] = await Promise.all([
      prisma.membership.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tier: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.membership.count({ where }),
    ]);

    return {
      memberships,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string) {
    const membership = await prisma.membership.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tier: true,
      },
    });

    if (!membership) {
      throw new Error('Membership not found');
    }

    return membership;
  }

  static async getUserMembership(userId: string) {
    return prisma.membership.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: {
        tier: true,
      },
    });
  }

  static async create(data: {
    userId: string;
    tierId: string;
    startDate: Date;
    endDate: Date;
    price: number;
  }) {
    const membership = await prisma.membership.create({
      data: {
        userId: data.userId,
        tierId: data.tierId,
        startDate: data.startDate,
        endDate: data.endDate,
        price: data.price,
        status: 'ACTIVE',
      },
      include: {
        tier: true,
      },
    });

    await AuditService.log({
      userId: data.userId,
      action: 'CREATE',
      entity: 'Membership',
      entityId: membership.id,
      metadata: { tierId: data.tierId, price: data.price },
    });

    return membership;
  }

  static async cancel(id: string, userId: string) {
    const cancelled = await prisma.membership.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });

    await AuditService.log({
      userId,
      action: 'CANCEL',
      entity: 'Membership',
      entityId: id,
    });

    return cancelled;
  }

  static async renew(id: string, endDate: Date) {
    return prisma.membership.update({
      where: { id },
      data: {
        endDate,
        status: 'ACTIVE',
      },
    });
  }

  static async checkExpired() {
    const now = new Date();

    await prisma.membership.updateMany({
      where: {
        endDate: { lt: now },
        status: 'ACTIVE',
      },
      data: {
        status: 'EXPIRED',
      },
    });
  }
}
