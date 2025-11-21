import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

// GET /compvss/credentials/upload
export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.PUBLIC_ENDPOINT.limit,
      RATE_LIMITS.PUBLIC_ENDPOINT.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const uploads = await prisma.credential.findMany({
      where: { userId: context.userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return successResponse({ uploads });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /compvss/credentials/upload
export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.WRITE_OPERATIONS.limit,
      RATE_LIMITS.WRITE_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const body = await request.json();
    const { type, name, fileUrl, metadata } = body;

    const credential = await prisma.credential.create({
      data: {
        userId: context.userId,
        type,
        name: metadata?.name || `${type} Credential`,
        fileUrl,
        metadata,
        verified: false,
      },
    });

    return successResponse({ credential });
  } catch (error) {
    return handleApiError(error);
  }
}
