import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { updatePostSchema } from '@/lib/validations/social';
import { successResponse, handleApiError, errors,  } from '@/lib/api/response';
import { parseBody, validateRequest, requireAuth, rateLimit, getClientIdentifier,  } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/social/posts/[id] - Get post by ID
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const identifier = getClientIdentifier(request);
    
    if (!rateLimit(
      RateLimitIdentifiers.byIP(identifier),
      RATE_LIMITS.READ_OPERATIONS.limit,
      RATE_LIMITS.READ_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const post = await prisma.socialPost.findUnique({
      where: { id: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) {
      throw errors.notFound('Post');
    }

    return successResponse(post);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/social/posts/[id] - Update post
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
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
    const validatedData = updatePostSchema.parse(body);

    // Cast metadata to Prisma InputJsonValue
    const updateData = {
      ...validatedData,
      ...(validatedData.metadata && { metadata: validatedData.metadata as Prisma.InputJsonValue }),
    };

    // Check if post exists
    const existingPost = await prisma.socialPost.findUnique({
      where: { id: id },
    });

    if (!existingPost) {
      throw errors.notFound('Post');
    }

    // Check ownership
    if (existingPost.userId !== context.userId) {
      throw errors.forbidden();
    }

    // Update post
    const post = await prisma.socialPost.update({
      where: { id: id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return successResponse(post);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/social/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.WRITE_OPERATIONS.limit,
      RATE_LIMITS.WRITE_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    // Check if post exists
    const existingPost = await prisma.socialPost.findUnique({
      where: { id: id },
    });

    if (!existingPost) {
      throw errors.notFound('Post');
    }

    // Check ownership
    if (existingPost.userId !== context.userId && context.userRole !== 'ADMIN') {
      throw errors.forbidden();
    }

    // Delete post (cascade will handle likes and comments)
    await prisma.socialPost.delete({
      where: { id: id },
    });

    return successResponse({ message: 'Post deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
