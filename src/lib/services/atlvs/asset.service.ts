/**
 * ATLVS Asset Service
 * Handles all asset management operations
 */

import { prisma } from '@/lib/prisma';
import { EquipmentStatus, Prisma } from '@prisma/client';
import { AuditService } from '../shared/audit.service';

export class AssetService {
  /**
   * Get all assets with filtering and pagination
   */
  static async getAll(params: {
    status?: EquipmentStatus;
    type?: string;
    location?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, type, location, search, page = 1, limit = 20 } = params;

    const where: Prisma.EquipmentWhereInput = {
      ...(status && { status }),
      ...(type && { type }),
      ...(location && { location: { contains: location, mode: 'insensitive' } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { serialNumber: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [assets, total] = await Promise.all([
      prisma.equipment.findMany({
        where,
        include: {
          bookings: {
            where: {
              status: 'confirmed',
              endDate: { gte: new Date() },
            },
            take: 5,
          },
          maintenanceLogs: {
            orderBy: { performedAt: 'desc' },
            take: 5,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.equipment.count({ where }),
    ]);

    return {
      assets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single asset by ID
   */
  static async getById(id: string) {
    const asset = await prisma.equipment.findUnique({
      where: { id },
      include: {
        bookings: {
          orderBy: { startDate: 'desc' },
        },
        maintenanceLogs: {
          orderBy: { performedAt: 'desc' },
        },
      },
    });

    if (!asset) {
      throw new Error('Asset not found');
    }

    return asset;
  }

  /**
   * Create a new asset
   */
  static async create(data: {
    name: string;
    type: string;
    serialNumber?: string;
    qrCode?: string;
    condition?: string;
    purchaseDate?: Date;
    purchasePrice?: number;
    location?: string;
    metadata?: Prisma.JsonValue;
  }) {
    const asset = await prisma.equipment.create({
      data: {
        ...data,
        status: EquipmentStatus.AVAILABLE,
      },
    });

    await AuditService.log({
      action: 'CREATE',
      entity: 'Equipment',
      entityId: asset.id,
      metadata: { name: data.name, type: data.type },
    });

    return asset;
  }

  /**
   * Update an asset
   */
  static async update(
    id: string,
    userId: string,
    data: Partial<{
      name: string;
      type: string;
      status: EquipmentStatus;
      condition: string;
      location: string;
      metadata: Prisma.JsonValue;
    }>
  ) {
    const updated = await prisma.equipment.update({
      where: { id },
      data,
    });

    await AuditService.log({
      userId,
      action: 'UPDATE',
      entity: 'Equipment',
      entityId: id,
      metadata: data as Record<string, unknown>,
    });

    return updated;
  }

  /**
   * Delete an asset
   */
  static async delete(id: string, userId: string) {
    // Check if asset has active bookings
    const activeBookings = await prisma.equipmentBooking.count({
      where: {
        equipmentId: id,
        status: 'confirmed',
        endDate: { gte: new Date() },
      },
    });

    if (activeBookings > 0) {
      throw new Error('Cannot delete asset with active bookings');
    }

    await prisma.equipment.delete({
      where: { id },
    });

    await AuditService.log({
      userId,
      action: 'DELETE',
      entity: 'Equipment',
      entityId: id,
    });

    return { success: true };
  }

  /**
   * Book an asset
   */
  static async book(data: {
    equipmentId: string;
    userId?: string;
    startDate: Date;
    endDate: Date;
    purpose?: string;
    metadata?: Prisma.JsonValue;
  }) {
    // Check if asset is available
    const asset = await this.getById(data.equipmentId);
    
    if (asset.status !== EquipmentStatus.AVAILABLE) {
      throw new Error('Asset is not available for booking');
    }

    // Check for conflicting bookings
    const conflicts = await prisma.equipmentBooking.count({
      where: {
        equipmentId: data.equipmentId,
        status: 'confirmed',
        OR: [
          {
            AND: [
              { startDate: { lte: data.startDate } },
              { endDate: { gte: data.startDate } },
            ],
          },
          {
            AND: [
              { startDate: { lte: data.endDate } },
              { endDate: { gte: data.endDate } },
            ],
          },
        ],
      },
    });

    if (conflicts > 0) {
      throw new Error('Asset is already booked for this time period');
    }

    const booking = await prisma.equipmentBooking.create({
      data: {
        ...data,
        status: 'confirmed',
      },
    });

    // Update asset status
    await prisma.equipment.update({
      where: { id: data.equipmentId },
      data: { status: EquipmentStatus.IN_USE },
    });

    await AuditService.log({
      userId: data.userId,
      action: 'BOOK',
      entity: 'Equipment',
      entityId: data.equipmentId,
      metadata: { bookingId: booking.id, startDate: data.startDate, endDate: data.endDate },
    });

    return booking;
  }

  /**
   * Check asset availability
   */
  static async getBookedDates(equipmentId: string, startDate: Date, _endDate: Date): Promise<{ available: boolean; conflicts: any[] }> {
    const conflicts = await prisma.equipmentBooking.findMany({
      where: {
        equipmentId: equipmentId,
        status: 'confirmed',
        OR: [
          {
            AND: [
              { startDate: { lte: startDate } },
              { endDate: { gte: startDate } },
            ],
          },
          {
            AND: [
              { startDate: { lte: _endDate } },
              { endDate: { gte: _endDate } },
            ],
          },
        ],
      },
    });

    return {
      available: conflicts.length === 0,
      conflicts,
    };
  }

  /**
   * Get asset calendar
   */
  static async getCalendar(params: {
    equipmentId?: string;
    startDate: Date;
    endDate: Date;
  }) {
    const where: Prisma.EquipmentBookingWhereInput = {
      ...(params.equipmentId && { equipmentId: params.equipmentId }),
      status: 'confirmed',
      OR: [
        {
          AND: [
            { startDate: { lte: params.endDate } },
            { endDate: { gte: params.startDate } },
          ],
        },
      ],
    };

    const bookings = await prisma.equipmentBooking.findMany({
      where,
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    return bookings;
  }

  /**
   * Add maintenance log
   */
  static async addMaintenanceLog(data: {
    equipmentId: string;
    type: string;
    description: string;
    cost?: number;
    performedBy?: string;
    performedAt: Date;
    nextDue?: Date;
    metadata?: Prisma.JsonValue;
  }) {
    const log = await prisma.maintenanceLog.create({
      data: {
        equipmentId: data.equipmentId,
        type: data.type as any,
        description: data.description,
        cost: data.cost,
        performedBy: data.performedBy,
        performedAt: data.performedAt,
        nextDue: data.nextDue,
        metadata: data.metadata,
      },
    });

    // Update asset status if maintenance
    if (data.type === 'repair' || data.type === 'inspection') {
      await prisma.equipment.update({
        where: { id: data.equipmentId },
        data: { status: EquipmentStatus.MAINTENANCE },
      });
    }

    await AuditService.log({
      userId: data.performedBy,
      action: 'MAINTENANCE',
      entity: 'Equipment',
      entityId: data.equipmentId,
      metadata: { type: data.type, cost: data.cost },
    });

    return log;
  }

  /**
   * Get asset analytics
   */
  static async getAnalytics(params: {
    startDate?: Date;
    endDate?: Date;
  }) {
    const { startDate, endDate } = params;

    const where: Prisma.EquipmentWhereInput = {
      ...(startDate && { createdAt: { gte: startDate } }),
      ...(endDate && { createdAt: { lte: endDate } }),
    };

    const [
      totalAssets,
      statusBreakdown,
      typeBreakdown,
      utilizationRate,
      maintenanceCosts,
    ] = await Promise.all([
      prisma.equipment.count({ where }),
      prisma.equipment.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      prisma.equipment.groupBy({
        by: ['type'],
        where,
        _count: true,
      }),
      this.calculateUtilizationRate(startDate, endDate),
      this.calculateMaintenanceCosts(startDate, endDate),
    ]);

    return {
      totalAssets,
      statusBreakdown,
      typeBreakdown,
      utilizationRate,
      maintenanceCosts,
    };
  }

  /**
   * Calculate utilization rate
   */
  private static async calculateUtilizationRate(_startDate?: Date, _endDate?: Date) {
    const totalAssets = await prisma.equipment.count({
      where: { status: { not: EquipmentStatus.RETIRED } },
    });

    if (totalAssets === 0) return 0;

    const inUse = await prisma.equipment.count({
      where: { status: EquipmentStatus.IN_USE },
    });

    return Math.round((inUse / totalAssets) * 100);
  }

  /**
   * Calculate maintenance costs
   */
  private static async calculateMaintenanceCosts(startDate?: Date, endDate?: Date) {
    const where: Prisma.MaintenanceLogWhereInput = {
      ...(startDate && { performedAt: { gte: startDate } }),
      ...(endDate && { performedAt: { lte: endDate } }),
      cost: { not: null },
    };

    const logs = await prisma.maintenanceLog.findMany({
      where,
      select: { cost: true },
    });

    const total = logs.reduce((sum, log) => sum + Number(log.cost || 0), 0);
    return total;
  }
}
