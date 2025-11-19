import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { z } from 'zod';
import { CompvssService } from '@/lib/services/compvss/qr/scan.service';



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
    const { code } = body;

    const qrCode = await new CompvssService().findById({
      where: { code },
    });

    if (!qrCode) {
      throw errors.notFound('QR code not found');
    }

    if (!qrCode.active) {
      throw errors.badRequest('QR code is inactive');
    }

    if (qrCode.expiresAt && qrCode.expiresAt < new Date()) {
      throw errors.badRequest('QR code has expired');
    }

    // Increment scan count
    await new CompvssService().update({
      where: { code },
      data: { scans: { increment: 1 } },
    });

    return successResponse(qrCode);
  } catch (error) {
    return handleApiError(error);
  }
}
