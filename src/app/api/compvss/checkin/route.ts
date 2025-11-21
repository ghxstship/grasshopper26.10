import { NextRequest } from 'next/server';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';
import { CompvssService as _CompvssService } from '@/lib/services/compvss/checkin.service';
import { errors } from '@/lib/api/errors';



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
    const { type, targetId, location, latitude, longitude, metadata } = body;

    const checkIn = await prisma.checkIn.create({
      data: {
        userId: context.userId!,
        type,
        targetId,
        location,
        latitude,
        longitude,
        metadata,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return successResponse(checkIn);
  } catch (error) {
    return handleApiError(error);
  }
}
