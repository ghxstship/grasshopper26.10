import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api/response';
import { DestinationsService } from '@/lib/services/destinations/slug.service';




export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  try {
    const destination = await new DestinationsService().findById({
      where: { slug: resolvedParams.slug },
    });

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(destination);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  try {
    const body = await request.json();

    const destination = await new DestinationsService().update({
      where: { slug: resolvedParams.slug },
      data: body,
    });

    return NextResponse.json(destination);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  try {
    await new DestinationsService().delete({
      where: { slug: resolvedParams.slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
