import { z } from 'zod';
import { idSchema, slugSchema, dateSchema, metadataSchema } from './common';

// Event status enum
export const eventStatusSchema = z.enum([
  'DRAFT',
  'PUBLISHED',
  'LIVE',
  'COMPLETED',
  'CANCELLED',
]);

export const eventVisibilitySchema = z.enum(['PUBLIC', 'PRIVATE', 'UNLISTED']);

// Create event
export const createEventSchema = z.object({
  organizationId: idSchema,
  name: z.string().min(1).max(200),
  slug: slugSchema.optional(),
  description: z.string().optional(),
  shortDescription: z.string().max(500).optional(),
  imageUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  categoryId: idSchema.optional(),
  venueId: idSchema.optional(),
  startDate: dateSchema,
  endDate: dateSchema.optional(),
  timezone: z.string(),
  status: eventStatusSchema.optional(),
  visibility: eventVisibilitySchema.optional(),
  capacity: z.number().int().positive().optional(),
  featured: z.boolean().optional(),
  metadata: metadataSchema,
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

// Update event
export const updateEventSchema = createEventSchema.partial().omit({ organizationId: true });

export type UpdateEventInput = z.infer<typeof updateEventSchema>;

// Event filters
export const eventFiltersSchema = z.object({
  organizationId: idSchema.optional(),
  categoryId: idSchema.optional(),
  venueId: idSchema.optional(),
  status: eventStatusSchema.optional(),
  visibility: eventVisibilitySchema.optional(),
  featured: z.coerce.boolean().optional(),
  startDateFrom: dateSchema.optional(),
  startDateTo: dateSchema.optional(),
  search: z.string().optional(),
});

export type EventFilters = z.infer<typeof eventFiltersSchema>;

// Ticket type schemas
export const createTicketTypeSchema = z.object({
  eventId: idSchema,
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  currency: z.string().length(3).default('USD'),
  quantity: z.number().int().positive(),
  maxPerOrder: z.number().int().positive().default(10),
  salesStart: dateSchema.optional(),
  salesEnd: dateSchema.optional(),
  metadata: metadataSchema,
});

export type CreateTicketTypeInput = z.infer<typeof createTicketTypeSchema>;

export const updateTicketTypeSchema = createTicketTypeSchema.partial().omit({ eventId: true });

export type UpdateTicketTypeInput = z.infer<typeof updateTicketTypeSchema>;

// Venue schemas
export const createVenueSchema = z.object({
  name: z.string().min(1).max(200),
  slug: slugSchema.optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().optional(),
  country: z.string().min(1),
  postalCode: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  capacity: z.number().int().positive().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  website: z.string().url().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  metadata: metadataSchema,
});

export type CreateVenueInput = z.infer<typeof createVenueSchema>;

export const updateVenueSchema = createVenueSchema.partial();

export type UpdateVenueInput = z.infer<typeof updateVenueSchema>;

// Artist schemas
export const createArtistSchema = z.object({
  name: z.string().min(1).max(200),
  slug: slugSchema.optional(),
  bio: z.string().optional(),
  imageUrl: z.string().url().optional(),
  genre: z.string().optional(),
  website: z.string().url().optional(),
  socialLinks: z.record(z.string(), z.string().url()).optional(),
  verified: z.boolean().optional(),
});

export type CreateArtistInput = z.infer<typeof createArtistSchema>;

export const updateArtistSchema = createArtistSchema.partial();

export type UpdateArtistInput = z.infer<typeof updateArtistSchema>;
