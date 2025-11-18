import { z } from 'zod';
import { idSchema, slugSchema, urlSchema, metadataSchema } from './common';

// Product category enum
export const productCategorySchema = z.enum([
  'MERCHANDISE',
  'TICKETS',
  'FOOD_BEVERAGE',
  'DIGITAL',
  'OTHER',
]);

// Product status enum
export const productStatusSchema = z.enum([
  'DRAFT',
  'ACTIVE',
  'OUT_OF_STOCK',
  'DISCONTINUED',
]);

// Create product
export const createProductSchema = z.object({
  organizationId: idSchema,
  name: z.string().min(1).max(200),
  slug: slugSchema.optional(),
  description: z.string().optional(),
  shortDescription: z.string().max(500).optional(),
  category: productCategorySchema,
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().optional(),
  currency: z.string().length(3).default('USD'),
  stock: z.number().int().nonnegative(),
  sku: z.string().optional(),
  images: z.array(urlSchema).optional(),
  status: productStatusSchema.optional(),
  featured: z.boolean().optional(),
  weight: z.number().positive().optional(),
  dimensions: z
    .object({
      length: z.number().positive(),
      width: z.number().positive(),
      height: z.number().positive(),
    })
    .optional(),
  metadata: metadataSchema,
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

// Update product
export const updateProductSchema = createProductSchema.partial().omit({ organizationId: true });

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// Product filters
export const productFiltersSchema = z.object({
  organizationId: idSchema.optional(),
  category: productCategorySchema.optional(),
  status: productStatusSchema.optional(),
  featured: z.coerce.boolean().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  inStock: z.coerce.boolean().optional(),
  search: z.string().optional(),
});

export type ProductFilters = z.infer<typeof productFiltersSchema>;

// Cart item
export const addToCartSchema = z.object({
  productId: idSchema,
  quantity: z.number().int().positive().default(1),
  metadata: metadataSchema,
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;

// Update cart item
export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive(),
});

export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
