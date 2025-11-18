import { z } from 'zod';

// Wishlist Item Type Enum
export const wishlistItemTypeSchema = z.enum(['EVENT', 'PRODUCT', 'ADVENTURE', 'TICKET']);

// Wishlist Visibility Enum
export const wishlistVisibilitySchema = z.enum(['PRIVATE', 'PUBLIC', 'SHARED']);

// Create Wishlist Schema
export const createWishlistSchema = z.object({
  name: z.string().min(1, 'Wishlist name is required').max(100),
  description: z.string().max(500).optional(),
  visibility: wishlistVisibilitySchema.default('PRIVATE'),
  userId: z.string().uuid('Invalid user ID'),
});

// Update Wishlist Schema
export const updateWishlistSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  visibility: wishlistVisibilitySchema.optional(),
});

// Add Wishlist Item Schema
export const addWishlistItemSchema = z.object({
  wishlistId: z.string().uuid('Invalid wishlist ID'),
  itemType: wishlistItemTypeSchema,
  itemId: z.string().uuid('Invalid item ID'),
  notes: z.string().max(500).optional(),
  priority: z.number().int().min(1).max(5).default(3),
});

// Update Wishlist Item Schema
export const updateWishlistItemSchema = z.object({
  notes: z.string().max(500).optional(),
  priority: z.number().int().min(1).max(5).optional(),
});

// Remove Wishlist Item Schema
export const removeWishlistItemSchema = z.object({
  wishlistId: z.string().uuid('Invalid wishlist ID'),
  itemId: z.string().uuid('Invalid item ID'),
});

// Share Wishlist Schema
export const shareWishlistSchema = z.object({
  wishlistId: z.string().uuid('Invalid wishlist ID'),
  recipientEmails: z.array(z.string().email()).min(1, 'At least one email required').max(50),
  message: z.string().max(500).optional(),
});

// Wishlist Query Schema
export const wishlistQuerySchema = z.object({
  userId: z.string().uuid().optional(),
  visibility: wishlistVisibilitySchema.optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Type exports
export type CreateWishlistInput = z.infer<typeof createWishlistSchema>;
export type UpdateWishlistInput = z.infer<typeof updateWishlistSchema>;
export type AddWishlistItemInput = z.infer<typeof addWishlistItemSchema>;
export type UpdateWishlistItemInput = z.infer<typeof updateWishlistItemSchema>;
export type RemoveWishlistItemInput = z.infer<typeof removeWishlistItemSchema>;
export type ShareWishlistInput = z.infer<typeof shareWishlistSchema>;
export type WishlistQueryInput = z.infer<typeof wishlistQuerySchema>;
