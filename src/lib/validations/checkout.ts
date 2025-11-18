import { z } from 'zod';
import { idSchema, emailSchema } from './common';

/**
 * Checkout Validation Schemas
 */

// Checkout session creation
export const createCheckoutSessionSchema = z.object({
  items: z.array(z.object({
    priceId: idSchema,
    quantity: z.number().int().positive().max(100),
  })).min(1).max(50),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
  customerEmail: emailSchema.optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  discountCode: z.string().max(50).optional(),
  shippingAddressId: idSchema.optional(),
  billingAddressId: idSchema.optional(),
});

export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;

// Checkout completion
export const completeCheckoutSchema = z.object({
  sessionId: z.string().min(1),
  paymentIntentId: z.string().min(1).optional(),
});

export type CompleteCheckoutInput = z.infer<typeof completeCheckoutSchema>;

// Apply discount code
export const applyDiscountSchema = z.object({
  code: z.string().min(1).max(50),
  cartTotal: z.number().nonnegative(),
});

export type ApplyDiscountInput = z.infer<typeof applyDiscountSchema>;
