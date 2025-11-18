import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');

    const where: any = type ? { type } : {};

    const items = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marketplace items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const item = await prisma.product.create({
      data: body,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating marketplace item:', error);
    return NextResponse.json(
      { error: 'Failed to create marketplace item' },
      { status: 500 }
    );
  }
}
