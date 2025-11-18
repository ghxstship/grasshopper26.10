import { z } from 'zod';
import { idSchema, metadataSchema } from './common';

// Membership tier level enum
export const tierLevelSchema = z.enum(['FREE', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM']);

// Billing period enum
export const billingPeriodSchema = z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY', 'LIFETIME']);

// Create membership tier
export const createMembershipTierSchema = z.object({
  organizationId: idSchema,
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  currency: z.string().length(3).default('USD'),
  interval: z.string().default('month'),
  billingPeriod: billingPeriodSchema,
  benefits: z.any().optional(),
  color: z.string().optional(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  priority: z.number().int().default(0),
});

export type CreateMembershipTierInput = z.infer<typeof createMembershipTierSchema>;

// Update membership tier
export const updateMembershipTierSchema = createMembershipTierSchema
  .partial()
  .omit({ organizationId: true });

export type UpdateMembershipTierInput = z.infer<typeof updateMembershipTierSchema>;

// Subscribe to membership
export const subscribeMembershipSchema = z.object({
  tierId: idSchema,
  paymentMethodId: z.string().optional(),
  metadata: metadataSchema,
});

export type SubscribeMembershipInput = z.infer<typeof subscribeMembershipSchema>;

// Cancel membership
export const cancelMembershipSchema = z.object({
  reason: z.string().max(500).optional(),
  cancelAtPeriodEnd: z.boolean().default(true),
});

export type CancelMembershipInput = z.infer<typeof cancelMembershipSchema>;
