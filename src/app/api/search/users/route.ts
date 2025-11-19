import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth, getPaginationParams } from '@/lib/api/middleware';
import type { Prisma } from '@prisma/client';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { UsersService } from "@/lib/services/search/users.service";
import { errors } from '@/lib/api/errors';



export async function GET(request: NextRequest) {
  try {const context = await validateRequest(request);
    requireAuth(context);


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

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(request);
    
    const query = searchParams.get('q') || '';
    const role = searchParams.get('role');

    const where: Prisma.UserWhereInput = {
      OR: query ? [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ] : undefined,
    };

    if (role) where.role = role as Prisma.EnumUserRoleFilter;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return successResponse(users, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
