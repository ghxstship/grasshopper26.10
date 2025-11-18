import { z } from 'zod';
import { idSchema, metadataSchema } from './common';

// Notification type enum
export const notificationTypeSchema = z.enum([
  'ORDER_CONFIRMATION',
  'TICKET_TRANSFER',
  'EVENT_REMINDER',
  'EVENT_UPDATE',
  'EVENT_CANCELLED',
  'PAYMENT_SUCCESS',
  'PAYMENT_FAILED',
  'MEMBERSHIP_RENEWAL',
  'SYSTEM_ALERT',
  'SOCIAL_MENTION',
  'SOCIAL_LIKE',
  'SOCIAL_COMMENT',
  'TASK_ASSIGNED',
  'TASK_COMPLETED',
  'APPROVAL_REQUEST',
  'APPROVAL_GRANTED',
  'APPROVAL_DENIED',
]);

// Notification priority enum
export const notificationPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

// Create notification
export const createNotificationSchema = z.object({
  userId: idSchema,
  type: notificationTypeSchema,
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  priority: notificationPrioritySchema.optional(),
  actionUrl: z.string().url().optional(),
  metadata: metadataSchema,
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;

// Notification filters
export const notificationFiltersSchema = z.object({
  type: notificationTypeSchema.optional(),
  priority: notificationPrioritySchema.optional(),
  read: z.coerce.boolean().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type NotificationFilters = z.infer<typeof notificationFiltersSchema>;

// Mark as read
export const markAsReadSchema = z.object({
  notificationIds: z.array(idSchema).optional(),
  markAll: z.boolean().optional(),
});

export type MarkAsReadInput = z.infer<typeof markAsReadSchema>;
