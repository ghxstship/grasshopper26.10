import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { errors , handleApiError } from '@/lib/api/response';
import { z } from 'zod';

const eventIdSchema = z.object({
  eventId: z.string().cuid(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byUserId(context.userId),
        RATE_LIMITS.READ_OPERATIONS.limit,
        RATE_LIMITS.READ_OPERATIONS.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    const { eventId } = eventIdSchema.parse(await params);
    const supabase = await createClient();

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
    return handleApiError(error);
  }
}
