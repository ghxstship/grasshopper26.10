import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const supabase = await createClient();
    const { category } = await params;

    // Get presets for specific category
    const { data, error } = await supabase
      .rpc('get_report_presets_by_category', { p_category: category });

    if (error) {
      console.error('Error fetching category presets:', error);
      return NextResponse.json(
        { error: 'Failed to fetch category presets' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in category presets API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
