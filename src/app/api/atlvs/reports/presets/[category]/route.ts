import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleApiError } from '@/lib/api/response';



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    // Database: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
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
    return handleApiError(error);
  }
}
