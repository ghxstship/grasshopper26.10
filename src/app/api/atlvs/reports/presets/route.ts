import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get all global report presets
    const { data, error } = await supabase
      .from('report_presets')
      .select('*')
      .eq('is_global', true)
      .eq('is_active', true)
      .order('category')
      .order('sort_order');

    if (error) {
      console.error('Error fetching report presets:', error);
      return NextResponse.json(
        { error: 'Failed to fetch report presets' },
        { status: 500 }
      );
    }

    // Group by category
    const grouped = data.reduce((acc, preset) => {
      if (!acc[preset.category]) {
        acc[preset.category] = [];
      }
      acc[preset.category].push(preset);
      return acc;
    }, {} as Record<string, typeof data>);

    return NextResponse.json({
      presets: data,
      grouped,
      total: data.length,
    });
  } catch (error) {
    console.error('Error in report presets API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
