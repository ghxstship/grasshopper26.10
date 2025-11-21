import { NextRequest, NextResponse } from 'next/server';
import getServerSession from 'next-auth';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { authenticator } from 'otplib';
import { z } from 'zod';

const verifySchema = z.object({
  token: z.string().length(6),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
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

    const metadata = user.metadata as any;
    const secret = metadata?.twoFactorSecret;

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
        metadata: {
          ...metadata,
          twoFactorEnabled: true,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: { message: '2FA enabled successfully' },
    });
  } catch (error) {
    console.error('2FA verify error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to verify 2FA' } },
      { status: 500 }
    );
  }
}
