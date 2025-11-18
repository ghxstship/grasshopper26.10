import { prisma } from '@/lib/prisma';
import { BaseService } from '../base/BaseService';

export class CheckInService extends BaseService {
  /**
   * Check in user
   */
  async checkIn(userId: string, data: { eventId?: string; location?: string; notes?: string }) {
    try {
      const checkIn = await prisma.checkIn.create({
        data: {
          userId,
          type: data.eventId ? 'event' : 'location',
          targetId: data.eventId,
          location: data.location,
          metadata: data.notes ? { notes: data.notes } : undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return this.success(checkIn);
    } catch (error) {
      return this.error('Failed to check in', error);
    }
  }

  /**
   * Check out user
   */
  async checkOut(userId: string, checkInId: string) {
    try {
      const checkIn = await prisma.checkIn.findUnique({
        where: { id: checkInId },
      });

      if (!checkIn) {
        return this.error('Check-in record not found');
      }

      if (checkIn.userId !== userId) {
        return this.error('Unauthorized to check out');
      }

      const updatedCheckIn = await prisma.checkIn.update({
        where: { id: checkInId },
        data: {
          metadata: {
            ...(checkIn.metadata as object || {}),
            checkedOutAt: new Date().toISOString(),
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return this.success(updatedCheckIn);
    } catch (error) {
      return this.error('Failed to check out', error);
    }
  }

  /**
   * Get user's check-in history
   */
  async getCheckInHistory(userId: string, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      const checkIns = await prisma.checkIn.findMany({
        where: { userId },
        orderBy: { checkInTime: 'desc' },
        skip,
        take: limit,
      });

      const total = await prisma.checkIn.count({
        where: { userId },
      });

      return this.success({
        checkIns,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      return this.error('Failed to get check-in history', error);
    }
  }

  /**
   * Get event check-ins
   */
  async getEventCheckIns(eventId: string, page = 1, limit = 50) {
    try {
      const skip = (page - 1) * limit;

      const checkIns = await prisma.checkIn.findMany({
        where: { 
          type: 'event',
          targetId: eventId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { checkInTime: 'desc' },
        skip,
        take: limit,
      });

      const total = await prisma.checkIn.count({
        where: { 
          type: 'event',
          targetId: eventId,
        },
      });

      return this.success({
        checkIns,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      return this.error('Failed to get event check-ins', error);
    }
  }

  /**
   * Get check-in statistics
   */
  async getCheckInStats(eventId?: string) {
    try {
      const where = eventId ? { type: 'event' as const, targetId: eventId } : {};

      const totalCheckIns = await prisma.checkIn.count({ where });
      const activeCheckIns = await prisma.checkIn.count({
        where,
      });

      return this.success({
        total: totalCheckIns,
        active: activeCheckIns,
        completed: totalCheckIns - activeCheckIns,
      });
    } catch (error) {
      return this.error('Failed to get check-in stats', error);
    }
  }
}

export const checkInService = new CheckInService();
