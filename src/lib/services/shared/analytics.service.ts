/**
 * Analytics Service
 */

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class AnalyticsService {
  static async trackEvent(params: {
    userId?: string;
    event: string;
    eventType?: string;
    properties?: Record<string, unknown>;
  }) {
    await prisma.analyticsData.create({
      data: {
        userId: params.userId,
        eventName: params.event,
        eventType: params.eventType || 'custom',
        properties: (params.properties || {}) as Prisma.InputJsonValue,
      },
    });
  }

  static async trackPageView(params: {
    userId?: string;
    path: string;
    referrer?: string;
  }) {
    await this.trackEvent({
      userId: params.userId,
      event: 'page_view',
      eventType: 'navigation',
      properties: {
        path: params.path,
        referrer: params.referrer,
      },
    });
  }

  static async getEventStats(params: {
    event: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where = {
      eventName: params.event,
      ...(params.startDate && { createdAt: { gte: params.startDate } }),
      ...(params.endDate && { createdAt: { lte: params.endDate } }),
    };

    const [total, uniqueUsers] = await Promise.all([
      prisma.analyticsData.count({ where }),
      prisma.analyticsData.findMany({
        where,
        select: { userId: true },
        distinct: ['userId'],
      }),
    ]);

    return {
      total,
      uniqueUsers: uniqueUsers.length,
    };
  }

  static async getUserActivity(userId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await prisma.analyticsData.findMany({
      where: {
        userId,
        createdAt: { gte: startDate },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return events;
  }

  static async getTopEvents(limit = 10) {
    const events = await prisma.analyticsData.groupBy({
      by: ['eventName'],
      _count: {
        eventName: true,
      },
      orderBy: {
        _count: {
          eventName: 'desc',
        },
      },
      take: limit,
    });

    return events;
  }
}
