import { NextRequest } from 'next/server';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, getPaginationParams, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { OrganizationsService as _OrganizationsService } from "@/lib/services/search/organizations.service";
import { errors } from '@/lib/api/errors';



export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    
    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byUserId(context.userId),
        RATE_LIMITS.WRITE_OPERATIONS.limit,
        RATE_LIMITS.WRITE_OPERATIONS.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

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
