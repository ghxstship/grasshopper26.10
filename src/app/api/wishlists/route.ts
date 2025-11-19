import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, createdResponse, handleApiError, errors,  } from '@/lib/api/response';
import { parseBody, validateRequest, requireAuth,  } from '@/lib/api/middleware';
import { z } from 'zod';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { WishlistsService } from '@/lib/services/wishlists.service';



const addToWishlistSchema = z.object({
  eventId: z.string().cuid(),
});

// GET /api/wishlists - Get user's wishlist
export async function GET(request: NextRequest) {
  try {const context = await validateRequest(request);
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

    const wishlists = await new WishlistsService().findAll({
      where: { userId: context.userId },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            startDate: true,
            endDate: true,
            status: true,
            venue: {
              select: {
                name: true,
                city: true,
                state: true,
              },
            },
            organization: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(wishlists);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/wishlists - Add event to wishlist
export async function POST(request: NextRequest) {
  try {const context = await validateRequest(request);
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
    const validatedData = addToWishlistSchema.parse(body);

    // Check if event exists
    const event = await new WishlistsService().findById({
      where: { id: validatedData.eventId },
    });

    if (!event) {
      throw errors.notFound('Event');
    }

    // Check if already in wishlist
    const existing = await new WishlistsService().findById({
      where: {
        userId_eventId: {
          userId: context.userId!,
          eventId: validatedData.eventId,
        },
      },
    });

    if (existing) {
      throw errors.conflict('Event already in wishlist');
    }

    // Add to wishlist
    const wishlist = await new WishlistsService().create({
      data: {
        userId: context.userId!,
        eventId: validatedData.eventId,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            startDate: true,
          },
        },
      },
    });

    return createdResponse(wishlist);
  } catch (error) {
    return handleApiError(error);
  }
}
