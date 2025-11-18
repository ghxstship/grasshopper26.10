/**
 * Analytics Tracker Edge Function
 * Tracks user events and page views with low latency
 * Batches events and sends to PostHog
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCorsPreFlight } from '../_shared/cors.ts';
import { successResponse, errorResponse, handleError } from '../_shared/response.ts';
import { checkRateLimit, getRateLimitIdentifier, addRateLimitHeaders } from '../_shared/rate-limit.ts';

interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  distinctId?: string;
  timestamp?: string;
}

const POSTHOG_API_KEY = Deno.env.get('POSTHOG_API_KEY')!;
const POSTHOG_HOST = Deno.env.get('POSTHOG_HOST') || 'https://app.posthog.com';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleCorsPreFlight();
  }

  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(req);
    const rateLimit = checkRateLimit(identifier, { maxRequests: 200, windowMs: 60000 });

    if (!rateLimit.allowed) {
      const response = errorResponse(
        'RATE_LIMIT_EXCEEDED',
        'Too many requests. Please try again later.',
        429
      );
      return addRateLimitHeaders(response, {
        ...rateLimit,
        maxRequests: 200,
      });
    }

    const body = await req.json();
    const events: AnalyticsEvent[] = Array.isArray(body) ? body : [body];

    // Validate events
    for (const event of events) {
      if (!event.event) {
        return errorResponse('INVALID_REQUEST', 'Missing event name', 400);
      }
    }

    // Enrich events with edge location and user agent
    const enrichedEvents = events.map((event) => ({
      ...event,
      properties: {
        ...event.properties,
        $ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        $user_agent: req.headers.get('user-agent'),
        $current_url: event.properties.$current_url || req.headers.get('referer'),
        edge_location: req.headers.get('x-vercel-edge-region') || 'unknown',
        timestamp: event.timestamp || new Date().toISOString(),
      },
      timestamp: event.timestamp || new Date().toISOString(),
    }));

    // Send to PostHog
    const posthogResponse = await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: POSTHOG_API_KEY,
        batch: enrichedEvents.map((event) => ({
          event: event.event,
          properties: event.properties,
          distinct_id: event.distinctId || 'anonymous',
          timestamp: event.timestamp,
        })),
      }),
    });

    if (!posthogResponse.ok) {
      console.error('PostHog error:', await posthogResponse.text());
      return errorResponse('ANALYTICS_FAILED', 'Failed to track events', 500);
    }

    const response = successResponse({
      tracked: true,
      count: events.length,
    });

    return addRateLimitHeaders(response, {
      ...rateLimit,
      maxRequests: 200,
    });
  } catch (error) {
    return handleError(error);
  }
});
