import { NextRequest } from 'next/server';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { randomBytes } from 'crypto';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { CompvssService } from '@/lib/services/compvss/qr/generate.service';
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
    const { type, targetId, data, expiresAt } = body;

    // Generate unique QR code
    const code = randomBytes(16).toString('hex');

    const qrCode = await new CompvssService().create({
      data: {
        code,
        type,
        targetId,
        data,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        active: true,
      },
    });

    return successResponse({
      ...qrCode,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(code)}`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
