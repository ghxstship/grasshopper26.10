import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { parseBody } from '@/lib/api/middleware';
import jwt from 'jsonwebtoken';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { z } from 'zod';
import { prisma } from '@/lib/prisma';




const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

function getJWTSecrets() {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
  
  if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be configured');
  }
  
  return { JWT_SECRET, JWT_REFRESH_SECRET };
}

// POST /api/auth/refresh - Refresh access token
export async function POST(request: NextRequest) {
  try {
    const { JWT_SECRET, JWT_REFRESH_SECRET } = getJWTSecrets();
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

    const body = await parseBody(request);
    const { refreshToken } = refreshTokenSchema.parse(body);

    // Verify refresh token
    let decoded: { userId: string; email: string };
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string; email: string };
    } catch {
      throw errors.unauthorized('Invalid or expired refresh token');
    }

    // Check if user has active session
    const session = await prisma.session.findFirst({
      where: {
        userId: decoded.userId,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!session) {
      throw errors.unauthorized('Session has expired or been revoked');
    }

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.emailVerified) {
      throw errors.unauthorized('User not found or email not verified');
    }

    // Generate new access token
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    // Generate new refresh token for rotation
    const newRefreshToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // Update session expiry
    await prisma.session.update({
      where: { id: session.id },
      data: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return successResponse({
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: 900, // 15 minutes in seconds
      tokenType: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
