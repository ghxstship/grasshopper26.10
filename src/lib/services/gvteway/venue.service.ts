/**
 * GVTEWAY Venue Service
 * Handles venue management for events
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { AuditService } from '../shared/audit.service';

export class VenueService {
  /**
   * Get all venues with filtering
   */
  static async getAll(params: {
    city?: string;
    state?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { city, state, search, page = 1, limit = 20 } = params;

    const where: Prisma.VenueWhereInput = {
      ...(city && { city: { contains: city, mode: 'insensitive' } }),
      ...(state && { state }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [venues, total] = await Promise.all([
      prisma.venue.findMany({
        where,
        include: {
          _count: {
            select: {
              events: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.venue.count({ where }),
    ]);

    return {
      venues,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single venue by ID
   */
  static async getById(id: string) {
    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        events: {
          where: {
            startDate: { gte: new Date() },
          },
          orderBy: {
            startDate: 'asc',
          },
          take: 10,
        },
        _count: {
          select: {
            events: true,
          },
        },
      },
    });

    if (!venue) {
      throw new Error('Venue not found');
    }

    return venue;
  }

  /**
   * Get venue by slug
   */
  static async getBySlug(slug: string) {
    const venue = await prisma.venue.findUnique({
      where: { slug },
      include: {
        events: {
          where: {
            startDate: { gte: new Date() },
          },
          orderBy: {
            startDate: 'asc',
          },
        },
      },
    });

    if (!venue) {
      throw new Error('Venue not found');
    }

    return venue;
  }

  /**
   * Create a new venue
   */
  static async create(data: {
    name: string;
    slug: string;
    address: string;
    city: string;
    state: string;
    zipCode?: string;
    postalCode?: string;
    country?: string;
    capacity?: number;
    description?: string;
    imageUrl?: string;
    latitude?: number;
    longitude?: number;
    createdBy: string;
    metadata?: Prisma.JsonValue;
  }) {
    const venue = await prisma.venue.create({
      data: {
        name: data.name,
        slug: data.slug,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.zipCode || data.postalCode,
        country: data.country || 'USA',
        capacity: data.capacity,
        description: data.description,
        imageUrl: data.imageUrl,
        latitude: data.latitude,
        longitude: data.longitude,
        metadata: data.metadata || {},
      },
    });

    await AuditService.log({
      userId: data.createdBy,
      action: 'CREATE',
      entity: 'Venue',
      entityId: venue.id,
      metadata: { name: data.name, city: data.city },
    });

    return venue;
  }

  /**
   * Update a venue
   */
  static async update(
    id: string,
    userId: string,
    data: Partial<{
      name: string;
      slug: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      capacity: number;
      description: string;
      imageUrl: string;
      latitude: number;
      longitude: number;
      metadata: Prisma.JsonValue;
    }>
  ) {
    const updated = await prisma.venue.update({
      where: { id },
      data,
    });

    await AuditService.log({
      userId,
      action: 'UPDATE',
      entity: 'Venue',
      entityId: id,
      metadata: data as Record<string, unknown>,
    });

    return updated;
  }

  /**
   * Delete a venue
   */
  static async delete(id: string, userId: string) {
    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            events: true,
          },
        },
      },
    });

    if (!venue) {
      throw new Error('Venue not found');
    }

    if (venue._count.events > 0) {
      throw new Error('Cannot delete venue with existing events');
    }

    await prisma.venue.delete({
      where: { id },
    });

    await AuditService.log({
      userId,
      action: 'DELETE',
      entity: 'Venue',
      entityId: id,
    });

    return { success: true };
  }

  /**
   * Search venues
   */
  static async search(params: {
    query: string;
    city?: string;
    state?: string;
    page?: number;
    limit?: number;
  }) {
    const { query, city, state, page = 1, limit = 20 } = params;

    const where: Prisma.VenueWhereInput = {
      ...(city && { city: { contains: city, mode: 'insensitive' } }),
      ...(state && { state }),
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    };

    const [venues, total] = await Promise.all([
      prisma.venue.findMany({
        where,
        include: {
          _count: {
            select: {
              events: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.venue.count({ where }),
    ]);

    return {
      venues,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get venues by city
   */
  static async getByCity(city: string, limit = 20) {
    return prisma.venue.findMany({
      where: {
        city: { contains: city, mode: 'insensitive' },
      },
      include: {
        _count: {
          select: {
            events: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
      take: limit,
    });
  }

  /**
   * Get popular venues
   */
  static async getPopular(limit = 10) {
    const venues = await prisma.venue.findMany({
      include: {
        _count: {
          select: {
            events: true,
          },
        },
      },
      orderBy: {
        events: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return venues;
  }

  /**
   * Get venue statistics
   */
  static async getStats(venueId: string) {
    const [totalEvents, upcomingEvents, pastEvents] = await Promise.all([
      prisma.event.count({ where: { venueId } }),
      prisma.event.count({
        where: {
          venueId,
          startDate: { gte: new Date() },
        },
      }),
      prisma.event.count({
        where: {
          venueId,
          startDate: { lt: new Date() },
        },
      }),
    ]);

    return {
      totalEvents,
      upcomingEvents,
      pastEvents,
    };
  }

  /**
   * Get nearby venues
   */
  static async getNearby(params: {
    latitude: number;
    longitude: number;
    radiusMiles?: number;
    limit?: number;
  }) {
    const { latitude, longitude, radiusMiles = 25, limit = 20 } = params;

    // Haversine formula for distance calculation
    const venues = await prisma.$queryRaw<any[]>`
      SELECT *,
        (3959 * acos(
          cos(radians(${latitude})) * 
          cos(radians(latitude)) * 
          cos(radians(longitude) - radians(${longitude})) + 
          sin(radians(${latitude})) * 
          sin(radians(latitude))
        )) AS distance
      FROM "Venue"
      WHERE latitude IS NOT NULL 
        AND longitude IS NOT NULL
      HAVING distance < ${radiusMiles}
      ORDER BY distance
      LIMIT ${limit}
    `;

    return venues;
  }
}
