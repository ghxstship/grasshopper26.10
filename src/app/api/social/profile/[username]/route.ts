import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, rateLimit, getClientIdentifier } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

// GET /api/social/profile/[username] - Get user profile by username
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const clientIp = getClientIdentifier(request);
    
    if (!rateLimit(
      RateLimitIdentifiers.byIP(clientIp),
      RATE_LIMITS.PUBLIC_ENDPOINT.limit,
      RATE_LIMITS.PUBLIC_ENDPOINT.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const profile = await prisma.user.findFirst({
      where: { name: username },
      select: {
        id: true,
        name: true,
        email: false,
        image: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            following: true,
            followers: true,
          },
        },
      },
    });

    if (!profile) {
      throw errors.notFound('User not found');
    }

    // Check if current user is following this profile
    let isFollowing = false;
    try {
      const context = await validateRequest(request);
      if (context.userId) {
        const follow = await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: context.userId,
              followingId: profile.id,
            },
          },
        });
        isFollowing = !!follow;
      }
    } catch {
      // User not authenticated, isFollowing stays false
    }

    return successResponse({
      profile: {
        ...profile,
        isFollowing,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
