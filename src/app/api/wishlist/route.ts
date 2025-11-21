import { NextRequest, NextResponse } from 'next/server';
import getServerSession from 'next-auth';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const addToWishlistSchema = z.object({
  eventId: z.string(),
  targetPrice: z.number().optional(),
  notifyOnSale: z.boolean().default(false),
});

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: {
        event: {
          include: {
            venue: {
              select: {
                name: true,
                city: true,
              },
            },
            ticketTypes: {
              select: {
                price: true,
                available: true,
              },
              orderBy: { price: 'asc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: { wishlist },
    });
  } catch (error) {
    console.error('Wishlist fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch wishlist' } },
      { status: 500 }
    );
  }
}

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
    const data = addToWishlistSchema.parse(body);

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        eventId: data.eventId,
        targetPrice: data.targetPrice,
        notifyOnSale: data.notifyOnSale,
      },
      include: {
        event: true,
      },
    });

    return NextResponse.json(
      { success: true, data: { wishlistItem } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to add to wishlist' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'eventId required' } },
        { status: 400 }
      );
    }

    await prisma.wishlist.delete({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Removed from wishlist' },
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to remove from wishlist' } },
      { status: 500 }
    );
  }
}
