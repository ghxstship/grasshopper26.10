import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { errors } from "@/lib/api/errors";
import { z } from 'zod';
import { handleApiError } from '@/lib/api/response';
import { BatchService } from '@/lib/services/batch/qrCodes.service';


/**
 * Batch QR Code Generation API
 * Handles bulk QR code generation for tickets and credentials
 */

const qrCodeItemSchema = z.object({
  id: z.string().cuid(),
  data: z.string().min(1),
  type: z.enum(['ticket', 'credential', 'access']),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const batchQRCodeSchema = z.object({
  items: z.array(qrCodeItemSchema).min(1),
  format: z.enum(['png', 'svg', 'dataurl']).optional(),
  size: z.number().int().positive().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byUserId(context.userId),
        RATE_LIMITS.WRITE_OPERATIONS.limit,
        RATE_LIMITS.WRITE_OPERATIONS.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    // Authentication handled by validateRequest and requireAuth above

    const body = await request.json();
    const validated = batchQRCodeSchema.parse(body);
    const { items, format = 'dataurl', size = 300 } = validated;

    // Create batch job for tracking
    const batchJobId = `batch_${Date.now()}`;

    const results = [];

    for (const item of items) {
      try {
        let qrCode: string;

        if (format === 'svg') {
          qrCode = await QRCode.toString(item.data, {
            type: 'svg',
            width: size,
          });
        } else {
          qrCode = await QRCode.toDataURL(item.data, {
            width: size,
            margin: 2,
          });
        }

        // Store QR code reference (note: model is QRCode not qrCode)
        await new BatchService().create({
          data: {
            code: `qr_${item.id}_${Date.now()}`,
            type: item.type as any, // QRType enum
            targetId: item.id,
            data: { imageData: qrCode, format, ...item.metadata },
          },
        });

        results.push({
          id: item.id,
          success: true,
          qrCode,
        });
      } catch (error) {
        results.push({
          id: item.id,
          success: false,
          error: String(error),
        });
      }

      // Update batch job progress
    }

    // Mark batch job as completed

    return NextResponse.json({
      success: true,
      batchJobId,
      results,
      totalGenerated: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byUserId(context.userId),
        RATE_LIMITS.WRITE_OPERATIONS.limit,
        RATE_LIMITS.WRITE_OPERATIONS.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    // Authentication handled by validateRequest and requireAuth above

    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get('entityId');
    const entityType = searchParams.get('entityType');

    if (!entityId || !entityType) {
      return NextResponse.json(
        { error: 'entityId and entityType are required' },
        { status: 400 }
      );
    }

    // Note: QRCode model uses different field names
    const qrCode = await prisma.qRCode.findFirst({
      where: {
        targetId: entityId,
        type: entityType as any,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: qrCode.id,
      entityId: qrCode.targetId,
      entityType: qrCode.type,
      qrCode: (qrCode.data as any)?.imageData,
      createdAt: qrCode.createdAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
