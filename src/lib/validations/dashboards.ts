import { z } from 'zod';

// Widget Type Enum
export const widgetTypeSchema = z.enum([
  'CHART',
  'TABLE',
  'METRIC',
  'LIST',
  'MAP',
  'CALENDAR',
  'TIMELINE'
]);

// Chart Type Enum
export const chartTypeSchema = z.enum([
  'LINE',
  'BAR',
  'PIE',
  'DOUGHNUT',
  'AREA',
  'SCATTER'
]);

// Widget Schema
export const widgetSchema = z.object({
  id: z.string().uuid().optional(),
  type: widgetTypeSchema,
  title: z.string().min(1).max(200),
  chartType: chartTypeSchema.optional(),
  dataSource: z.string().min(1),
  filters: z.record(z.string(), z.any()).optional(),
  position: z.object({
    x: z.number().int().min(0),
    y: z.number().int().min(0),
    width: z.number().int().min(1).max(12),
    height: z.number().int().min(1)
  }),
  refreshInterval: z.number().int().min(0).optional()
});

// Create Dashboard Schema
export const createDashboardSchema = z.object({
  name: z.string().min(1, 'Dashboard name is required').max(200),
  description: z.string().max(1000).optional(),
  isPublic: z.boolean().default(false),
  widgets: z.array(widgetSchema).default([]),
  organizationId: z.string().uuid(),
  projectId: z.string().uuid().optional()
});

// Update Dashboard Schema
export const updateDashboardSchema = createDashboardSchema.partial();

// Add Widget Schema
export const addWidgetSchema = z.object({
  dashboardId: z.string().uuid(),
  widget: widgetSchema
});

// Update Widget Schema
export const updateWidgetSchema = z.object({
  dashboardId: z.string().uuid(),
  widgetId: z.string().uuid(),
  updates: widgetSchema.partial()
});

// Remove Widget Schema
export const removeWidgetSchema = z.object({
  dashboardId: z.string().uuid(),
  widgetId: z.string().uuid()
});

export type WidgetInput = z.infer<typeof widgetSchema>;
export type CreateDashboardInput = z.infer<typeof createDashboardSchema>;
export type UpdateDashboardInput = z.infer<typeof updateDashboardSchema>;
export type AddWidgetInput = z.infer<typeof addWidgetSchema>;
export type UpdateWidgetInput = z.infer<typeof updateWidgetSchema>;
export type RemoveWidgetInput = z.infer<typeof removeWidgetSchema>;
