import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { sign } from 'jsonwebtoken';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { prisma } from '@/lib/prisma';




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
    const { refreshToken } = body;

    if (!refreshToken) {
      throw errors.badRequest('Refresh token required');
    }

    // Verify refresh token and get session
    const session = await prisma.session.findUnique({
      where: { sessionToken: refreshToken },
      include: { user: true },
    });

    if (!session) {
      throw errors.unauthorized('Invalid refresh token');
    }

    // Check if session is expired
    if (session.expires < new Date()) {
      await prisma.session.delete({ where: { id: session.id } });
      throw errors.unauthorized('Session expired');
    }

    // Generate new JWT access token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw errors.serverError('JWT_SECRET not configured');
    }
    
    const accessToken = sign(
      {
        userId: session.user.id,
        email: session.user.email,
        role: session.user.role,
      },
      jwtSecret,
      { expiresIn: '15m' }
    );

    return successResponse({
      accessToken,
      refreshToken: session.sessionToken,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
