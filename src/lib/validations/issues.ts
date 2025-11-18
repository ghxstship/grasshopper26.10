import { z } from 'zod';

// Issue creation schema
export const createIssueSchema = z.object({
  projectId: z.string().uuid('Invalid project ID').optional(),
  eventId: z.string().uuid('Invalid event ID').optional(),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  category: z.enum([
    'technical',
    'safety',
    'logistics',
    'staffing',
    'equipment',
    'venue',
    'communication',
    'budget',
    'compliance',
    'other'
  ]),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  location: z.string().max(200).optional(),
  reportedBy: z.string().uuid('Invalid user ID'),
  assignedTo: z.string().uuid('Invalid user ID').optional(),
  dueDate: z.string().datetime().optional(),
  attachments: z.array(z.string().url()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Issue update schema
export const updateIssueSchema = createIssueSchema.partial();

// Issue status update schema
export const updateIssueStatusSchema = z.object({
  issueId: z.string().uuid('Invalid issue ID'),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed', 'cancelled']),
  resolution: z.string().max(1000).optional(),
  resolvedBy: z.string().uuid('Invalid user ID').optional(),
  resolvedAt: z.string().datetime().optional(),
});

// Issue comment schema
export const createIssueCommentSchema = z.object({
  issueId: z.string().uuid('Invalid issue ID'),
  content: z.string().min(1, 'Comment cannot be empty').max(2000),
  attachments: z.array(z.string().url()).optional(),
  internal: z.boolean().default(false),
});

// Issue assignment schema
export const assignIssueSchema = z.object({
  issueId: z.string().uuid('Invalid issue ID'),
  assignedTo: z.string().uuid('Invalid user ID'),
  notes: z.string().max(500).optional(),
});

// Issue query schema
export const issueQuerySchema = z.object({
  projectId: z.string().uuid().optional(),
  eventId: z.string().uuid().optional(),
  category: z.string().optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed', 'cancelled']).optional(),
  assignedTo: z.string().uuid().optional(),
  reportedBy: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;
export type UpdateIssueStatusInput = z.infer<typeof updateIssueStatusSchema>;
export type CreateIssueCommentInput = z.infer<typeof createIssueCommentSchema>;
export type AssignIssueInput = z.infer<typeof assignIssueSchema>;
export type IssueQuery = z.infer<typeof issueQuerySchema>;
