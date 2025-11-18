/**
 * API Route: /api/atlvs/assets/calendar
 * Get asset booking calendar
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AssetService } from '@/lib/services/atlvs/asset.service';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const equipmentId = searchParams.get('equipmentId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    const calendar = await AssetService.getCalendar({
      equipmentId: equipmentId || undefined,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    return NextResponse.json(calendar);
  } catch (error) {
    console.error('Error fetching asset calendar:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch asset calendar' },
      { status: 500 }
    );
  }
}
