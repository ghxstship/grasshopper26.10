import { prisma } from '@/lib/prisma';
import { HistoryService } from './HistoryService';

export interface CreateCommentInput {
  requestId: string;
  userId: string;
  content: string;
}

export interface UpdateCommentInput {
  content: string;
}

/**
 * Service for managing comments on advancing requests
 */
export class CommentService {
  private historyService: HistoryService;

  constructor() {
    this.historyService = new HistoryService();
  }

  /**
   * Create a new comment
   */
  async create(input: CreateCommentInput) {
    const comment = await prisma.advancingComment.create({
      data: {
        requestId: input.requestId,
        userId: input.userId,
        content: input.content,
      },
    });

    // Create history entry
    await this.historyService.create({
      requestId: input.requestId,
      userId: input.userId,
      action: 'comment_added',
      metadata: {
        commentId: comment.id,
        preview: input.content.substring(0, 100),
      },
    });

    return comment;
  }

  /**
   * Get comment by ID
   */
  async getById(id: string) {
    const comment = await prisma.advancingComment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    return comment;
  }

  /**
   * List comments for a request
   */
  async listByRequest(requestId: string) {
    return prisma.advancingComment.findMany({
      where: { requestId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Update comment
   */
  async update(id: string, userId: string, input: UpdateCommentInput) {
    const existing = await this.getById(id);

    // Only allow update by comment author
    if (existing.userId !== userId) {
      throw new Error('Unauthorized to update this comment');
    }

    const comment = await prisma.advancingComment.update({
      where: { id },
      data: {
        content: input.content,
      },
    });

    // Create history entry
    await this.historyService.create({
      requestId: existing.requestId,
      userId,
      action: 'comment_updated',
      metadata: {
        commentId: id,
      },
    });

    return comment;
  }

  /**
   * Delete comment
   */
  async delete(id: string, userId: string) {
    const comment = await this.getById(id);

    // Only allow deletion by comment author
    if (comment.userId !== userId) {
      throw new Error('Unauthorized to delete this comment');
    }

    await prisma.advancingComment.delete({
      where: { id },
    });

    // Create history entry
    await this.historyService.create({
      requestId: comment.requestId,
      userId,
      action: 'comment_deleted',
      metadata: {
        commentId: id,
      },
    });

    return { success: true };
  }

  /**
   * Get comment count for a request
   */
  async getCount(requestId: string): Promise<number> {
    return prisma.advancingComment.count({
      where: { requestId },
    });
  }
}
