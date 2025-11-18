import { z } from 'zod';
import { idSchema, metadataSchema } from './common';

// Order status enum
export const orderStatusSchema = z.enum([
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
]);

// Create order
export const createOrderSchema = z.object({
  eventId: idSchema.optional(),
  items: z.array(
    z.object({
      type: z.enum(['ticket', 'product', 'adventure']),
      itemId: idSchema,
      quantity: z.number().int().positive(),
    })
  ).min(1),
  metadata: metadataSchema,
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// Update order status
export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
  metadata: metadataSchema,
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

// Ticket status enum
export const ticketStatusSchema = z.enum([
  'VALID',
  'USED',
  'TRANSFERRED',
  'CANCELLED',
  'REFUNDED',
]);

// Transfer ticket
export const transferTicketSchema = z.object({
  recipientEmail: z.string().email(),
  message: z.string().max(500).optional(),
});

export type TransferTicketInput = z.infer<typeof transferTicketSchema>;

// Validate ticket (QR scan)
export const validateTicketSchema = z.object({
  qrCode: z.string(),
  location: z.string().optional(),
  metadata: metadataSchema,
});

export type ValidateTicketInput = z.infer<typeof validateTicketSchema>;
