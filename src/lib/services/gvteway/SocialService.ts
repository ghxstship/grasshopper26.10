/**
 * GVTEWAY Social Service
 * Handles social features for consumer platform
 */

import { BaseService, ServiceResult, PaginationOptions, PaginatedResult } from '../base/BaseService';
import { Prisma } from '@prisma/client';
import { NotificationService } from '../shared/NotificationService';

export interface CreatePostInput {
  userId: string;
  eventId?: string;
  content: string;
  images?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdatePostInput {
  content?: string;
  images?: string[];
  metadata?: Record<string, unknown>;
}

export interface CreateCommentInput {
  postId: string;
  userId: string;
  content: string;
}

export interface PostFilters {
  userId?: string;
  eventId?: string;
  search?: string;
}

export class SocialService extends BaseService {
  private notificationService: NotificationService;

  constructor() {
    super();
    this.notificationService = new NotificationService();
  }

  /**
   * Create a social post
   */
  async createPost(input: CreatePostInput): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      this.validateRequired(input as unknown as Record<string, unknown>, ['userId', 'content']);

      const post = await this.prisma.socialPost.create({
        data: {
          userId: input.userId,
          eventId: input.eventId,
          content: input.content,
          images: input.images || [],
          ...(input.metadata && { metadata: input.metadata as Prisma.InputJsonValue }),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          event: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      await this.logAudit(input.userId, 'CREATE', 'SocialPost', post.id);

      return post;
    }, 'createPost');
  }

