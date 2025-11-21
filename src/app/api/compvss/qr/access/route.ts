import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

// GET /compvss/qr/access
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

    const { searchParams } = new URL(request.url);
    const qrCode = searchParams.get('qrCode');

    if (!qrCode) {
      throw errors.badRequest('qrCode is required');
    }

    const ticket = await prisma.ticket.findFirst({
      where: { qrCode },
    });

    return successResponse({
      valid: !!ticket,
      ticket,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

