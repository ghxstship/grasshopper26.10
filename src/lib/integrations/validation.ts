/**
 * Integration validation utilities
 */

import { z } from 'zod';

/**
 * Stripe validation schemas
 */
export const stripeSchemas = {
  paymentIntent: z.object({
    amount: z.number().int().positive().min(50, { message: 'Amount must be at least $0.50' }),
    currency: z.string().length(3, { message: 'Currency must be 3 characters' }).toLowerCase(),
    customerId: z.string().optional(),
    metadata: z.record(z.string(), z.string()).optional(),
    description: z.string().optional(),
    paymentMethodTypes: z.array(z.string()).optional(),
  }),

  customer: z.object({
    email: z.string().email(),
    name: z.string().optional(),
    metadata: z.record(z.string(), z.string()).optional(),
  }),

  subscription: z.object({
    customerId: z.string().min(1, { message: 'Customer ID is required' }),
    priceId: z.string().min(1, { message: 'Price ID is required' }),
    quantity: z.number().int().positive().optional(),
    trialPeriodDays: z.number().int().positive().optional(),
    metadata: z.record(z.string(), z.string()).optional(),
  }),
};

/**
 * Mapbox validation schemas
 */
export const mapboxSchemas = {
  coordinates: z.object({
    latitude: z.number().min(-90, { message: 'Latitude must be >= -90' }).max(90, { message: 'Latitude must be <= 90' }),
    longitude: z.number().min(-180, { message: 'Longitude must be >= -180' }).max(180, { message: 'Longitude must be <= 180' }),
  }),

  address: z.string().min(3, { message: 'Address must be at least 3 characters' }).max(500, { message: 'Address must be at most 500 characters' }),

  directions: z.object({
    origin: z.object({
      latitude: z.number().min(-90, { message: 'Latitude must be >= -90' }).max(90, { message: 'Latitude must be <= 90' }),
      longitude: z.number().min(-180, { message: 'Longitude must be >= -180' }).max(180, { message: 'Longitude must be <= 180' }),
    }),
    destination: z.object({
      latitude: z.number().min(-90, { message: 'Latitude must be >= -90' }).max(90, { message: 'Latitude must be <= 90' }),
      longitude: z.number().min(-180, { message: 'Longitude must be >= -180' }).max(180, { message: 'Longitude must be <= 180' }),
    }),
    profile: z.enum(['driving', 'walking', 'cycling']).optional(),
  }),
};

/**
 * Web3/NFT validation schemas
 */
export const web3Schemas = {
  ethereumAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid Ethereum address' }),

  nftMetadata: z.object({
    name: z.string().min(1, { message: 'Name is required' }).max(200, { message: 'Name must be at most 200 characters' }),
    description: z.string().min(1, { message: 'Description is required' }).max(2000, { message: 'Description must be at most 2000 characters' }),
    image: z.string().url().or(z.string().startsWith('ipfs://')),
    external_url: z.string().url().optional(),
    attributes: z.array(
      z.object({
        trait_type: z.string(),
        value: z.union([z.string(), z.number()]),
      })
    ).optional(),
    animation_url: z.string().url().or(z.string().startsWith('ipfs://')).optional(),
    background_color: z.string().regex(/^[0-9a-fA-F]{6}$/, { message: 'Invalid hex color' }).optional(),
  }),

  mintParams: z.object({
    recipientAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid recipient address' }),
    metadata: z.any(), // Will be validated separately
    tokenId: z.string().optional(),
    chain: z.enum(['ethereum', 'polygon']).optional(),
  }),

  chain: z.enum(['ethereum', 'polygon']),
};

/**
 * Email validation schemas
 */
export const emailSchemas = {
  sendEmail: z.object({
    to: z.string().email().or(z.array(z.string().email())),
    from: z.string().email().optional(),
    subject: z.string().min(1, { message: 'Subject is required' }).max(200, { message: 'Subject must be at most 200 characters' }),
    text: z.string().optional(),
    html: z.string().optional(),
  }).refine(data => data.text || data.html, {
    message: 'Either text or html content is required',
  }),

  templateEmail: z.object({
    to: z.string().email(),
    templateId: z.string().min(1, { message: 'Template ID is required' }),
    dynamicData: z.record(z.string(), z.any()).optional(),
  }),
};

/**
 * SMS validation schemas
 */
export const smsSchemas = {
  sendSMS: z.object({
    to: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' }),
    from: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' }).optional(),
    body: z.string().min(1, { message: 'Message body is required' }).max(1600, { message: 'Message must be at most 1600 characters' }),
  }),
};

/**
 * Validate data against a schema
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return { success: false, errors: result.error };
}

/**
 * Format validation errors for user-friendly display
 */
export function formatValidationErrors(errors: z.ZodError): string[] {
  return errors.issues.map((err: z.ZodIssue) => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });
}
