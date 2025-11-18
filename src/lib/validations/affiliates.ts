import { z } from 'zod';

// Affiliate creation schema
export const createAffiliateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  company: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  website: z.string().url('Invalid URL').optional(),
  commissionRate: z.number().min(0).max(100, 'Commission rate must be between 0 and 100'),
  paymentMethod: z.enum(['bank_transfer', 'paypal', 'stripe', 'check']),
  paymentDetails: z.record(z.string(), z.any()).optional(),
  notes: z.string().max(1000).optional(),
});

// Affiliate update schema
export const updateAffiliateSchema = createAffiliateSchema.partial();

// Affiliate referral schema
export const createReferralSchema = z.object({
  affiliateId: z.string().uuid('Invalid affiliate ID'),
  customerId: z.string().uuid('Invalid customer ID').optional(),
  orderId: z.string().uuid('Invalid order ID').optional(),
  amount: z.number().positive('Amount must be positive'),
  commission: z.number().positive('Commission must be positive'),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Affiliate payout schema
export const createPayoutSchema = z.object({
  affiliateId: z.string().uuid('Invalid affiliate ID'),
  amount: z.number().positive('Amount must be positive'),
  method: z.enum(['bank_transfer', 'paypal', 'stripe', 'check']),
  reference: z.string().min(1).max(100),
  notes: z.string().max(500).optional(),
});

// Affiliate performance query schema
export const affiliatePerformanceQuerySchema = z.object({
  affiliateId: z.string().uuid('Invalid affiliate ID'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  includeReferrals: z.boolean().default(true),
  includePayouts: z.boolean().default(true),
});

export type CreateAffiliateInput = z.infer<typeof createAffiliateSchema>;
export type UpdateAffiliateInput = z.infer<typeof updateAffiliateSchema>;
export type CreateReferralInput = z.infer<typeof createReferralSchema>;
export type CreatePayoutInput = z.infer<typeof createPayoutSchema>;
export type AffiliatePerformanceQuery = z.infer<typeof affiliatePerformanceQuerySchema>;
