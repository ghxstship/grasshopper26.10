import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const supabase = await createClient();
    const { eventId } = await params;

    // Calculate marketing KPIs
    const [
      { data: socialEngagement },
      { data: referralRate },
      { data: ugcVolume },
      { data: marketingCPA },
      { data: brandVelocity }
    ] = await Promise.all([
      supabase.rpc('calculate_social_engagement_rate', { p_event_id: eventId }),
      supabase.rpc('calculate_friend_referral_rate', { p_event_id: eventId }),
      supabase.rpc('calculate_ugc_volume', { p_event_id: eventId }),
      supabase.rpc('calculate_marketing_cpa', { p_event_id: eventId }),
      supabase.rpc('calculate_brand_mention_velocity', { p_event_id: eventId })
    ]);

    const kpis = {
      social_engagement_rate: socialEngagement || 0,
      referral_rate: referralRate || 0,
      ugc_volume: ugcVolume || 0,
      marketing_cpa: marketingCPA || 0,
      brand_mention_velocity: brandVelocity || 0,
    };

    return NextResponse.json(kpis);
  } catch (error) {
    console.error('Error in marketing KPIs API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
