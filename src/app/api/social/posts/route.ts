import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { createPostSchema, postFiltersSchema } from '@/lib/validations/social';
import { successResponse, createdResponse, handleApiError, errors,  } from '@/lib/api/response';
import { parseBody, getPaginationParams, validateRequest, requireAuth, rateLimit,  } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';

// GET /api/social/posts - List posts
export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.READ_OPERATIONS.limit,
      RATE_LIMITS.READ_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(request);

    // Parse filters
    const filters = postFiltersSchema.parse(Object.fromEntries(searchParams));

    // Build where clause
    const where: Record<string, unknown> = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.eventId) where.eventId = filters.eventId;
    if (filters.visibility) where.visibility = filters.visibility;

    if (filters.search) {
      where.content = { contains: filters.search, mode: 'insensitive' };
    }

    // Get total count
    const total = await prisma.socialPost.count({ where });

    // Get posts
    const posts = await prisma.socialPost.findMany({
      where,
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
            likedBy: true,
            comments: true,
          },
        },
      },
    });

    // Check if current user has liked each post
    const postsWithLikeStatus = await Promise.all(
      posts.map(async (post: { id: string; [key: string]: unknown }) => {
        const userLike = await prisma.socialLike.findFirst({
          where: {
            postId: post.id,
            userId: context.userId,
          },
        });

        return {
          ...post,
          isLikedByCurrentUser: !!userLike,
        };
      })
    );

    return successResponse(postsWithLikeStatus, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/social/posts - Create post
export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting - prevent spam posts
    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.SOCIAL_POST.limit,
      RATE_LIMITS.SOCIAL_POST.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const body = await parseBody(request);
    const validatedData = createPostSchema.parse(body);

    // Cast metadata to Prisma InputJsonValue
    const createData = {
      userId: context.userId!,
      content: validatedData.content,
      ...(validatedData.visibility && { visibility: validatedData.visibility }),
      ...(validatedData.eventId && { eventId: validatedData.eventId }),
      ...(validatedData.images && { images: validatedData.images }),
      ...(validatedData.metadata && { metadata: validatedData.metadata as Prisma.InputJsonValue }),
    };

    // Create post
    const post = await prisma.socialPost.create({
      data: createData,
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

    return createdResponse(post);
  } catch (error) {
    return handleApiError(error);
  }
}
