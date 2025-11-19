import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, errors,  } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { SocialService } from '@/lib/services/social/posts/id/like.service';



type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// POST /api/social/posts/[id]/like - Like a post
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    // Check if post exists
    const post = await new SocialService().findById({
      where: { id: id },
    });

    if (!post) {
      throw errors.notFound('Post');
    }

    // Check if already liked
    const existingLike = await prisma.socialLike.findFirst({
      where: {
        postId: id,
        userId: context.userId,
      },
    });

    if (existingLike) {
      // Unlike
      await new SocialService().delete({
        where: { id: existingLike.id },
      });

      return successResponse({
        liked: false,
        message: 'Post unliked',
      });
    } else {
      // Like
      await new SocialService().create({
        data: {
          postId: id,
          userId: context.userId!,
        },
      });

      // Create notification for post author (if not liking own post)
      if (post.userId !== context.userId) {
        const liker = await new SocialService().findById({
          where: { id: context.userId! },
          select: { name: true, image: true },
        });

        await new SocialService().create({
          data: {
            userId: post.userId,
            type: 'POST_LIKED',
            title: 'New Like',
            message: `${liker?.name || 'Someone'} liked your post`,
            metadata: {
              postId: id,
              likerId: context.userId!,
              likerName: liker?.name,
              likerImage: liker?.image,
            },
          },
        });
      }

      return successResponse({
        liked: true,
        message: 'Post liked',
      });
    }
  } catch (error) {
    return handleApiError(error);
  }
}
