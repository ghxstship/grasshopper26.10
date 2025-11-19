import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { z } from 'zod';
import { CompvssService } from '@/lib/services/compvss/checkin.service';



export async function POST(request: NextRequest) {
  try {
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

    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const { type, targetId, location, latitude, longitude, metadata } = body;

    const checkIn = await new CompvssService().create({
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
