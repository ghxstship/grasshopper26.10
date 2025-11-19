import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, errors,  } from '@/lib/api/response';
import { validateRequest, requireAuth,  } from '@/lib/api/middleware';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { SocialService } from '@/lib/services/social/follow/id.service';



type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// DELETE /api/social/follow/[id] - Unfollow a user
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    // Find follow relationship
    const follow = await new SocialService().findById({
      where: {
        followerId_followingId: {
          followerId: context.userId!,
          followingId: id,
        },
      },
    });

    if (!follow) {
      throw errors.notFound('Follow relationship');
    }

    // Delete follow relationship
    await new SocialService().delete({
      where: {
        followerId_followingId: {
          followerId: context.userId!,
          followingId: id,
        },
      },
    });

    return successResponse({
      message: 'Successfully unfollowed user',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
