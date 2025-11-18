import { z } from 'zod';

// Check-in creation schema
export const createCheckInSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  eventId: z.string().uuid('Invalid event ID').optional(),
  projectId: z.string().uuid('Invalid project ID').optional(),
  type: z.enum(['event', 'shift', 'location', 'task', 'custom']),
  location: z.object({
    name: z.string().min(1).max(200),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().max(500).optional(),
  }),
  checkInTime: z.string().datetime(),
  method: z.enum(['qr_code', 'nfc', 'manual', 'gps', 'biometric']),
  deviceInfo: z.object({
    type: z.enum(['mobile', 'tablet', 'desktop', 'scanner']),
    os: z.string().optional(),
    browser: z.string().optional(),
    appVersion: z.string().optional(),
  }).optional(),
  notes: z.string().max(500).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Check-out schema
export const createCheckOutSchema = z.object({
  checkInId: z.string().uuid('Invalid check-in ID'),
  checkOutTime: z.string().datetime(),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }).optional(),
  notes: z.string().max(500).optional(),
});

// Bulk check-in schema
export const bulkCheckInSchema = z.object({
  userIds: z.array(z.string().uuid()).min(1).max(100),
  eventId: z.string().uuid('Invalid event ID').optional(),
  projectId: z.string().uuid('Invalid project ID').optional(),
  type: z.enum(['event', 'shift', 'location', 'task', 'custom']),
  location: z.object({
    name: z.string().min(1).max(200),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  checkInTime: z.string().datetime(),
  method: z.enum(['qr_code', 'nfc', 'manual', 'gps', 'biometric']),
});

// Check-in query schema
export const checkInQuerySchema = z.object({
  userId: z.string().uuid().optional(),
  eventId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  type: z.enum(['event', 'shift', 'location', 'task', 'custom']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z.enum(['checked_in', 'checked_out', 'no_show']).optional(),
  location: z.string().optional(),
});

// Check-in statistics schema
export const checkInStatsSchema = z.object({
  eventId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  groupBy: z.enum(['day', 'week', 'month', 'location', 'type']).default('day'),
});

// Location-based check-in validation schema
export const validateLocationCheckInSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  eventId: z.string().uuid('Invalid event ID').optional(),
  currentLocation: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  maxDistance: z.number().positive().default(100), // meters
});

export type CreateCheckInInput = z.infer<typeof createCheckInSchema>;
export type CreateCheckOutInput = z.infer<typeof createCheckOutSchema>;
export type BulkCheckInInput = z.infer<typeof bulkCheckInSchema>;
export type CheckInQuery = z.infer<typeof checkInQuerySchema>;
export type CheckInStats = z.infer<typeof checkInStatsSchema>;
export type ValidateLocationCheckInInput = z.infer<typeof validateLocationCheckInSchema>;
