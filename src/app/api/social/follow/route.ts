import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, errors,  } from '@/lib/api/response';
import { parseBody, validateRequest, requireAuth, rateLimit,  } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { z } from 'zod';
import { SocialService } from '@/lib/services/social/follow.service';


const followSchema = z.object({
  followingId: z.string().cuid(),
});

// POST /api/social/follow - Follow a user
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

    const body = await parseBody(request);
    const validatedData = followSchema.parse(body);

    // Can't follow yourself
    if (validatedData.followingId === context.userId) {
      throw errors.badRequest('You cannot follow yourself');
    }

    // Check if user exists
    const userToFollow = await new SocialService().findById({
      where: { id: validatedData.followingId },
    });

    if (!userToFollow) {
      throw errors.notFound('User');
    }

    // Check if already following
    const existingFollow = await new SocialService().findById({
      where: {
        followerId_followingId: {
          followerId: context.userId!,
          followingId: validatedData.followingId,
        },
      },
    });

    if (existingFollow) {
      throw errors.conflict('Already following this user');
    }

    // Create follow relationship
    const follow = await new SocialService().create({
      data: {
        followerId: context.userId!,
        followingId: validatedData.followingId,
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Create notification for followed user
    const follower = await new SocialService().findById({
      where: { id: context.userId! },
      select: { name: true, image: true },
    });

    await new SocialService().create({
      data: {
        userId: validatedData.followingId,
        type: 'NEW_FOLLOWER',
        title: 'New Follower',
        message: `${follower?.name || 'Someone'} started following you`,
        metadata: {
          followerId: context.userId!,
          followerName: follower?.name,
          followerImage: follower?.image,
        },
      },
    });

    return successResponse({
      follow,
      message: 'Successfully followed user',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
