/**
 * GVTEWAY Wishlist Service
 * Handles wishlist operations for consumer platform
 */

import { BaseService, ServiceResult } from '../base/BaseService';
import { NotificationService } from '../shared/NotificationService';

export interface AddToWishlistInput {
  userId: string;
  eventId: string;
  notifyOnSale?: boolean;
  metadata?: Record<string, unknown>;
}

export class WishlistService extends BaseService {
  private notificationService: NotificationService;

  constructor() {
    super();
    this.notificationService = new NotificationService();
  }

  /**
   * Add event to wishlist
   */
  async add(input: AddToWishlistInput): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      this.validateRequired(input as unknown as Record<string, unknown>, [
        'userId',
        'eventId',
      ]);

      // Check if already in wishlist
      const existing = await this.prisma.wishlist.findFirst({
        where: {
          userId: input.userId,
          eventId: input.eventId,
        },
      });

      if (existing) {
        throw {
          name: 'ValidationError',
          message: 'Event is already in your wishlist',
        };
      }

      const wishlistItem = await this.prisma.wishlist.create({
        data: {
          userId: input.userId,
          eventId: input.eventId,
          notifyOnSale: input.notifyOnSale || false,
        },
        include: {
          event: {
            include: {
              venue: true,
              organization: true,
            },
          },
        },
      });

      await this.logAudit(input.userId, 'ADD_TO_WISHLIST', 'Wishlist', wishlistItem.id, {
        eventId: input.eventId,
      });

      return wishlistItem;
    }, 'add');
  }

  /**
   * Remove event from wishlist
   */
  async remove(id: string, userId: string): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const item = await this.prisma.wishlist.findUnique({
        where: { id },
      });

      if (!item) {
        throw {
          name: 'NotFoundError',
          message: 'Wishlist item not found',
        };
      }

      if (item.userId !== userId) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not have permission to remove this item',
        };
      }

      await this.prisma.wishlist.delete({
        where: { id },
      });

      await this.logAudit(userId, 'REMOVE_FROM_WISHLIST', 'Wishlist', id, {
        eventId: item.eventId,
      });
    }, 'remove');
  }

  /**
   * Get user's wishlist
   */
  async getUserWishlist(userId: string): Promise<ServiceResult<unknown[]>> {
    return this.execute(async () => {
      const items = await this.prisma.wishlist.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          event: {
            include: {
              venue: true,
              organization: true,
              artists: {
                include: {
                  artist: true,
                },
                take: 3,
              },
            },
          },
        },
      });

      return items;
    }, 'getUserWishlist');
  }

  /**
   * Check if event is in wishlist
   */
  async isInWishlist(userId: string, eventId: string): Promise<ServiceResult<boolean>> {
    return this.execute(async () => {
      const item = await this.prisma.wishlist.findFirst({
        where: {
          userId,
          eventId,
        },
      });

      return !!item;
    }, 'isInWishlist');
  }

  /**
   * Toggle wishlist item
   */
  async toggle(userId: string, eventId: string): Promise<ServiceResult<{ added: boolean }>> {
    return this.execute(async () => {
      const existing = await this.prisma.wishlist.findFirst({
        where: {
          userId,
          eventId,
        },
      });

      if (existing) {
        await this.prisma.wishlist.delete({
          where: { id: existing.id },
        });

        await this.logAudit(userId, 'REMOVE_FROM_WISHLIST', 'Wishlist', existing.id, {
          eventId,
        });

        return { added: false };
      } else {
        const item = await this.prisma.wishlist.create({
          data: {
            userId,
            eventId,
            notifyOnSale: false,
          },
        });

        await this.logAudit(userId, 'ADD_TO_WISHLIST', 'Wishlist', item.id, {
          eventId,
        });

        return { added: true };
      }
    }, 'toggle');
  }

  /**
   * Update notification preference
   */
  async updateNotificationPreference(
    id: string,
    userId: string,
    notifyOnSale: boolean
  ): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const item = await this.prisma.wishlist.findUnique({
        where: { id },
      });

      if (!item) {
        throw {
          name: 'NotFoundError',
          message: 'Wishlist item not found',
        };
      }

      if (item.userId !== userId) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not have permission to update this item',
        };
      }

      const updated = await this.prisma.wishlist.update({
        where: { id },
        data: { notifyOnSale },
      });

      await this.logAudit(userId, 'UPDATE_WISHLIST_NOTIFICATION', 'Wishlist', id, {
        notifyOnSale,
      });

      return updated;
    }, 'updateNotificationPreference');
  }

  /**
   * Notify users when event goes on sale
   */
  async notifyEventOnSale(eventId: string): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const items = await this.prisma.wishlist.findMany({
        where: {
          eventId,
          notifyOnSale: true,
        },
        include: {
          event: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      for (const item of items) {
        await this.notificationService.create({
          userId: item.userId,
          title: 'Event On Sale!',
          message: `${item.event.name} is now on sale!`,
          type: 'EVENT_ON_SALE',
          actionUrl: `/events/${eventId}`,
        });
      }

      await this.logAudit(undefined, 'NOTIFY_WISHLIST_USERS', 'Event', eventId, {
        notifiedCount: items.length,
      });
    }, 'notifyEventOnSale');
  }

  /**
   * Get wishlist count
   */
  async getCount(userId: string): Promise<ServiceResult<number>> {
    return this.execute(async () => {
      const count = await this.prisma.wishlist.count({
        where: { userId },
      });

      return count;
    }, 'getCount');
  }
}
