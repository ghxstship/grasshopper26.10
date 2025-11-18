import { z } from 'zod';

// Metric Type Enum
export const metricTypeSchema = z.enum([
  'COUNT',
  'SUM',
  'AVERAGE',
  'MIN',
  'MAX',
  'PERCENTAGE'
]);

// Time Period Enum
export const timePeriodSchema = z.enum([
  'HOUR',
  'DAY',
  'WEEK',
  'MONTH',
  'QUARTER',
  'YEAR',
  'CUSTOM'
]);

// Analytics Query Schema
export const analyticsQuerySchema = z.object({
  metric: z.string().min(1),
  metricType: metricTypeSchema,
  dimensions: z.array(z.string()).optional(),
  filters: z.record(z.string(), z.any()).optional(),
  timePeriod: timePeriodSchema,
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  groupBy: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(1000).default(100)
});

// Event Tracking Schema
export const trackEventSchema = z.object({
  eventName: z.string().min(1).max(200),
  eventType: z.string().min(1).max(100),
  properties: z.record(z.string(), z.any()).optional(),
  userId: z.string().uuid().optional(),
  sessionId: z.string().optional(),
  timestamp: z.string().datetime().optional()
});

// Funnel Analysis Schema
export const funnelAnalysisSchema = z.object({
  name: z.string().min(1).max(200),
  steps: z.array(z.object({
    eventName: z.string().min(1),
    filters: z.record(z.string(), z.any()).optional()
  })).min(2),
  timePeriod: timePeriodSchema,
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

// Cohort Analysis Schema
export const cohortAnalysisSchema = z.object({
  cohortEvent: z.string().min(1),
  returnEvent: z.string().min(1),
  cohortSize: timePeriodSchema,
  periods: z.number().int().min(1).max(52),
  startDate: z.string().datetime(),
  filters: z.record(z.string(), z.any()).optional()
});

// Custom Metric Schema
export const customMetricSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  formula: z.string().min(1),
  unit: z.string().max(50).optional(),
  organizationId: z.string().uuid()
});

export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
export type TrackEventInput = z.infer<typeof trackEventSchema>;
export type FunnelAnalysisInput = z.infer<typeof funnelAnalysisSchema>;
export type CohortAnalysisInput = z.infer<typeof cohortAnalysisSchema>;
export type CustomMetricInput = z.infer<typeof customMetricSchema>;
