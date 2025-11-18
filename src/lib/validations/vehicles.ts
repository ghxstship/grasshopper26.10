import { z } from 'zod';

// Vehicle validation schemas
export const createVehicleSchema = z.object({
  name: z.string().min(2, 'Vehicle name must be at least 2 characters').max(100),
  type: z.enum(['CAR', 'VAN', 'TRUCK', 'BUS', 'TRAILER', 'MOTORCYCLE', 'OTHER']),
  make: z.string().max(50),
  model: z.string().max(50),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  licensePlate: z.string().max(20),
  vin: z.string().max(17).optional(),
  color: z.string().max(30).optional(),
  capacity: z.number().int().positive().optional(),
  fuelType: z.enum(['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID', 'OTHER']).optional(),
  status: z.enum(['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OUT_OF_SERVICE']),
  currentMileage: z.number().nonnegative().optional(),
  organizationId: z.string().uuid(),
  assignedDriverId: z.string().uuid().optional(),
  insuranceExpiry: z.string().datetime().optional(),
  registrationExpiry: z.string().datetime().optional(),
  images: z.array(z.string().url()).optional(),
});

export const updateVehicleSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  type: z.enum(['CAR', 'VAN', 'TRUCK', 'BUS', 'TRAILER', 'MOTORCYCLE', 'OTHER']).optional(),
  make: z.string().max(50).optional(),
  model: z.string().max(50).optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  licensePlate: z.string().max(20).optional(),
  vin: z.string().max(17).optional(),
  color: z.string().max(30).optional(),
  capacity: z.number().int().positive().optional(),
  fuelType: z.enum(['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID', 'OTHER']).optional(),
  status: z.enum(['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OUT_OF_SERVICE']).optional(),
  currentMileage: z.number().nonnegative().optional(),
  assignedDriverId: z.string().uuid().optional(),
  insuranceExpiry: z.string().datetime().optional(),
  registrationExpiry: z.string().datetime().optional(),
  images: z.array(z.string().url()).optional(),
});

export const vehicleMaintenanceSchema = z.object({
  vehicleId: z.string().uuid(),
  type: z.enum(['OIL_CHANGE', 'TIRE_ROTATION', 'BRAKE_SERVICE', 'INSPECTION', 'REPAIR', 'OTHER']),
  description: z.string().min(10).max(2000),
  performedBy: z.string().max(100),
  performedAt: z.string().datetime(),
  mileageAtService: z.number().nonnegative(),
  cost: z.number().positive(),
  nextServiceMileage: z.number().nonnegative().optional(),
  nextServiceDate: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
  invoiceUrl: z.string().url().optional(),
});

export const vehicleReservationSchema = z.object({
  vehicleId: z.string().uuid(),
  userId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  purpose: z.string().max(500),
  estimatedMileage: z.number().nonnegative().optional(),
  notes: z.string().max(1000).optional(),
});

export const vehicleTripLogSchema = z.object({
  vehicleId: z.string().uuid(),
  driverId: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  startMileage: z.number().nonnegative(),
  endMileage: z.number().nonnegative(),
  startLocation: z.string().max(200),
  endLocation: z.string().max(200),
  purpose: z.string().max(500),
  fuelCost: z.number().nonnegative().optional(),
  notes: z.string().max(1000).optional(),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type VehicleMaintenanceInput = z.infer<typeof vehicleMaintenanceSchema>;
export type VehicleReservationInput = z.infer<typeof vehicleReservationSchema>;
export type VehicleTripLogInput = z.infer<typeof vehicleTripLogSchema>;
