import { z } from 'zod';

// Equipment validation schemas
export const createEquipmentSchema = z.object({
  name: z.string().min(2, 'Equipment name must be at least 2 characters').max(100),
  description: z.string().max(1000).optional(),
  category: z.enum(['AUDIO', 'VIDEO', 'LIGHTING', 'STAGING', 'POWER', 'RIGGING', 'TRANSPORT', 'COMMUNICATION', 'SAFETY', 'OTHER']),
  manufacturer: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  serialNumber: z.string().max(100).optional(),
  purchaseDate: z.string().datetime().optional(),
  purchasePrice: z.number().positive().optional().nullable(),
  currentValue: z.number().positive().optional().nullable(),
  condition: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'NEEDS_REPAIR']),
  status: z.enum(['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'RETIRED']),
  location: z.string().max(200).optional(),
  organizationId: z.string().uuid(),
  specifications: z.record(z.string(), z.any()).optional(),
  images: z.array(z.string().url()).optional(),
});

export const updateEquipmentSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(1000).optional(),
  category: z.enum(['AUDIO', 'VIDEO', 'LIGHTING', 'STAGING', 'POWER', 'RIGGING', 'TRANSPORT', 'COMMUNICATION', 'SAFETY', 'OTHER']).optional(),
  manufacturer: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  serialNumber: z.string().max(100).optional(),
  purchaseDate: z.string().datetime().optional(),
  purchasePrice: z.number().positive().optional().nullable(),
  currentValue: z.number().positive().optional().nullable(),
  condition: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'NEEDS_REPAIR']).optional(),
  status: z.enum(['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'RETIRED']).optional(),
  location: z.string().max(200).optional(),
  specifications: z.record(z.string(), z.any()).optional(),
  images: z.array(z.string().url()).optional(),
});

export const equipmentMaintenanceSchema = z.object({
  equipmentId: z.string().uuid(),
  type: z.enum(['ROUTINE', 'REPAIR', 'INSPECTION', 'UPGRADE', 'CALIBRATION']),
  description: z.string().min(10).max(2000),
  performedBy: z.string().uuid(),
  performedAt: z.string().datetime(),
  cost: z.number().positive().optional(),
  nextMaintenanceDate: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
  partsReplaced: z.array(z.string()).optional(),
});

export const equipmentCheckoutSchema = z.object({
  equipmentId: z.string().uuid(),
  userId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  checkoutDate: z.string().datetime(),
  expectedReturnDate: z.string().datetime(),
  purpose: z.string().max(500),
  notes: z.string().max(1000).optional(),
});

export const equipmentReturnSchema = z.object({
  returnDate: z.string().datetime(),
  condition: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'NEEDS_REPAIR']),
  notes: z.string().max(1000).optional(),
  damageReport: z.string().max(2000).optional(),
});

export type CreateEquipmentInput = z.infer<typeof createEquipmentSchema>;
export type UpdateEquipmentInput = z.infer<typeof updateEquipmentSchema>;
export type EquipmentMaintenanceInput = z.infer<typeof equipmentMaintenanceSchema>;
export type EquipmentCheckoutInput = z.infer<typeof equipmentCheckoutSchema>;
export type EquipmentReturnInput = z.infer<typeof equipmentReturnSchema>;
