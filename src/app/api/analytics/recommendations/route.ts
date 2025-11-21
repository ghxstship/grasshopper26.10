import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

// GET /analytics/recommendations
export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.PUBLIC_ENDPOINT.limit,
      RATE_LIMITS.PUBLIC_ENDPOINT.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    // Get user's tickets to build recommendations
    const userTickets = await prisma.ticket.findMany({
      where: { userId: context.userId },
      include: {
        event: {
          include: {
            category: true,
            artists: {
              include: {
                artist: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Extract event categories and artists from past tickets
    const categoryIds = new Set<string>();
    const artistIds = new Set<string>();

    userTickets.forEach(ticket => {
      if (ticket.event) {
        if (ticket.event.categoryId) {
          categoryIds.add(ticket.event.categoryId);
        }
        ticket.event.artists?.forEach(ea => {
          artistIds.add(ea.artistId);
        });
      }
    });

    // Find upcoming events in similar categories or with same artists
    const recommendedEvents = await prisma.event.findMany({
      where: {
        OR: [
          { categoryId: { in: Array.from(categoryIds) } },
          { artists: { some: { artistId: { in: Array.from(artistIds) } } } },
        ],
        startDate: { gte: new Date() },
        status: 'PUBLISHED',
      },
      include: {
        category: true,
        artists: {
          include: {
            artist: true,
          },
        },
        venue: true,
      },
      take: 20,
      orderBy: { startDate: 'asc' },
    });

    return successResponse({
      recommendations: recommendedEvents,
      basedOn: {
        categories: Array.from(categoryIds).length,
        artists: Array.from(artistIds).length,
        pastTickets: userTickets.length,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

