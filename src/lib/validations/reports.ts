import { z } from 'zod';

// Report Type Enum
export const reportTypeSchema = z.enum([
  'FINANCIAL',
  'PROJECT',
  'ASSET',
  'BUDGET',
  'TASK',
  'TEAM',
  'CUSTOM'
]);

// Report Format Enum
export const reportFormatSchema = z.enum([
  'PDF',
  'EXCEL',
  'CSV',
  'JSON'
]);

// Report Frequency Enum
export const reportFrequencySchema = z.enum([
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'QUARTERLY',
  'YEARLY',
  'ONE_TIME'
]);

// Create Report Schema
export const createReportSchema = z.object({
  name: z.string().min(1, 'Report name is required').max(200),
  description: z.string().max(1000).optional(),
  type: reportTypeSchema,
  format: reportFormatSchema,
  frequency: reportFrequencySchema.optional(),
  filters: z.record(z.string(), z.any()).optional(),
  projectId: z.string().uuid().optional(),
  organizationId: z.string().uuid()
});

// Update Report Schema
export const updateReportSchema = createReportSchema.partial();

// Generate Report Schema
export const generateReportSchema = z.object({
  reportId: z.string().uuid(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  filters: z.record(z.string(), z.any()).optional()
});

// Schedule Report Schema
export const scheduleReportSchema = z.object({
  reportId: z.string().uuid(),
  frequency: reportFrequencySchema,
  recipients: z.array(z.string().email()).min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional()
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type UpdateReportInput = z.infer<typeof updateReportSchema>;
export type GenerateReportInput = z.infer<typeof generateReportSchema>;
export type ScheduleReportInput = z.infer<typeof scheduleReportSchema>;
