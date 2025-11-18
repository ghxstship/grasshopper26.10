import { z } from 'zod';

// Team validation schemas
export const createTeamSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
  organizationId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  leaderId: z.string().uuid().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  isActive: z.boolean().default(true),
});

export const updateTeamSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  leaderId: z.string().uuid().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  isActive: z.boolean().optional(),
});

export const addTeamMemberSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['LEADER', 'MEMBER', 'VIEWER']),
  permissions: z.array(z.string()).optional(),
});

export const updateTeamMemberSchema = z.object({
  role: z.enum(['LEADER', 'MEMBER', 'VIEWER']).optional(),
  permissions: z.array(z.string()).optional(),
});

export const teamScheduleSchema = z.object({
  teamId: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  shiftType: z.enum(['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT', 'FULL_DAY']),
  location: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type AddTeamMemberInput = z.infer<typeof addTeamMemberSchema>;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;
export type TeamScheduleInput = z.infer<typeof teamScheduleSchema>;
