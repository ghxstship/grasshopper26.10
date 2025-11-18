/**
 * Alert Validation Schemas
 */

import { z } from 'zod';

export const alertTypeSchema = z.enum([
  'EVENT_REMINDER',
  'PRICE_DROP',
  'TICKET_AVAILABLE',
  'LINEUP_UPDATE',
  'VENUE_CHANGE',
  'CANCELLATION',
  'GENERAL',
]);

export const createAlertSchema = z.object({
  type: alertTypeSchema,
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  eventId: z.string().uuid().optional(),
  artistId: z.string().uuid().optional(),
  venueId: z.string().uuid().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  expiresAt: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const updateAlertSchema = z.object({
  active: z.boolean().optional(),
  read: z.boolean().optional(),
});

export type CreateAlertInput = z.infer<typeof createAlertSchema>;
export type UpdateAlertInput = z.infer<typeof updateAlertSchema>;
