import { prisma } from '@/lib/prisma';
import { BaseService } from '../base/BaseService';

export class ReferralService extends BaseService {
  /**
   * Generate referral code for user
   */
  async generateReferralCode(userId: string) {
    try {
      // Check if user already has a referral code
      const existing = await prisma.referralLink.findFirst({
        where: { userId },
      });

      if (existing) {
        return this.success(existing);
      }

      // Generate unique code
      const code = this.generateUniqueCode();

      const referral = await prisma.referralLink.create({
        data: {
          userId,
          code,
          targetType: 'user',
          targetId: userId,
        },
      });

      return this.success(referral);
    } catch (error) {
      return this.error('Failed to generate referral code', error);
    }
  }

  /**
   * Track referral usage
   */
  async trackReferral(code: string, referredUserId: string) {
    try {
      const referral = await prisma.referralLink.findUnique({
        where: { code },
      });

      if (!referral) {
        return this.error('Invalid referral code');
      }

      // Check if user already used this code
      const existingUse = await prisma.referralLinkUse.findFirst({
        where: {
          referralId: referral.id,
          referredUserId,
        },
      });

      if (existingUse) {
        return this.error('Referral code already used');
      }

      const referralUse = await prisma.referralLinkUse.create({
        data: {
          referralId: referral.id,
          referredUserId,
        },
      });

      // Update referral count
      await prisma.referralLink.update({
        where: { id: referral.id },
        data: {
          conversions: { increment: 1 },
        },
      });

      return this.success(referralUse);
    } catch (error) {
      return this.error('Failed to track referral', error);
    }
  }

  /**
   * Get referral statistics
   */
  async getReferralStats(userId: string) {
    try {
      const referral = await prisma.referralLink.findFirst({
        where: { userId },
        include: {
          uses: true,
        },
      });

      if (!referral) {
        return this.error('Referral not found');
      }

      return this.success({
        code: referral.code,
        clicks: referral.clicks,
        conversions: referral.conversions,
        revenue: referral.revenue,
        uses: referral.uses || [],
      });
    } catch (error) {
      return this.error('Failed to get referral stats', error);
    }
  }

  /**
   * Generate unique referral code
   */
  private generateUniqueCode(): string {
    return `REF-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
  }
}

export const referralService = new ReferralService();
