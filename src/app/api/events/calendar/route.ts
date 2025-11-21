import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // YYYY-MM
    const category = searchParams.get('category');

    if (!month) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Month parameter required' } },
        { status: 400 }
      );
    }

    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59);

    const where: any = {
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      startDate: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (category) {
      where.categoryId = category;
    }

    const events = await prisma.event.findMany({
      where,
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        imageUrl: true,
        venue: {
          select: {
            name: true,
            city: true,
          },
        },
        ticketTypes: {
          select: {
            price: true,
            quantity: true,
          },
          orderBy: { price: 'asc' },
          take: 1,
        },
      },
      orderBy: { startDate: 'asc' },
    });

    // Group by date
    const calendar: Record<string, any[]> = {};
    events.forEach((event) => {
      const dateKey = event.startDate.toISOString().split('T')[0];
      if (!calendar[dateKey]) {
        calendar[dateKey] = [];
      }
      calendar[dateKey].push(event);
    });

    return NextResponse.json({
      success: true,
      data: {
        month,
        calendar,
        totalEvents: events.length,
      },
    });
  } catch (error) {
    console.error('Calendar events error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to load calendar' } },
      { status: 500 }
    );
  }
}
