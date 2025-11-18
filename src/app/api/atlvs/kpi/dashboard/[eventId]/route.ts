import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
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
    console.error('Error in KPI dashboard API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
