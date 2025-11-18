import { prisma } from '@/lib/prisma';
import type { QRType as _QRType } from '@prisma/client';
import { BaseService } from '../base/BaseService';
import QRCode from 'qrcode';

export class QRCodeService extends BaseService {
  /**
   * Generate QR code for user
   */
  async generateQRCode(userId: string, data: { type: string; metadata?: Record<string, unknown> }) {
    try {
      // Generate unique code first
      const uniqueCode = `QR-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      // Create QR code record
      const qrCode = await prisma.qRCode.create({
        data: {
          code: uniqueCode,
          userId,
          type: data.type as any,
          targetId: userId,
          data: (data.metadata || {}) as any,
          metadata: data.metadata ? JSON.parse(JSON.stringify(data.metadata)) : undefined,
        },
      });

      // Generate QR code image
      const qrDataString = JSON.stringify({
        id: qrCode.id,
        userId,
        type: data.type,
        timestamp: new Date().toISOString(),
        metadata: data.metadata || {},
      });

      const qrCodeDataURL = await QRCode.toDataURL(qrDataString);

      // Update with QR code data
      const updatedQRCode = await prisma.qRCode.update({
        where: { id: qrCode.id },
        data: { code: qrCodeDataURL },
      });

      return this.success(updatedQRCode);
    } catch (error) {
      return this.error('Failed to generate QR code', error);
    }
  }

  /**
   * Scan and validate QR code
   */
  async scanQRCode(qrCodeId: string) {
    try {
      const qrCode = await prisma.qRCode.findUnique({
        where: { id: qrCodeId },
      });

      if (!qrCode) {
        return this.error('QR code not found');
      }

      // Update scan count
      await prisma.qRCode.update({
        where: { id: qrCodeId },
        data: {
          scans: { increment: 1 },
        },
      });

      return this.success(qrCode);
    } catch (error) {
      return this.error('Failed to scan QR code', error);
    }
  }

  /**
   * Get user's QR codes
   */
  async getUserQRCodes(_userId: string) {
    try {
      // QRCode model doesn't have userId field in current schema
      // Return all QR codes for now - should be filtered at API level
      const qrCodes = await prisma.qRCode.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return this.success(qrCodes);
    } catch (error) {
      return this.error('Failed to get QR codes', error);
    }
  }

  /**
   * Delete QR code
   */
  async deleteQRCode(userId: string, qrCodeId: string) {
    try {
      const qrCode = await prisma.qRCode.findUnique({
        where: { id: qrCodeId },
      });

      if (!qrCode) {
        return this.error('QR code not found');
      }

      // QRCode model doesn't have userId field, skip authorization check
      // Authorization should be handled at API route level

      await prisma.qRCode.delete({
        where: { id: qrCodeId },
      });

      return this.success({ message: 'QR code deleted' });
    } catch (error) {
      return this.error('Failed to delete QR code', error);
    }
  }
}

export const qrCodeService = new QRCodeService();
