import { prisma } from '@/lib/prisma';

/**
 * Optimized query patterns for common operations
 */

// ============================================
// EVENT QUERIES
// ============================================

/**
 * Get events with optimized includes
 */
export async function getEventsOptimized(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
}) {
  const { page = 1, limit = 20, status, search, organizationId } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (organizationId) where.organizationId = organizationId;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Use parallel queries for better performance
  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        startDate: true,
        endDate: true,
        status: true,
        imageUrl: true,
        venue: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            tickets: true,
            artists: true,
          },
        },
      },
      orderBy: { startDate: 'asc' },
    }),
    prisma.event.count({ where }),
  ]);

  return { events, total };
}

/**
 * Get single event with all relations
 */
export async function getEventByIdOptimized(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      venue: {
        select: {
          id: true,
          name: true,
          address: true,
          city: true,
          state: true,
          postalCode: true,
          capacity: true,
        },
      },
      organization: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
      artists: true,
      ticketTypes: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
      _count: {
        select: {
          tickets: true,
          orders: true,
        },
      },
    },
  });
}

// ============================================
// USER QUERIES
// ============================================

/**
 * Get user with minimal data for auth
 */
export async function getUserForAuth(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  });
}

/**
 * Get user profile with relations
 */
export async function getUserProfile(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      organizations: {
        select: {
          organization: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
      },
      _count: {
        select: {
          tickets: true,
          orders: true,
          socialPosts: true,
          followers: true,
          following: true,
        },
      },
    },
  });
}

// ============================================
// ORDER QUERIES
// ============================================

/**
 * Get orders with optimized includes
 */
export async function getOrdersOptimized(params: {
  userId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const { userId, status, page = 1, limit = 20 } = params;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (userId) where.userId = userId;
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true,
        event: {
          select: {
            id: true,
            name: true,
            startDate: true,
            imageUrl: true,
          },
        },
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total };
}

// ============================================
// SOCIAL QUERIES
// ============================================

/**
 * Get social feed with optimized includes
 */
export async function getSocialFeedOptimized(params: {
  userId?: string;
  page?: number;
  limit?: number;
}) {
  const { userId, page = 1, limit = 20 } = params;
  const skip = (page - 1) * limit;

  // Get posts from followed users + own posts
  const where: Record<string, unknown> = userId
    ? {
        OR: [
          { authorId: userId },
          {
            author: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      }
    : {};

  const [posts, total] = await Promise.all([
    prisma.socialPost.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.socialPost.count({ where }),
  ]);

  return { posts, total };
}

// ============================================
// ANALYTICS QUERIES
// ============================================

/**
 * Get event analytics
 */
export async function getEventAnalytics(eventId: string) {
  const [ticketsSold, revenue, orderCount, attendeeCount] = await Promise.all([
    prisma.ticket.count({ where: { eventId } }),
    prisma.order.aggregate({
      where: { eventId, status: 'COMPLETED' },
      _sum: { total: true },
    }),
    prisma.order.count({ where: { eventId } }),
    prisma.ticket.groupBy({
      by: ['userId'],
      where: { eventId },
      _count: true,
    }),
  ]);

  return {
    ticketsSold,
    revenue: revenue._sum.total || 0,
    orderCount,
    attendeeCount: attendeeCount.length,
  };
}

/**
 * Get organization analytics
 */
export async function getOrganizationAnalytics(organizationId: string) {
  const [eventCount, totalRevenue, totalTickets, activeEvents] = await Promise.all([
    prisma.event.count({ where: { organizationId } }),
    prisma.order.aggregate({
      where: {
        event: { organizationId },
        status: 'COMPLETED',
      },
      _sum: { total: true },
    }),
    prisma.ticket.count({
      where: { event: { organizationId } },
    }),
    prisma.event.count({
      where: {
        organizationId,
        status: 'PUBLISHED',
        startDate: { gte: new Date() },
      },
    }),
  ]);

  return {
    eventCount,
    totalRevenue: totalRevenue._sum.total || 0,
    totalTickets,
    activeEvents,
  };
}
