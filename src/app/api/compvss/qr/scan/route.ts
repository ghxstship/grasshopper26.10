import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const { code } = body;

    const qrCode = await prisma.qRCode.findUnique({
      where: { code },
    });

    if (!qrCode) {
      throw errors.notFound('QR code not found');
    }

    if (!qrCode.active) {
      throw errors.badRequest('QR code is inactive');
    }

    if (qrCode.expiresAt && qrCode.expiresAt < new Date()) {
      throw errors.badRequest('QR code has expired');
    }

    // Increment scan count
    await prisma.qRCode.update({
      where: { code },
      data: { scans: { increment: 1 } },
    });

    return successResponse(qrCode);
  } catch (error) {
    return handleApiError(error);
  }
}
