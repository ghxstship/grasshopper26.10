import { z } from 'zod';
import { idSchema, slugSchema, emailSchema, urlSchema, metadataSchema } from './common';

// Organization type enum
export const organizationTypeSchema = z.enum([
  'VENUE',
  'PROMOTER',
  'PRODUCTION_COMPANY',
  'ARTIST_MANAGEMENT',
  'BRAND',
  'OTHER',
]);

// Create organization
export const createOrganizationSchema = z.object({
  name: z.string().min(1).max(200),
  slug: slugSchema.optional(),
  type: organizationTypeSchema,
  description: z.string().optional(),
  logo: urlSchema.optional(),
  website: urlSchema.optional(),
  email: emailSchema.optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  taxId: z.string().optional(),
  metadata: metadataSchema,
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

// Update organization
export const updateOrganizationSchema = createOrganizationSchema.partial();

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;

// Add member to organization
export const addMemberSchema = z.object({
  userId: idSchema,
  role: z.enum(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']),
});

export type AddMemberInput = z.infer<typeof addMemberSchema>;

// Update member role
export const updateMemberRoleSchema = z.object({
  role: z.enum(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']),
});

export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
