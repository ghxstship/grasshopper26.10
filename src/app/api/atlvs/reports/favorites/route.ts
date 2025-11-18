import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's favorite reports
    const { data, error } = await supabase
      .rpc('get_user_favorite_reports', { p_user_id: user.id });

    if (error) {
      console.error('Error fetching favorite reports:', error);
      return NextResponse.json(
        { error: 'Failed to fetch favorites' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in favorites API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { preset_id, is_favorite } = body;

    // Upsert user preference
    const { data, error } = await supabase
      .from('user_report_preferences')
      .upsert({
        user_id: user.id,
        preset_id,
        is_favorite,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,preset_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating favorite:', error);
      return NextResponse.json(
        { error: 'Failed to update favorite' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in favorites POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
