import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest } from '@/lib/api/middleware';

export async function GET(request: NextRequest) {
  try {
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
      results.events = await prisma.event.findMany({
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
      results.artists = await prisma.artist.findMany({
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
      results.venues = await prisma.venue.findMany({
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
