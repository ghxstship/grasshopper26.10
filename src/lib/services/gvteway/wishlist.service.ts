import { prisma } from '@/lib/prisma';
import { BaseService } from '../base/BaseService';

export class WishlistService extends BaseService {
  /**
   * Get user's wishlist
   */
  async getWishlist(userId: string) {
    try {
      const wishlists = await prisma.wishlist.findMany({
        where: { userId },
        include: {
          event: true,
        },
      });

      return this.success(wishlists);
    } catch (error) {
      return this.error('Failed to get wishlist', error);
    }
  }

  /**
   * Add item to wishlist
   */
  async addItem(userId: string, eventId: string) {
    try {
      // Check if already in wishlist
      const existing = await prisma.wishlist.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      });

      if (existing) {
        return this.error('Event already in wishlist');
      }

      const wishlistItem = await prisma.wishlist.create({
        data: {
          userId,
          eventId,
        },
        include: {
          event: true,
        },
      });

      return this.success(wishlistItem);
    } catch (error) {
      return this.error('Failed to add item to wishlist', error);
    }
  }

  /**
   * Remove item from wishlist
   */
  async removeItem(userId: string, eventId: string) {
    try {
      await prisma.wishlist.delete({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      });

      return this.success({ message: 'Event removed from wishlist' });
    } catch (error) {
      return this.error('Failed to remove item from wishlist', error);
    }
  }

  /**
   * Clear wishlist
   */
  async clearWishlist(userId: string) {
    try {
      await prisma.wishlist.deleteMany({
        where: { userId },
      });

      return this.success({ message: 'Wishlist cleared' });
    } catch (error) {
      return this.error('Failed to clear wishlist', error);
    }
  }
}

export const wishlistService = new WishlistService();
