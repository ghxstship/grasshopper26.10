import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleApiError } from '@/lib/api/response';



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    // Database: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
    const supabase = await createClient();
    const { eventId } = await params;

    // Get comprehensive KPI data
    const { data, error } = await supabase
      .rpc('calculate_all_kpis_for_event', { p_event_id: eventId });

    if (error) {
      console.error('Error fetching KPI dashboard:', error);
      return NextResponse.json(
        { error: 'Failed to fetch KPI dashboard' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
