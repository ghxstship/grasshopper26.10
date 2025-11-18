import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const item = await prisma.product.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Marketplace item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching marketplace item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marketplace item' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const body = await request.json();

    const item = await prisma.product.update({
      where: { id: resolvedParams.id },
      data: body,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating marketplace item:', error);
    return NextResponse.json(
      { error: 'Failed to update marketplace item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    await prisma.product.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting marketplace item:', error);
    return NextResponse.json(
      { error: 'Failed to delete marketplace item' },
      { status: 500 }
    );
  }
}
