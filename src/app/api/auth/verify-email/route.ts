/**
 * Email Verification API Route
 * Agent 1: Database & Auth Architect (using Agent 6's SendGrid integration)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashToken, isTokenExpired } from '@/lib/auth/tokens';
import { emailVerificationSchema } from '@/lib/validations/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validation = emailVerificationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    const { token } = validation.data;

    // Find token
    const tokenHash = hashToken(token);
    const verificationToken = await prisma.emailVerificationToken.findFirst({
      where: {
        token: tokenHash,
        used: false,
      },
      include: {
        user: true,
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (isTokenExpired(verificationToken.expiresAt)) {
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      );
    }

    // Update user email verification status and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: new Date() },
      }),
      prisma.emailVerificationToken.update({
        where: { id: verificationToken.id },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
