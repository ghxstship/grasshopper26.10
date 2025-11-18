/**
 * GVTEWAY Adventure Service
 * Handles VIP experiences and adventure bookings
 */

import { prisma } from '@/lib/prisma';
import { Prisma, AdventureType, BookingStatus } from '@prisma/client';
import { AuditService } from '../shared/audit.service';

export class AdventureService {
  /**
   * Get all adventures with filtering
   */
  static async getAll(params: {
    eventId?: string;
    type?: AdventureType;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { eventId, type, search, page = 1, limit = 20 } = params;

    const where: Prisma.AdventureWhereInput = {
      ...(eventId && { eventId }),
      ...(type && { type }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [adventures, total] = await Promise.all([
      prisma.adventure.findMany({
        where,
        include: {
          event: {
            select: {
              id: true,
              name: true,
              startDate: true,
            },
          },
          _count: {
            select: {
              bookings: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.adventure.count({ where }),
    ]);

    return {
      adventures,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single adventure by ID
   */
  static async getById(id: string) {
    const adventure = await prisma.adventure.findUnique({
      where: { id },
      include: {
        event: true,
        bookings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!adventure) {
      throw new Error('Adventure not found');
    }

    return adventure;
  }

  /**
   * Create a new adventure
   */
  static async create(data: {
    eventId?: string;
    name: string;
    slug: string;
    description?: string;
    type: AdventureType;
    price: number;
    capacity?: number;
    duration?: number;
    imageUrl?: string;
    currency?: string;
    createdBy: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    const adventure = await prisma.adventure.create({
      data: {
        eventId: data.eventId,
        name: data.name,
        slug: data.slug,
        description: data.description,
        type: data.type,
        price: data.price,
        capacity: data.capacity,
        duration: data.duration,
        imageUrl: data.imageUrl,
        currency: data.currency || 'USD',
        metadata: data.metadata || {},
      },
    });

    await AuditService.log({
      userId: data.createdBy,
      action: 'CREATE',
      entity: 'Adventure',
      entityId: adventure.id,
      metadata: { name: data.name, eventId: data.eventId },
    });

    return adventure;
  }

  /**
   * Update an adventure
   */
  static async update(
    id: string,
    userId: string,
    data: Partial<{
      name: string;
      slug: string;
      description: string;
      type: AdventureType;
      price: number;
      capacity: number;
      duration: number;
      imageUrl: string;
      currency: string;
      metadata: Prisma.InputJsonValue;
    }>
  ) {
    const updated = await prisma.adventure.update({
      where: { id },
      data,
    });

    await AuditService.log({
      userId,
      action: 'UPDATE',
      entity: 'Adventure',
      entityId: id,
      metadata: data as Record<string, unknown>,
    });

    return updated;
  }

  /**
   * Delete an adventure
   */
  static async delete(id: string, userId: string) {
    const adventure = await prisma.adventure.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!adventure) {
      throw new Error('Adventure not found');
    }

    if (adventure._count.bookings > 0) {
      throw new Error('Cannot delete adventure with existing bookings');
    }

    await prisma.adventure.delete({
      where: { id },
    });

    await AuditService.log({
      userId,
      action: 'DELETE',
      entity: 'Adventure',
      entityId: id,
    });

    return { success: true };
  }

  /**
   * Create a booking
   */
  static async createBooking(data: {
    adventureId: string;
    userId: string;
    date: Date;
    quantity: number;
    totalPrice: number;
    status?: BookingStatus;
    metadata?: Prisma.InputJsonValue;
  }) {
    // Check availability
    const adventure = await prisma.adventure.findUnique({
      where: { id: data.adventureId },
    });

    if (!adventure) {
      throw new Error('Adventure not found');
    }

    // Check capacity if set
    if (adventure.capacity) {
      const bookedQuantity = await prisma.adventureBooking.aggregate({
        where: {
          adventureId: data.adventureId,
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
        _sum: {
          quantity: true,
        },
      });

      const currentBookings = bookedQuantity._sum.quantity || 0;
      if (currentBookings + data.quantity > adventure.capacity) {
        throw new Error('Insufficient capacity for this adventure');
      }
    }

    const booking = await prisma.adventureBooking.create({
      data: {
        adventureId: data.adventureId,
        userId: data.userId,
        date: data.date,
        quantity: data.quantity,
        totalPrice: data.totalPrice,
        status: data.status || 'PENDING',
        metadata: data.metadata || {},
      },
    });

    await AuditService.log({
      userId: data.userId,
      action: 'CREATE_BOOKING',
      entity: 'Adventure',
      entityId: data.adventureId,
      metadata: { bookingId: booking.id, quantity: data.quantity },
    });

    return booking;
  }

  /**
   * Cancel a booking
   */
  static async cancelBooking(params: {
    bookingId: string;
    userId: string;
    reason?: string;
  }) {
    const { bookingId, userId, reason } = params;

    const booking = await prisma.adventureBooking.findUnique({
      where: { id: bookingId },
      include: {
        adventure: true,
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new Error('Unauthorized to cancel this booking');
    }

    if (booking.status === 'CANCELLED') {
      throw new Error('Booking is already cancelled');
    }

    const updated = await prisma.adventureBooking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        metadata: {
          ...(typeof booking.metadata === 'object' && booking.metadata !== null ? booking.metadata : {}),
          cancellationReason: reason,
          cancelledAt: new Date().toISOString(),
        } as Prisma.InputJsonValue,
      },
    });

    await AuditService.log({
      userId,
      action: 'CANCEL_BOOKING',
      entity: 'Adventure',
      entityId: booking.adventureId,
      metadata: { bookingId, reason },
    });

    return updated;
  }

  /**
   * Check adventure availability
   */
  static async checkAvailability(adventureId: string, quantity: number) {
    const adventure = await prisma.adventure.findUnique({
      where: { id: adventureId },
    });

    if (!adventure) {
      throw new Error('Adventure not found');
    }

    if (!adventure.capacity) {
      return {
        available: true,
        availableSpots: null,
      };
    }

    const bookedQuantity = await prisma.adventureBooking.aggregate({
      where: {
        adventureId,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      _sum: {
        quantity: true,
      },
    });

    const currentBookings = bookedQuantity._sum.quantity || 0;
    const availableSpots = adventure.capacity - currentBookings;

    if (availableSpots < quantity) {
      return {
        available: false,
        reason: 'Insufficient capacity',
        availableSpots,
      };
    }

    return {
      available: true,
      availableSpots,
    };
  }

  /**
   * Get adventures by event
   */
  static async getByEvent(eventId: string) {
    return prisma.adventure.findMany({
      where: {
        eventId,
      },
      include: {
        _count: {
          select: {
            bookings: {
              where: {
                status: { in: ['PENDING', 'CONFIRMED'] },
              },
            },
          },
        },
      },
      orderBy: {
        price: 'asc',
      },
    });
  }

  /**
   * Get user bookings
   */
  static async getUserBookings(userId: string, status?: BookingStatus) {
    return prisma.adventureBooking.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      include: {
        adventure: {
          include: {
            event: {
              select: {
                id: true,
                name: true,
                startDate: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get adventure analytics
   */
  static async getAnalytics(adventureId: string) {
    const [adventure, totalBookings, revenue, recentBookings] = await Promise.all([
      prisma.adventure.findUnique({
        where: { id: adventureId },
      }),
      prisma.adventureBooking.count({
        where: {
          adventureId,
          status: { in: ['CONFIRMED', 'PENDING'] },
        },
      }),
      prisma.adventureBooking.aggregate({
        where: {
          adventureId,
          status: 'CONFIRMED',
        },
        _sum: {
          totalPrice: true,
          quantity: true,
        },
      }),
      prisma.adventureBooking.findMany({
        where: { adventureId },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      }),
    ]);

    if (!adventure) {
      throw new Error('Adventure not found');
    }

    const totalQuantity = revenue._sum.quantity || 0;
    const occupancyRate = adventure.capacity
      ? (totalQuantity / adventure.capacity) * 100
      : null;

    return {
      adventure,
      totalBookings,
      totalRevenue: revenue._sum.totalPrice || 0,
      totalQuantity,
      occupancyRate,
      recentBookings,
    };
  }

  /**
   * Get popular adventures
   */
  static async getPopular(limit = 10) {
    const adventures = await prisma.adventure.findMany({
      include: {
        event: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            bookings: {
              where: {
                status: { in: ['CONFIRMED', 'PENDING'] },
              },
            },
          },
        },
      },
      orderBy: {
        bookings: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return adventures;
  }
}
