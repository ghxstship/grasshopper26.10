import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createCommentSchema } from '@/lib/validations/social';
import { successResponse, createdResponse, handleApiError, errors,  } from '@/lib/api/response';
import { parseBody, getPaginationParams, validateRequest, requireAuth,  } from '@/lib/api/middleware';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { SocialService } from '@/lib/services/social/posts/id/comments.service';



type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/social/posts/[id]/comments - Get post comments
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { page, limit, skip } = getPaginationParams(request);

    // Check if post exists
    const { id } = await params;
    const post = await new SocialService().findById({
      where: { id },
    });

    if (!post) {
      throw errors.notFound('Post');
    }

    // Get total count
    const total = await prisma.socialComment.count({
      where: { postId: id },
    });

    // Get comments
    const comments = await new SocialService().findAll({
      where: { postId: id },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    return successResponse(comments, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/social/posts/[id]/comments - Add comment to post
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);
    const { id } = await params;

    const body = await parseBody<Record<string, unknown>>(request);
    const validatedData = createCommentSchema.parse({
      ...(body as object),
      postId: id,
    });

    // Check if post exists
    const post = await new SocialService().findById({
      where: { id },
    });

    if (!post) {
      throw errors.notFound('Post');
    }

    // Get user data for notifications
    const user = await new SocialService().findById({
      where: { id: context.userId! },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });

    // Create comment
    const comment = await new SocialService().create({
      data: {
        userId: context.userId!,
        postId: validatedData.postId,
        content: validatedData.content,
        parentId: validatedData.parentId,
        // metadata field doesn't exist on SocialComment model
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Create notification for post author (if not commenting on own post)
    if (post.userId !== context.userId) {
      await new SocialService().create({
        data: {
          userId: post.userId,
          type: 'POST_COMMENT',
          title: 'New Comment',
          message: `${user?.name || 'Someone'} commented on your post`,
          metadata: {
            postId: id,
            commentId: comment.id,
            commenterId: context.userId!,
            commenterName: user?.name,
            commenterImage: user?.image,
            commentPreview: validatedData.content.substring(0, 100),
          },
        },
      });
    }

    // If this is a reply, notify the parent comment author
    if (validatedData.parentId) {
      const parentComment = await new SocialService().findById({
        where: { id: validatedData.parentId },
      });

      if (parentComment && parentComment.userId !== context.userId) {
        await new SocialService().create({
          data: {
            userId: parentComment.userId,
            type: 'COMMENT_REPLY',
            title: 'New Reply',
            message: `${user?.name || 'Someone'} replied to your comment`,
            metadata: {
              postId: id,
              commentId: comment.id,
              parentCommentId: validatedData.parentId,
              replierId: context.userId!,
              replierName: user?.name,
              replierImage: user?.image,
              replyPreview: validatedData.content.substring(0, 100),
            },
          },
        });
      }
    }

    return createdResponse(comment);
  } catch (error) {
    return handleApiError(error);
  }
}
