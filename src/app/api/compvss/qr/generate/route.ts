import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const { type, targetId, data, expiresAt } = body;

    // Generate unique QR code
    const code = randomBytes(16).toString('hex');

    const qrCode = await prisma.qRCode.create({
      data: {
        code,
        type,
        targetId,
        data,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        active: true,
      },
    });

    return successResponse({
      ...qrCode,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(code)}`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
