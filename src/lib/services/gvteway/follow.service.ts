/**
 * Follow Service
 * Manages user follow/unfollow relationships and friend connections
 */

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export class FollowService {
  /**
   * Follow a user
   */
  async followUser(followerId: string, followingId: string) {
    try {
      if (followerId === followingId) {
        throw new Error('Cannot follow yourself');
      }

      // Check if already following
      const existing = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });

      if (existing) {
        throw new Error('Already following this user');
      }

      // Create follow relationship
      const follow = await prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
        include: {
          following: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      // Create notification for followed user
      await prisma.notification.create({
        data: {
          userId: followingId,
          type: 'SOCIAL_FOLLOW',
          title: 'New Follower',
          message: 'Someone started following you',
          metadata: { followerId } as Prisma.JsonObject,
        },
      });

      return follow;
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  }

  /**
   * Unfollow a user
   */
  async unfollowUser(followerId: string, followingId: string) {
    try {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  }

  /**
   * Get followers for a user
   */
  async getFollowers(userId: string, limit = 50, offset = 0) {
    try {
      const [followers, total] = await Promise.all([
        prisma.follow.findMany({
          where: { followingId: userId },
          include: {
            follower: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        prisma.follow.count({
          where: { followingId: userId },
        }),
      ]);

      return {
        followers: followers.map((f) => f.follower),
        total,
        hasMore: offset + limit < total,
      };
    } catch (error) {
      console.error('Error fetching followers:', error);
      throw error;
    }
  }

  /**
   * Get following for a user
   */
  async getFollowing(userId: string, limit = 50, offset = 0) {
    try {
      const [following, total] = await Promise.all([
        prisma.follow.findMany({
          where: { followerId: userId },
          include: {
            following: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        prisma.follow.count({
          where: { followerId: userId },
        }),
      ]);

      return {
        following: following.map((f) => f.following),
        total,
        hasMore: offset + limit < total,
      };
    } catch (error) {
      console.error('Error fetching following:', error);
      throw error;
    }
  }

  /**
   * Check if user is following another user
   */
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    try {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });

      return !!follow;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  }

  /**
   * Get follower/following counts
   */
  async getFollowCounts(userId: string) {
    try {
      const [followersCount, followingCount] = await Promise.all([
        prisma.follow.count({
          where: { followingId: userId },
        }),
        prisma.follow.count({
          where: { followerId: userId },
        }),
      ]);

      return {
        followers: followersCount,
        following: followingCount,
      };
    } catch (error) {
      console.error('Error fetching follow counts:', error);
      throw error;
    }
  }

  /**
   * Get mutual followers (friends)
   */
  async getMutualFollowers(userId: string, limit = 50, offset = 0) {
    try {
      // Get users that both follow each other
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });

      const followingIds = following.map((f) => f.followingId);

      const [mutuals, total] = await Promise.all([
        prisma.follow.findMany({
          where: {
            followerId: { in: followingIds },
            followingId: userId,
          },
          include: {
            follower: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          take: limit,
          skip: offset,
        }),
        prisma.follow.count({
          where: {
            followerId: { in: followingIds },
            followingId: userId,
          },
        }),
      ]);

      return {
        mutuals: mutuals.map((m) => m.follower),
        total,
        hasMore: offset + limit < total,
      };
    } catch (error) {
      console.error('Error fetching mutual followers:', error);
      throw error;
    }
  }

  /**
   * Get suggested users to follow
   */
  async getSuggestedUsers(userId: string, limit = 10) {
    try {
      // Get users that the user's followers are following
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });

      const followingIds = following.map((f) => f.followingId);

      // Find users followed by people the user follows, but not by the user
      const suggestions = await prisma.follow.findMany({
        where: {
          followerId: { in: followingIds },
          followingId: {
            notIn: [...followingIds, userId],
          },
        },
        include: {
          following: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        take: limit,
        distinct: ['followingId'],
      });

      return suggestions.map((s) => s.following);
    } catch (error) {
      console.error('Error fetching suggested users:', error);
      throw error;
    }
  }
}

export const followService = new FollowService();
