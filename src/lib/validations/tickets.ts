import { z } from 'zod';

// Ticket Type Enum
export const ticketTypeSchema = z.enum(['GENERAL_ADMISSION', 'VIP', 'EARLY_BIRD', 'GROUP', 'STUDENT', 'SENIOR']);

// Ticket Status Enum
export const ticketStatusSchema = z.enum(['ACTIVE', 'USED', 'TRANSFERRED', 'REFUNDED', 'CANCELLED', 'EXPIRED']);

// Create Ticket Schema
export const createTicketSchema = z.object({
  eventId: z.string().uuid('Invalid event ID'),
  userId: z.string().uuid('Invalid user ID'),
  type: ticketTypeSchema,
  price: z.number().min(0, 'Price must be non-negative'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(100, 'Maximum 100 tickets per purchase'),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// Update Ticket Schema
export const updateTicketSchema = z.object({
  status: ticketStatusSchema.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// Transfer Ticket Schema
export const transferTicketSchema = z.object({
  ticketId: z.string().uuid('Invalid ticket ID'),
  recipientEmail: z.string().email('Invalid recipient email'),
  recipientName: z.string().min(1, 'Recipient name is required').max(100),
  message: z.string().max(500, 'Message must be 500 characters or less').optional(),
});

// Validate Ticket Schema
export const validateTicketSchema = z.object({
  ticketId: z.string().uuid('Invalid ticket ID'),
  qrCode: z.string().min(1, 'QR code is required'),
  eventId: z.string().uuid('Invalid event ID'),
  checkInLocation: z.string().max(200).optional(),
});

// Refund Ticket Schema
export const refundTicketSchema = z.object({
  ticketId: z.string().uuid('Invalid ticket ID'),
  reason: z.string().min(10, 'Refund reason must be at least 10 characters').max(500),
  refundAmount: z.number().min(0, 'Refund amount must be non-negative').optional(),
});

// Bulk Ticket Operation Schema
export const bulkTicketOperationSchema = z.object({
  ticketIds: z.array(z.string().uuid()).min(1, 'At least one ticket ID required').max(100, 'Maximum 100 tickets per operation'),
  operation: z.enum(['CANCEL', 'REFUND', 'TRANSFER']),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// Ticket Query Schema
export const ticketQuerySchema = z.object({
  eventId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  status: ticketStatusSchema.optional(),
  type: ticketTypeSchema.optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'price', 'type', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Type exports
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
export type TransferTicketInput = z.infer<typeof transferTicketSchema>;
export type ValidateTicketInput = z.infer<typeof validateTicketSchema>;
export type RefundTicketInput = z.infer<typeof refundTicketSchema>;
export type BulkTicketOperationInput = z.infer<typeof bulkTicketOperationSchema>;
export type TicketQueryInput = z.infer<typeof ticketQuerySchema>;
