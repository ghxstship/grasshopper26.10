import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateArtistSchema } from '@/lib/validations/events';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { parseBody, validateRequest, requireAuth } from '@/lib/api/middleware';



type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/artists/[id] - Get artist by ID
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const artist = await prisma.artist.findUnique({
      where: { id },
      include: {
        events: {
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
              },
            },
          },
          orderBy: {
            event: {
              startDate: 'desc',
            },
          },
        },
        _count: {
          select: {
            events: true,
          },
        },
      },
    });

    if (!artist) {
      throw errors.notFound('Artist');
    }

    return successResponse(artist);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/artists/[id] - Update artist
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await parseBody(request);
    const validatedData = updateArtistSchema.parse(body);
    
    const { id } = await params;

    // Check if artist exists
    const existingArtist = await prisma.artist.findUnique({
      where: { id },
    });

    if (!existingArtist) {
      throw errors.notFound('Artist');
    }

    // Update artist
    const artist = await prisma.artist.update({
      where: { id },
      data: validatedData,
    });

    return successResponse(artist);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/artists/[id] - Delete artist
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);
    
    const { id } = await params;

    // Check if artist exists
    const existingArtist = await prisma.artist.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            events: true,
          },
        },
      },
    });

    if (!existingArtist) {
      throw errors.notFound('Artist');
    }

    // Prevent deletion if artist has events
    if (existingArtist._count.events > 0) {
      throw errors.badRequest(
        'Cannot delete artist with existing events',
        { eventCount: existingArtist._count.events }
      );
    }

    // Delete artist
    await prisma.artist.delete({
      where: { id },
    });

    return successResponse({ message: 'Artist deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
