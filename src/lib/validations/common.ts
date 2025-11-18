import { z } from 'zod';

// Common validation schemas
export const idSchema = z.string().cuid();

export const emailSchema = z.string().email();

export const urlSchema = z.string().url();

export const dateSchema = z.coerce.date();

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const searchSchema = z.object({
  query: z.string().min(1).max(100),
});

// User role enums
export const userRoleSchema = z.enum(['CONSUMER', 'EXTERNAL_TEAM', 'INTERNAL_TEAM', 'ADMIN']);

export const orgRoleSchema = z.enum(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']);

export const prioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

export const taskStatusSchema = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);

// Metadata schema
export const metadataSchema = z.record(z.string(), z.unknown()).optional();

// File upload schema
export const fileUploadSchema = z.object({
  filename: z.string(),
  mimeType: z.string(),
  size: z.number().positive(),
  url: z.string().url(),
});

// Coordinates schema
export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

// Currency schema
export const currencySchema = z.string().length(3).transform(val => val.toUpperCase());

// Phone number schema (basic)
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);

// Color hex schema
export const colorHexSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/);

// Slug schema
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

// JSON schema for flexible data
export const jsonSchema: z.ZodType<unknown> = z.union([
  z.record(z.string(), z.unknown()),
  z.array(z.unknown()),
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);
