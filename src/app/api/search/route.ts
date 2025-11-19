import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest } from '@/lib/api/middleware';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { SearchService } from '@/lib/services/search.service';



export async function GET(request: NextRequest) {
  try {
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

    await validateRequest(request);

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type');

    if (!query) {
      return successResponse({ results: [] });
    }

    const results: any = {
      events: [],
      artists: [],
      venues: [],
      projects: [],
      tasks: [],
    };

    if (!type || type === 'events') {
      results.events = await new SearchService().findAll({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
          status: 'PUBLISHED',
        },
        take: 10,
        select: {
          id: true,
          name: true,
          slug: true,
          imageUrl: true,
          startDate: true,
        },
      });
    }

    if (!type || type === 'artists') {
      results.artists = await new SearchService().findAll({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { bio: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
        select: {
          id: true,
          name: true,
          slug: true,
          imageUrl: true,
        },
      });
    }

    if (!type || type === 'venues') {
      results.venues = await new SearchService().findAll({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { city: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
        select: {
          id: true,
          name: true,
          city: true,
          state: true,
        },
      });
    }

    return successResponse(results);
  } catch (error) {
    return handleApiError(error);
  }
}
