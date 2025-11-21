/**
 * API Route: /api/atlvs/assets/[id]/availability
 * Check asset availability
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AssetService } from '@/lib/services/atlvs/asset.service';
import { handleApiError } from '@/lib/api/response';



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    const { id } = await params;
    const availability = await AssetService.getBookedDates(
      id,
      new Date(startDate),
      new Date(endDate)
    );

    return NextResponse.json(availability);
  } catch (error) {
    return handleApiError(error);
  }
}
