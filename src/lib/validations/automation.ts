import { z } from 'zod';

// Trigger Type Enum
export const triggerTypeSchema = z.enum([
  'MANUAL',
  'SCHEDULE',
  'WEBHOOK',
  'EVENT',
  'CONDITION'
]);

// Action Type Enum
export const actionTypeSchema = z.enum([
  'EMAIL',
  'SMS',
  'NOTIFICATION',
  'API_CALL',
  'DATABASE_UPDATE',
  'FILE_OPERATION',
  'APPROVAL_REQUEST'
]);

// Workflow Status Enum
export const workflowStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'PAUSED',
  'ERROR'
]);

// Node Schema
export const nodeSchema = z.object({
  id: z.string(),
  type: z.enum(['trigger', 'action', 'condition', 'delay']),
  label: z.string().min(1).max(200),
  config: z.record(z.string(), z.any()),
  position: z.object({
    x: z.number(),
    y: z.number()
  })
});

// Edge Schema
export const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional()
});

// Create Workflow Schema
export const createWorkflowSchema = z.object({
  name: z.string().min(1, 'Workflow name is required').max(200),
  description: z.string().max(1000).optional(),
  triggerType: triggerTypeSchema,
  triggerConfig: z.record(z.string(), z.any()),
  nodes: z.array(nodeSchema).min(1),
  edges: z.array(edgeSchema),
  isActive: z.boolean().default(false),
  organizationId: z.string().uuid(),
  projectId: z.string().uuid().optional()
});

// Update Workflow Schema
export const updateWorkflowSchema = createWorkflowSchema.partial();

// Execute Workflow Schema
export const executeWorkflowSchema = z.object({
  workflowId: z.string().uuid(),
  input: z.record(z.string(), z.any()).optional()
});

// Schedule Workflow Schema
export const scheduleWorkflowSchema = z.object({
  workflowId: z.string().uuid(),
  cronExpression: z.string().min(1),
  timezone: z.string().default('UTC')
});

export type NodeInput = z.infer<typeof nodeSchema>;
export type EdgeInput = z.infer<typeof edgeSchema>;
export type CreateWorkflowInput = z.infer<typeof createWorkflowSchema>;
export type UpdateWorkflowInput = z.infer<typeof updateWorkflowSchema>;
export type ExecuteWorkflowInput = z.infer<typeof executeWorkflowSchema>;
export type ScheduleWorkflowInput = z.infer<typeof scheduleWorkflowSchema>;