  /**
   * Get post by ID
   */
  async getPost(id: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const post = await this.prisma.socialPost.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          event: {
            select: {
              id: true,
              name: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 10,
          },
          likedBy: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            take: 10,
          },
          _count: {
            select: {
              comments: true,
              likedBy: true,
            },
          },
        },
      });

      if (!post) {
        throw {
          name: 'NotFoundError',
          message: 'Post not found',
        };
      }

      return post;
    }, 'getPost');
  }

  /**
   * List posts with filters and pagination
   */
  async listPosts(
    filters?: PostFilters,
    pagination?: PaginationOptions
  ): Promise<ServiceResult<PaginatedResult<unknown>>> {
    return this.execute(async () => {
      const { skip, limit } = this.buildPagination(pagination);

      const where: Prisma.SocialPostWhereInput = {};

      if (filters?.userId) where.userId = filters.userId;
      if (filters?.eventId) where.eventId = filters.eventId;

      if (filters?.search) {
        where.content = { contains: filters.search, mode: 'insensitive' };
      }

      const [posts, total] = await Promise.all([
        this.prisma.socialPost.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            event: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                comments: true,
                likedBy: true,
              },
            },
          },
        }),
        this.prisma.socialPost.count({ where }),
      ]);

      return this.buildPaginatedResult(posts, total, pagination);
    }, 'listPosts');
  }

  /**
   * Update post
   */
  async updatePost(
    id: string,
    input: UpdatePostInput,
    userId: string
  ): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const existing = await this.prisma.socialPost.findUnique({
        where: { id },
      });

      if (!existing) {
        throw {
          name: 'NotFoundError',
          message: 'Post not found',
        };
      }

      if (existing.userId !== userId) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not have permission to update this post',
        };
      }

      const post = await this.prisma.socialPost.update({
        where: { id },
        data: {
          ...(input.content && { content: input.content }),
          ...(input.images && { images: input.images }),
          ...(input.metadata && { metadata: input.metadata as Prisma.InputJsonValue }),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      await this.logAudit(userId, 'UPDATE', 'SocialPost', id);

      return post;
    }, 'updatePost');
  }

  /**
   * Delete post
   */
  async deletePost(id: string, userId: string): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const existing = await this.prisma.socialPost.findUnique({
        where: { id },
      });

      if (!existing) {
        throw {
          name: 'NotFoundError',
          message: 'Post not found',
        };
      }

      if (existing.userId !== userId) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not have permission to delete this post',
        };
      }

      await this.prisma.socialPost.delete({
        where: { id },
      });

      await this.logAudit(userId, 'DELETE', 'SocialPost', id);
    }, 'deletePost');
  }

  /**
   * Add comment to post
   */
  async addComment(input: CreateCommentInput): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      this.validateRequired(input as unknown as Record<string, unknown>, [
        'postId',
        'userId',
        'content',
      ]);

      const comment = await this.prisma.socialComment.create({
        data: {
          postId: input.postId,
          userId: input.userId,
          content: input.content,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          post: {
            select: {
              userId: true,
            },
          },
        },
      });

      await this.logAudit(input.userId, 'COMMENT', 'SocialPost', input.postId);

      // Notify post author
      if (comment.post.userId !== input.userId) {
        await this.notificationService.create({
          userId: comment.post.userId,
          title: 'New Comment',
          message: 'Someone commented on your post',
          type: 'SOCIAL_COMMENT',
          actionUrl: `/social/posts/${input.postId}`,
        });
      }

      return comment;
    }, 'addComment');
  }

  /**
   * Delete comment
   */
  async deleteComment(id: string, userId: string): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const comment = await this.prisma.socialComment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw {
          name: 'NotFoundError',
          message: 'Comment not found',
        };
      }

      if (comment.userId !== userId) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not have permission to delete this comment',
        };
      }

      await this.prisma.socialComment.delete({
        where: { id },
      });

      await this.logAudit(userId, 'DELETE_COMMENT', 'SocialPost', comment.postId);
    }, 'deleteComment');
  }

  /**
   * Like post
   */
  async likePost(postId: string, userId: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      // Check if already liked
      const existing = await this.prisma.socialLike.findFirst({
        where: {
          postId,
          userId,
        },
      });

      if (existing) {
        throw {
          name: 'ValidationError',
          message: 'You have already liked this post',
        };
      }

      const like = await this.prisma.socialLike.create({
        data: {
          postId,
          userId,
        },
        include: {
          post: {
            select: {
              userId: true,
            },
          },
        },
      });

      await this.logAudit(userId, 'LIKE', 'SocialPost', postId);

      // Notify post author
      if (like.post.userId !== userId) {
        await this.notificationService.create({
          userId: like.post.userId,
          title: 'New Like',
          message: 'Someone liked your post',
          type: 'SOCIAL_LIKE',
          actionUrl: `/social/posts/${postId}`,
        });
      }

      return like;
    }, 'likePost');
  }

  /**
   * Unlike post
   */
  async unlikePost(postId: string, userId: string): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const like = await this.prisma.socialLike.findFirst({
        where: {
          postId,
          userId,
        },
      });

      if (!like) {
        throw {
          name: 'NotFoundError',
          message: 'Like not found',
        };
      }

      await this.prisma.socialLike.delete({
        where: { id: like.id },
      });

      await this.logAudit(userId, 'UNLIKE', 'SocialPost', postId);
    }, 'unlikePost');
  }

  /**
   * Follow user
   */
  async followUser(followerId: string, followingId: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      if (followerId === followingId) {
        throw {
          name: 'ValidationError',
          message: 'You cannot follow yourself',
        };
      }

      // Check if already following
      const existing = await this.prisma.follow.findFirst({
        where: {
          followerId,
          followingId,
        },
      });

      if (existing) {
        throw {
          name: 'ValidationError',
          message: 'You are already following this user',
        };
      }

      const follow = await this.prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      });

      await this.logAudit(followerId, 'FOLLOW', 'User', followingId);

      await this.notificationService.create({
        userId: followingId,
        title: 'New Follower',
        message: 'Someone started following you',
        type: 'SOCIAL_FOLLOW',
        actionUrl: `/profile/${followerId}`,
      });

      return follow;
    }, 'followUser');
  }

  /**
   * Unfollow user
   */
  async unfollowUser(followerId: string, followingId: string): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const follow = await this.prisma.follow.findFirst({
        where: {
          followerId,
          followingId,
        },
      });

      if (!follow) {
        throw {
          name: 'NotFoundError',
          message: 'Follow relationship not found',
        };
      }

      await this.prisma.follow.delete({
        where: { id: follow.id },
      });

      await this.logAudit(followerId, 'UNFOLLOW', 'User', followingId);
    }, 'unfollowUser');
  }

  /**
   * Get user's followers
   */
  async getFollowers(userId: string): Promise<ServiceResult<unknown[]>> {
    return this.execute(async () => {
      const followers = await this.prisma.follow.findMany({
        where: { followingId: userId },
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return followers;
    }, 'getFollowers');
  }

  /**
   * Get users being followed
   */
  async getFollowing(userId: string): Promise<ServiceResult<unknown[]>> {
    return this.execute(async () => {
      const following = await this.prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          following: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return following;
    }, 'getFollowing');
  }

  /**
   * Get feed for user (posts from followed users)
   */
  async getFeed(userId: string, pagination?: PaginationOptions): Promise<ServiceResult<PaginatedResult<unknown>>> {
    return this.execute(async () => {
      const { skip, limit } = this.buildPagination(pagination);

      // Get users being followed
      const following = await this.prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });

      const followingIds = following.map(f => f.followingId);
      followingIds.push(userId); // Include own posts

      const where: Prisma.SocialPostWhereInput = {
        userId: {
          in: followingIds,
        },
      };

      const [posts, total] = await Promise.all([
        this.prisma.socialPost.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            event: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                comments: true,
                likedBy: true,
              },
            },
          },
        }),
        this.prisma.socialPost.count({ where }),
      ]);

      return this.buildPaginatedResult(posts, total, pagination);
    }, 'getFeed');
  }
}
