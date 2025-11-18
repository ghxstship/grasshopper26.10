import { z } from 'zod';

// Advancing request categories
export const advancingCategorySchema = z.enum([
  'ACCESS_CREDENTIALS',
  'SITE_INFRASTRUCTURE',
  'SITE_ASSETS',
  'SITE_UTILITIES',
  'SITE_VEHICLES',
  'HEAVY_EQUIPMENT',
  'TECHNICAL_PRODUCTION',
  'HOSPITALITY',
  'TRAVEL_LODGING',
  'LOGISTICS',
]);

// Advancing request status
export const advancingStatusSchema = z.enum([
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);

// Advancing request priority
export const advancingPrioritySchema = z.enum([
  'LOW',
  'MEDIUM',
  'HIGH',
  'URGENT',
]);

// Create advancing request
export const createAdvancingRequestSchema = z.object({
  eventId: z.string().uuid(),
  category: advancingCategorySchema,
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  priority: advancingPrioritySchema.default('MEDIUM'),
  requestedBy: z.string().uuid(),
  dueDate: z.string().datetime().optional(),
  requirements: z.record(z.string(), z.unknown()).optional(),
  attachments: z.array(z.string().url()).optional(),
});

// Update advancing request
export const updateAdvancingRequestSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  priority: advancingPrioritySchema.optional(),
  status: advancingStatusSchema.optional(),
  dueDate: z.string().datetime().optional(),
  requirements: z.record(z.string(), z.unknown()).optional(),
  attachments: z.array(z.string().url()).optional(),
  reviewNotes: z.string().optional(),
  assignedTo: z.string().uuid().optional(),
});

// Query advancing requests
export const queryAdvancingRequestsSchema = z.object({
  eventId: z.string().uuid().optional(),
  category: advancingCategorySchema.optional(),
  status: advancingStatusSchema.optional(),
  priority: advancingPrioritySchema.optional(),
  requestedBy: z.string().uuid().optional(),
  assignedTo: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['createdAt', 'updatedAt', 'dueDate', 'priority']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Category-specific schemas
export const hospitalityAdvancingSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1),
  priority: advancingPrioritySchema.optional(),
  dueDate: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  type: z.string().optional(),
  people: z.number().int().positive().optional(),
  dietary: z.array(z.string()).optional(),
  timing: z.string().datetime().optional(),
  location: z.string().optional(),
  submissionMetadata: z.record(z.string(), z.unknown()).optional(),
});

export const transportationAdvancingSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1),
  priority: advancingPrioritySchema.optional(),
  dueDate: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  vehicleType: z.string().optional(),
  passengers: z.number().int().positive().optional(),
  pickupLocation: z.string().optional(),
  dropoffLocation: z.string().optional(),
  pickupTime: z.string().datetime().optional(),
  submissionMetadata: z.record(z.string(), z.unknown()).optional(),
});

export const accessAdvancingSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1),
  priority: advancingPrioritySchema.optional(),
  dueDate: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  accessType: z.string().optional(),
  areas: z.array(z.string()).optional(),
  personnel: z.array(z.string()).optional(),
  submissionMetadata: z.record(z.string(), z.unknown()).optional(),
});

export const genericAdvancingSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1),
  priority: advancingPrioritySchema.optional(),
  dueDate: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  submissionMetadata: z.record(z.string(), z.unknown()).optional(),
});

export type AdvancingCategory = z.infer<typeof advancingCategorySchema>;
export type AdvancingStatus = z.infer<typeof advancingStatusSchema>;
export type AdvancingPriority = z.infer<typeof advancingPrioritySchema>;
export type CreateAdvancingRequest = z.infer<typeof createAdvancingRequestSchema>;
export type UpdateAdvancingRequest = z.infer<typeof updateAdvancingRequestSchema>;
export type QueryAdvancingRequests = z.infer<typeof queryAdvancingRequestsSchema>;
export type HospitalityAdvancing = z.infer<typeof hospitalityAdvancingSchema>;
export type TransportationAdvancing = z.infer<typeof transportationAdvancingSchema>;
export type AccessAdvancing = z.infer<typeof accessAdvancingSchema>;
export type GenericAdvancing = z.infer<typeof genericAdvancingSchema>;
