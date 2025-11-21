import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createWalletPassSchema = z.object({
  ticketId: z.string(),
  provider: z.enum(['APPLE_WALLET', 'GOOGLE_WALLET']),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createWalletPassSchema.parse(body);

    // Verify ticket ownership
    const ticket = await prisma.ticket.findUnique({
      where: { id: validatedData.ticketId },
      include: {
        event: true,
        ticketType: true,
        walletPass: true,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Ticket not found',
          },
        },
        { status: 404 }
      );
    }

    if (ticket.userId !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not own this ticket',
          },
        },
        { status: 403 }
      );
    }

    // Check if wallet pass already exists
    if (ticket.walletPass) {
      return NextResponse.json({
        success: true,
        data: {
          walletPass: ticket.walletPass,
          message: 'Wallet pass already exists',
        },
      });
    }

    // Generate wallet pass
    const passId = `pass_${ticket.id}_${Date.now()}`;
    const serialNumber = `SN${ticket.qrCode.substring(0, 10)}`;
    
    // In production, this would call Apple/Google Wallet APIs
    const passUrl = await generateWalletPassUrl(
      validatedData.provider,
      ticket,
      passId,
      serialNumber
    );

    // Create wallet pass record
    const walletPass = await prisma.walletPass.create({
      data: {
        ticketId: ticket.id,
        provider: validatedData.provider,
        passId,
        passUrl,
        serialNumber,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        walletPass,
        downloadUrl: passUrl,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: error.issues,
          },
        },
        { status: 400 }
      );
    }

    console.error('Wallet pass creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create wallet pass',
        },
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'ticketId is required',
          },
        },
        { status: 400 }
      );
    }

    const walletPass = await prisma.walletPass.findUnique({
      where: { ticketId },
      include: {
        ticket: {
          include: {
            event: true,
            ticketType: true,
          },
        },
      },
    });

    if (!walletPass) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Wallet pass not found',
          },
        },
        { status: 404 }
      );
    }

    if (walletPass.ticket.userId !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Access denied',
          },
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        walletPass,
      },
    });
  } catch (error) {
    console.error('Wallet pass fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch wallet pass',
        },
      },
      { status: 500 }
    );
  }
}

async function generateWalletPassUrl(
  provider: 'APPLE_WALLET' | 'GOOGLE_WALLET',
  ticket: any,
  passId: string,
  _serialNumber: string
): Promise<string> {
  // This is a placeholder implementation
  // In production, you would:
  // 1. For Apple Wallet: Create .pkpass file using PassKit
  // 2. For Google Wallet: Use Google Wallet API to create pass
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gvteway.com';
  
  if (provider === 'APPLE_WALLET') {
    // Return URL to download .pkpass file
    return `${baseUrl}/api/wallet-passes/${passId}/apple.pkpass`;
  } else {
    // Return Google Wallet save URL
    return `https://pay.google.com/gp/v/save/${passId}`;
  }
}
