import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export async function POST(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const secret = authenticator.generateSecret();
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    const otpauth = authenticator.keyuri(
      user.email,
      'GHXSTSHIP',
      secret
    );

    const qrCode = await QRCode.toDataURL(otpauth);

    // Store secret temporarily (not enabled until verified)
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorSecret: secret,
        twoFactorEnabled: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        secret,
        qrCode,
        otpauth,
      },
    });
  } catch (error) {
    console.error('2FA enable error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to enable 2FA' } },
      { status: 500 }
    );
  }
}
