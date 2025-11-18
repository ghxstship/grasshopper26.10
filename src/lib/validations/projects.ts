/**
 * Validation schemas for Projects
 */

import { z } from 'zod';
import { ProjectStatus, Priority } from '@prisma/client';

export const createProjectSchema = z.object({
  organizationId: z.string().cuid(),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional(),
  priority: z.nativeEnum(Priority).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  budget: z.number().positive().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  budget: z.number().positive().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const projectFiltersSchema = z.object({
  organizationId: z.string().cuid().optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  createdBy: z.string().cuid().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectFiltersInput = z.infer<typeof projectFiltersSchema>;
