/**
 * COMPVSS Affiliate Service
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { AuditService } from '../shared/audit.service';

export class AffiliateService {
  static async getAll(params: {
    organizationId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { organizationId, status, page = 1, limit = 20 } = params;

    const where: Prisma.AffiliateProfileWhereInput = {
      ...(organizationId && { organizationId }),
      ...(status && { status: status as any }),
    };

    const [affiliates, total] = await Promise.all([
      prisma.affiliateProfile.findMany({
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
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.affiliateProfile.count({ where }),
    ]);

    return {
      affiliates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string) {
    const affiliate = await prisma.affiliateProfile.findUnique({
      where: { id },
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

    if (!affiliate) {
      throw new Error('Affiliate not found');
    }

    return affiliate;
  }

  static async create(data: {
    organizationId: string;
    userId: string;
    name: string;
    email: string;
    phone?: string;
    code: string;
    commissionRate: number;
    createdBy: string;
  }) {
    const affiliate = await prisma.affiliateProfile.create({
      data: {
        organizationId: data.organizationId,
        userId: data.userId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        code: data.code,
        commissionRate: data.commissionRate,
        status: 'ACTIVE',
      },
    });

    await AuditService.log({
      userId: data.createdBy,
      action: 'CREATE',
      entity: 'Affiliate',
      entityId: affiliate.id,
      metadata: { name: data.name, code: data.code },
    });

    return affiliate;
  }

  static async update(
    id: string,
    userId: string,
    data: Partial<{
      name: string;
      email: string;
      phone: string;
      commissionRate: number;
      status: string;
    }>
  ) {
    const updated = await prisma.affiliateProfile.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.commissionRate !== undefined && { commissionRate: data.commissionRate }),
        ...(data.status && { status: data.status as any }),
      },
    });

    await AuditService.log({
      userId,
      action: 'UPDATE',
      entity: 'Affiliate',
      entityId: id,
      metadata: data as Record<string, unknown>,
    });

    return updated;
  }

  static async delete(id: string, userId: string) {
    await prisma.affiliateProfile.delete({
      where: { id },
    });

    await AuditService.log({
      userId,
      action: 'DELETE',
      entity: 'Affiliate',
      entityId: id,
    });

    return { success: true };
  }
}
