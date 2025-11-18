import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const supabase = await createClient();
    const { eventId } = await params;

    // Get financial KPIs view
    const { data, error } = await supabase
      .from('financial_kpis')
      .select('*')
      .eq('event_id', eventId)
      .single();

    if (error) {
      console.error('Error fetching financial KPIs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch financial KPIs' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in financial KPIs API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
