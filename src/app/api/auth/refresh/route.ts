import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, errors,  } from '@/lib/api/response';
import { parseBody,  } from '@/lib/api/middleware';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

// POST /api/auth/refresh - Refresh access token
export async function POST(request: NextRequest) {
  try {
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
