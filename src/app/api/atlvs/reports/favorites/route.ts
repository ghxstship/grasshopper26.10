import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { handleApiError } from '@/lib/api/response';
import { errors } from '@/lib/api/errors';



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
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byUserId(context.userId),
        RATE_LIMITS.WRITE_OPERATIONS.limit,
        RATE_LIMITS.WRITE_OPERATIONS.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

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
    return handleApiError(error);
  }
}
