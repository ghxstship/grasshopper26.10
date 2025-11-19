import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, createdResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, getPaginationParams, rateLimit, getClientIdentifier } from '@/lib/api/middleware';
import { createAdventureSchema } from '@/lib/validations/adventures';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { AdventuresService } from '@/lib/services/adventures.service';


export async function GET(request: NextRequest) {
  try {
    // Rate limiting - public endpoint
    const identifier = getClientIdentifier(request);
    if (
      !rateLimit(
        RateLimitIdentifiers.byIP(identifier),
        RATE_LIMITS.PUBLIC_ENDPOINT.limit,
        RATE_LIMITS.PUBLIC_ENDPOINT.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(request);
    
    const where: Record<string, unknown> = {};
    const eventId = searchParams.get('eventId');
    const type = searchParams.get('type');
    
    if (eventId) where.eventId = eventId;
    if (type) where.type = type;

    const [adventures, total] = await Promise.all([
      prisma.adventure.findMany({
        where: where as never,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          event: {
            select: {
              id: true,
              name: true,
              startDate: true,
            },
          },
          _count: {
            select: { bookings: true },
          },
        },
      }),
      prisma.adventure.count({ where }),
    ]);

    return successResponse(adventures, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
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

    const body = await request.json();
    const validatedData = createAdventureSchema.parse(body);
    
    const adventure = await new AdventuresService().create({
      data: validatedData as any,
      include: {
        event: true,
      },
    });

    return createdResponse(adventure);
  } catch (error) {
    return handleApiError(error);
  }
}
