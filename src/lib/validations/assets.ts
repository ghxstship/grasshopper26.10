/**
 * Validation schemas for Assets (Equipment)
 */

import { z } from 'zod';
import { EquipmentStatus } from '@prisma/client';

export const createAssetSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.string().min(1).max(100),
  serialNumber: z.string().max(100).optional(),
  qrCode: z.string().max(100).optional(),
  condition: z.string().max(50).optional(),
  purchaseDate: z.string().datetime().optional(),
  purchasePrice: z.number().positive().optional(),
  location: z.string().max(200).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const updateAssetSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  type: z.string().min(1).max(100).optional(),
  status: z.nativeEnum(EquipmentStatus).optional(),
  condition: z.string().max(50).optional(),
  location: z.string().max(200).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const assetFiltersSchema = z.object({
  status: z.nativeEnum(EquipmentStatus).optional(),
  type: z.string().optional(),
  location: z.string().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export const bookAssetSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  purpose: z.string().max(500).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const checkAvailabilitySchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const addMaintenanceLogSchema = z.object({
  type: z.enum(['routine', 'repair', 'inspection', 'upgrade']),
  description: z.string().min(1).max(1000),
  cost: z.number().positive().optional(),
  performedBy: z.string().max(200).optional(),
  performedAt: z.string().datetime(),
  nextDue: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;
export type AssetFiltersInput = z.infer<typeof assetFiltersSchema>;
export type BookAssetInput = z.infer<typeof bookAssetSchema>;
export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;
export type AddMaintenanceLogInput = z.infer<typeof addMaintenanceLogSchema>;
