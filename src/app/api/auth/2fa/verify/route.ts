import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { authenticator } from 'otplib';
import { z } from 'zod';

const verifySchema = z.object({
  token: z.string().length(6),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = verifySchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    const secret = user.twoFactorSecret;

    if (!secret) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: '2FA not initialized' } },
        { status: 400 }
      );
    }

    const isValid = authenticator.verify({ token: data.token, secret });

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid 2FA token' } },
        { status: 400 }
      );
    }

    // Enable 2FA
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: true,
      },
    });
  } catch (error) {
    console.error('2FA verify error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to verify 2FA' } },
      { status: 500 }
    );
  }
}
