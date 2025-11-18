import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, createdResponse, handleApiError, errors,  } from '@/lib/api/response';
import { parseBody, validateRequest, requireAuth,  } from '@/lib/api/middleware';
import { z } from 'zod';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const addArtistSchema = z.object({
  artistId: z.string().cuid(),
  order: z.number().int().nonnegative().optional(),
});

// GET /api/events/[id]/artists - Get event artists
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: id },
    });

    if (!event) {
      throw errors.notFound('Event');
    }

    // Get event artists
    const eventArtists = await prisma.eventArtist.findMany({
      where: { eventId: id },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            slug: true,
            bio: true,
            imageUrl: true,
            genre: true,
            website: true,
            socialLinks: true,
            verified: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    return successResponse(eventArtists);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/events/[id]/artists - Add artist to event
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await parseBody(request);
    const validatedData = addArtistSchema.parse(body);

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: id },
    });

    if (!event) {
      throw errors.notFound('Event');
    }

    // Check if artist exists
    const artist = await prisma.artist.findUnique({
      where: { id: validatedData.artistId },
    });

    if (!artist) {
      throw errors.notFound('Artist');
    }

    // Check if artist already added
    const existing = await prisma.eventArtist.findUnique({
      where: {
        eventId_artistId: {
          eventId: id,
          artistId: validatedData.artistId,
        },
      },
    });

    if (existing) {
      throw errors.conflict('Artist already added to this event');
    }

    // Add artist to event
    const eventArtist = await prisma.eventArtist.create({
      data: {
        eventId: id,
        artistId: validatedData.artistId,
        order: validatedData.order ?? 0,
      },
      include: {
        artist: true,
      },
    });

    return createdResponse(eventArtist);
  } catch (error) {
    return handleApiError(error);
  }
}
