/**
 * Validation schemas for Tasks
 */

import { z } from 'zod';
import { TaskStatus, Priority } from '@prisma/client';

export const createTaskSchema = z.object({
  projectId: z.string().cuid().optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  priority: z.nativeEnum(Priority).optional(),
  assigneeId: z.string().cuid().optional(),
  dueDate: z.string().datetime().optional(),
  startDate: z.string().datetime().optional(),
  estimatedHours: z.number().positive().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  assigneeId: z.string().cuid().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  estimatedHours: z.number().positive().optional(),
  actualHours: z.number().positive().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const taskFiltersSchema = z.object({
  projectId: z.string().cuid().optional(),
  assigneeId: z.string().cuid().optional(),
  createdBy: z.string().cuid().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  search: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export const createTimeEntrySchema = z.object({
  description: z.string().max(500).optional(),
  hours: z.number().positive().max(24),
  date: z.string().datetime(),
  billable: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const addTaskDependencySchema = z.object({
  dependsOnId: z.string().cuid(),
  type: z.enum(['finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish']).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskFiltersInput = z.infer<typeof taskFiltersSchema>;
export type CreateTimeEntryInput = z.infer<typeof createTimeEntrySchema>;
export type AddTaskDependencyInput = z.infer<typeof addTaskDependencySchema>;
