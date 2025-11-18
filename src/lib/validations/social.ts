import { z } from 'zod';
import { idSchema, metadataSchema } from './common';

// Post visibility enum
export const postVisibilitySchema = z.enum(['PUBLIC', 'FOLLOWERS', 'PRIVATE']);

// Create post
export const createPostSchema = z.object({
  content: z.string().min(1).max(5000),
  visibility: postVisibilitySchema.optional(),
  eventId: idSchema.optional(),
  images: z.array(z.string().url()).max(10).optional(),
  metadata: metadataSchema,
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

// Update post
export const updatePostSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  visibility: postVisibilitySchema.optional(),
  metadata: metadataSchema,
});

export type UpdatePostInput = z.infer<typeof updatePostSchema>;

// Create comment
export const createCommentSchema = z.object({
  postId: idSchema,
  content: z.string().min(1).max(2000),
  parentId: idSchema.optional(),
  metadata: metadataSchema,
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

// Post filters
export const postFiltersSchema = z.object({
  userId: idSchema.optional(),
  eventId: idSchema.optional(),
  visibility: postVisibilitySchema.optional(),
  search: z.string().optional(),
});

export type PostFilters = z.infer<typeof postFiltersSchema>;
