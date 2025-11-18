/**
 * Loyalty Service
 * Manages loyalty points, rewards, and tier progression
 */

import { LoyaltyTier } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class LoyaltyService {
  /**
   * Get user's loyalty profile
   */
  async getUserLoyalty(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Get or create loyalty points record
      let loyaltyPoints = await prisma.loyaltyPoints.findUnique({
        where: { userId },
      });

      if (!loyaltyPoints) {
        loyaltyPoints = await prisma.loyaltyPoints.create({
          data: {
            userId,
            points: 0,
            lifetime: 0,
            tier: 'BRONZE',
          },
        });
      }

      const transactions = await prisma.loyaltyTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      const tier = (loyaltyPoints.tier || 'BRONZE') as LoyaltyTier;
      return {
        points: loyaltyPoints.points,
        tier,
        transactions,
        nextTier: this.getNextTier(tier),
        pointsToNextTier: this.getPointsToNextTier(loyaltyPoints.points, tier),
      };
    } catch (error) {
      console.error('Error fetching user loyalty:', error);
      throw error;
    }
  }

  /**
   * Award points to user
   */
  async awardPoints(
    userId: string,
    points: number,
    reason: string,
    metadata?: Record<string, unknown>
  ) {
    try {
      // Get or create loyalty points record
      let loyaltyPoints = await prisma.loyaltyPoints.findUnique({
        where: { userId },
      });

      if (!loyaltyPoints) {
        loyaltyPoints = await prisma.loyaltyPoints.create({
          data: {
            userId,
            points: 0,
            lifetime: 0,
            tier: 'BRONZE',
          },
        });
      }

      const oldTier = (loyaltyPoints.tier || 'BRONZE') as LoyaltyTier;
      const newPoints = loyaltyPoints.points + points;
      const newLifetime = loyaltyPoints.lifetime + points;
      const newTier = this.calculateTier(newPoints);

      // Update loyalty points and tier
      const updatedLoyalty = await prisma.loyaltyPoints.update({
        where: { userId },
        data: {
          points: newPoints,
          lifetime: newLifetime,
          tier: newTier,
        },
      });

      // Create transaction record
      const transaction = await prisma.loyaltyTransaction.create({
        data: {
          userId,
          points,
          type: 'EARNED',
          reason,
          metadata: metadata as any,
          balanceAfter: newPoints,
        },
      });

      // Check for tier upgrade
      if (newTier !== oldTier) {
        await this.handleTierUpgrade(userId, oldTier, newTier);
      }

      return {
        loyaltyPoints: updatedLoyalty,
        transaction,
        tierUpgraded: newTier !== oldTier,
      };
    } catch (error) {
      console.error('Error awarding points:', error);
      throw error;
    }
  }

  /**
   * Redeem points for rewards
   */
  async redeemPoints(
    userId: string,
    points: number,
    rewardId: string,
    metadata?: Record<string, unknown>
  ) {
    try {
      const loyaltyPoints = await prisma.loyaltyPoints.findUnique({
        where: { userId },
      });

      if (!loyaltyPoints) {
        throw new Error('Loyalty points not found');
      }

      if (loyaltyPoints.points < points) {
        throw new Error('Insufficient points');
      }

      const newPoints = loyaltyPoints.points - points;

      // Update loyalty points
      const updatedLoyalty = await prisma.loyaltyPoints.update({
        where: { userId },
        data: { points: newPoints },
      });

      // Create redemption transaction
      const transaction = await prisma.loyaltyTransaction.create({
        data: {
          userId,
          points: -points,
          type: 'REDEEMED',
          reason: `Redeemed for reward: ${rewardId}`,
          metadata: { ...metadata, rewardId },
          balanceAfter: newPoints,
        },
      });

      return {
        loyaltyPoints: updatedLoyalty,
        transaction,
      };
    } catch (error) {
      console.error('Error redeeming points:', error);
      throw error;
    }
  }

  /**
   * Get loyalty transactions
   */
  async getTransactions(userId: string, limit = 50, offset = 0) {
    try {
      const [transactions, total] = await Promise.all([
        prisma.loyaltyTransaction.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        prisma.loyaltyTransaction.count({
          where: { userId },
        }),
      ]);

      return {
        transactions,
        total,
        hasMore: offset + limit < total,
      };
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  /**
   * Calculate tier based on points
   */
  private calculateTier(points: number): LoyaltyTier {
    if (points >= 10000) return 'DIAMOND';
    if (points >= 5000) return 'PLATINUM';
    if (points >= 2500) return 'GOLD';
    if (points >= 1000) return 'SILVER';
    return 'BRONZE';
  }

  /**
   * Get next tier
   */
  private getNextTier(currentTier: LoyaltyTier): LoyaltyTier | null {
    const tiers: LoyaltyTier[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];
    const currentIndex = tiers.indexOf(currentTier);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  }

  /**
   * Get points needed for next tier
   */
  private getPointsToNextTier(currentPoints: number, currentTier: LoyaltyTier): number | null {
    const thresholds: Record<LoyaltyTier, number> = {
      BRONZE: 1000,
      SILVER: 2500,
      GOLD: 5000,
      PLATINUM: 10000,
      DIAMOND: Infinity,
    };

    const nextTier = this.getNextTier(currentTier);
    if (!nextTier) return null;

    return thresholds[nextTier] - currentPoints;
  }

  /**
   * Handle tier upgrade notifications
   */
  private async handleTierUpgrade(userId: string, oldTier: LoyaltyTier, newTier: LoyaltyTier) {
    try {
      // Create notification for tier upgrade
      await prisma.notification.create({
        data: {
          userId,
          type: 'LOYALTY_TIER_UPGRADE',
          title: 'Loyalty Tier Upgraded!',
          message: `Congratulations! You've been upgraded from ${oldTier} to ${newTier} tier.`,
          metadata: { oldTier, newTier },
        },
      });
    } catch (error) {
      console.error('Error handling tier upgrade:', error);
      // Don't throw - tier upgrade notification is not critical
    }
  }

  /**
   * Get tier benefits
   */
  getTierBenefits(tier: LoyaltyTier) {
    const benefits: Record<LoyaltyTier, string[]> = {
      BRONZE: ['5% discount on tickets', 'Early access to sales'],
      SILVER: ['10% discount on tickets', 'Priority customer support', 'Free shipping'],
      GOLD: ['15% discount on tickets', 'VIP lounge access', 'Exclusive events'],
      PLATINUM: ['20% discount on tickets', 'Concierge service', 'Premium seating'],
      DIAMOND: ['25% discount on tickets', 'Personal event planner', 'Lifetime benefits'],
    };

    return benefits[tier] || [];
  }
}

export const loyaltyService = new LoyaltyService();
