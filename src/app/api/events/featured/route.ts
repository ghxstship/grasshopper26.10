import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError,  } from '@/lib/api/response';
import { getPaginationParams } from '@/lib/api/middleware';

// GET /api/events/featured - Get featured events
export async function GET(request: NextRequest) {
  try {
    const { page, limit, skip } = getPaginationParams(request);

    // Build where clause for featured events
    const where = {
      featured: true,
      status: 'PUBLISHED' as const,
      visibility: 'PUBLIC' as const,
      startDate: {
        gte: new Date(),
      },
    };

    // Get total count
    const total = await prisma.event.count({ where });

    // Get featured events
    const events = await prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { startDate: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            color: true,
          },
        },
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            state: true,
            country: true,
          },
        },
        artists: {
          include: {
            artist: {
              select: {
                id: true,
                name: true,
                slug: true,
                imageUrl: true,
                genre: true,
                verified: true,
              },
            },
          },
          orderBy: { order: 'asc' },
          take: 3,
        },
        _count: {
          select: {
            tickets: true,
          },
        },
      },
    });

    return successResponse(events, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
