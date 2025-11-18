import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { sign } from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
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
    const accessToken = sign(
      {
        userId: session.user.id,
        email: session.user.email,
        role: session.user.role,
      },
      process.env.JWT_SECRET || 'fallback-secret',
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
