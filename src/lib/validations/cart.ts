import { z } from 'zod';
import { idSchema } from './common';

/**
 * Cart Item Validation Schemas
 */

// Add item to cart
export const addCartItemSchema = z.object({
  productId: idSchema,
  quantity: z.number().int().positive().max(100),
  variantId: idSchema.optional(),
  customization: z.record(z.string(), z.unknown()).optional(),
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;

// Update cart item
export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive().max(100),
});

export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;

// Cart filters
export const cartFiltersSchema = z.object({
  includeUnavailable: z.coerce.boolean().optional(),
});

export type CartFilters = z.infer<typeof cartFiltersSchema>;
