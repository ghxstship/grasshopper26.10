import { z } from 'zod';

// Adventure Type Enum
export const adventureTypeSchema = z.enum(['VIP_EXPERIENCE', 'BACKSTAGE_TOUR', 'MEET_AND_GREET', 'EXCLUSIVE_ACCESS', 'PREMIUM_PACKAGE']);

// Adventure Status Enum
export const adventureStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'SOLD_OUT', 'CANCELLED', 'COMPLETED']);

// Create Adventure Schema
export const createAdventureSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  type: adventureTypeSchema,
  eventId: z.string().uuid('Invalid event ID').optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  capacity: z.number().int().min(1, 'Capacity must be at least 1').max(1000),
  duration: z.number().int().min(15, 'Duration must be at least 15 minutes').max(1440), // Max 24 hours
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date'),
  location: z.string().max(500).optional(),
  inclusions: z.array(z.string().max(200)).max(50).optional(),
  exclusions: z.array(z.string().max(200)).max(50).optional(),
  requirements: z.array(z.string().max(200)).max(20).optional(),
  images: z.array(z.string().url()).max(10).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  { message: 'End date must be after start date', path: ['endDate'] }
);

// Update Adventure Schema
export const updateAdventureSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).max(5000).optional(),
  type: adventureTypeSchema.optional(),
  price: z.number().min(0).optional(),
  capacity: z.number().int().min(1).max(1000).optional(),
  duration: z.number().int().min(15).max(1440).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  location: z.string().max(500).optional(),
  status: adventureStatusSchema.optional(),
  inclusions: z.array(z.string().max(200)).max(50).optional(),
  exclusions: z.array(z.string().max(200)).max(50).optional(),
  requirements: z.array(z.string().max(200)).max(20).optional(),
  images: z.array(z.string().url()).max(10).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// Book Adventure Schema
export const bookAdventureSchema = z.object({
  adventureId: z.string().uuid('Invalid adventure ID'),
  userId: z.string().uuid('Invalid user ID'),
  participants: z.number().int().min(1, 'At least 1 participant required').max(20),
  specialRequests: z.string().max(1000).optional(),
  contactEmail: z.string().email('Invalid email'),
  contactPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
});

// Cancel Booking Schema
export const cancelBookingSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
  reason: z.string().min(10, 'Cancellation reason must be at least 10 characters').max(500),
  refundRequested: z.boolean().default(true),
});

// Adventure Query Schema
export const adventureQuerySchema = z.object({
  type: adventureTypeSchema.optional(),
  status: adventureStatusSchema.optional(),
  eventId: z.string().uuid().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  availableOnly: z.boolean().default(false),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'price', 'startDate', 'capacity']).default('startDate'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Type exports
export type CreateAdventureInput = z.infer<typeof createAdventureSchema>;
export type UpdateAdventureInput = z.infer<typeof updateAdventureSchema>;
export type BookAdventureInput = z.infer<typeof bookAdventureSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
export type AdventureQueryInput = z.infer<typeof adventureQuerySchema>;
