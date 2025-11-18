/**
 * Wallet Authentication API Endpoint
 * POST /api/auth/wallet - Authenticate with Web3 wallet
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateWithWallet, type WalletAuthParams } from '@/lib/integrations/walletconnect/auth';
import { createSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, signature, message, chainId } = body as WalletAuthParams;

    // Validate input
    if (!address || !signature || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Authenticate with wallet
    const result = await authenticateWithWallet({
      address,
      signature,
      message,
      chainId: chainId || 1,
    });

    if (!result.success || !result.userId) {
      return NextResponse.json(
        { success: false, error: result.error || 'Authentication failed' },
        { status: 401 }
      );
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: result.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Create session
    const session = await createSession({
      id: user.id,
      email: user.email,
      name: user.name || null,
      role: user.role,
    });

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
      walletId: result.walletId,
    });

    // Set session cookie
    response.cookies.set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Wallet authentication error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
