import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, getPaginationParams } from '@/lib/api/middleware';
import type { Prisma } from '@prisma/client';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { EventsService } from "@/lib/services/search/events.service";
import { errors } from '@/lib/api/errors';



export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byIP(getClientIdentifier(request)),
        RATE_LIMITS.PUBLIC_ENDPOINT.limit,
        RATE_LIMITS.PUBLIC_ENDPOINT.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    await validateRequest(request);

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(request);
    
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');

    const where: Prisma.EventWhereInput = {
      OR: query ? [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
      ] : undefined,
    };

    if (category) where.categoryId = category;
    if (status) where.status = status as Prisma.EnumEventStatusFilter;
    if (featured === 'true') where.featured = true;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'asc' },
        include: {
          organization: { select: { id: true, name: true } },
          category: { select: { id: true, name: true } },
          venue: { select: { id: true, name: true, city: true } },
          _count: { select: { tickets: true } },
        },
      }),
      prisma.event.count({ where }),
    ]);

    return successResponse(events, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
