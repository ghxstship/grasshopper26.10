import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, getPaginationParams } from '@/lib/api/middleware';
import type { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    await validateRequest(request);

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(request);
    
    const query = searchParams.get('q') || '';

    const where: Prisma.OrganizationWhereInput = {
      OR: query ? [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ] : undefined,
    };

    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              events: true,
              projects: true,
              members: true,
            },
          },
        },
      }),
      prisma.organization.count({ where }),
    ]);

    return successResponse(organizations, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
