import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const skip = (page - 1) * limit;

    const category = await prisma.eventCategory.findUnique({
      where: { slug },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Category not found' } },
        { status: 404 }
      );
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: {
          categoryId: category.id,
          status: 'PUBLISHED',
          visibility: 'PUBLIC',
        },
        include: {
          venue: { select: { name: true, city: true, state: true } },
          ticketTypes: {
            select: { price: true, quantity: true },
            orderBy: { price: 'asc' },
            take: 1,
          },
        },
        orderBy: { startDate: 'asc' },
        skip,
        take: limit,
      }),
      prisma.event.count({
        where: {
          categoryId: category.id,
          status: 'PUBLISHED',
          visibility: 'PUBLIC',
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        category,
        events,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    console.error('Category events error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch category events' } },
      { status: 500 }
    );
  }
}
