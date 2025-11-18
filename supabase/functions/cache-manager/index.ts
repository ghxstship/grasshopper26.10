/**
 * Cache Manager Edge Function
 * Manages edge caching for frequently accessed data
 * Provides cache invalidation and warming capabilities
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';
import { handleCorsPreFlight } from '../_shared/cors.ts';
import { requireAuth, requireRole } from '../_shared/auth.ts';
import { successResponse, errorResponse, handleError } from '../_shared/response.ts';
import { checkRateLimit, getRateLimitIdentifier, addRateLimitHeaders } from '../_shared/rate-limit.ts';

// In-memory cache with TTL
const cache = new Map<string, { data: any; expiresAt: number }>();

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleCorsPreFlight();
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const key = url.searchParams.get('key');

    // Authenticate user for write operations
    if (action === 'invalidate' || action === 'warm') {
      const user = await requireAuth(req);
      requireRole(user, ['ADMIN', 'INTERNAL_TEAM']);
    }

    // Rate limiting
    const identifier = getRateLimitIdentifier(req);
    const rateLimit = checkRateLimit(identifier, { maxRequests: 100, windowMs: 60000 });

    if (!rateLimit.allowed) {
      const response = errorResponse(
        'RATE_LIMIT_EXCEEDED',
        'Too many requests. Please try again later.',
        429
      );
      return addRateLimitHeaders(response, {
        ...rateLimit,
        maxRequests: 100,
      });
    }

    switch (action) {
      case 'get': {
        if (!key) {
          return errorResponse('INVALID_REQUEST', 'Missing key parameter', 400);
        }

        const cached = cache.get(key);
        
        if (!cached || cached.expiresAt < Date.now()) {
          // Cache miss or expired
          cache.delete(key);
          return successResponse({ hit: false, data: null });
        }

        return successResponse({ hit: true, data: cached.data });
      }

      case 'set': {
        if (!key) {
          return errorResponse('INVALID_REQUEST', 'Missing key parameter', 400);
        }

        const ttl = parseInt(url.searchParams.get('ttl') || '3600');
        const body = await req.json();

        cache.set(key, {
          data: body.data,
          expiresAt: Date.now() + (ttl * 1000),
        });

        return successResponse({ cached: true, key, ttl });
      }

      case 'invalidate': {
        if (!key) {
          // Invalidate all if no key specified
          cache.clear();
          return successResponse({ invalidated: 'all', count: cache.size });
        }

        const deleted = cache.delete(key);
        return successResponse({ invalidated: deleted, key });
      }

      case 'warm': {
        // Warm cache with frequently accessed data
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Cache popular events
        const { data: events } = await supabase
          .from('events')
          .select('*')
          .eq('status', 'PUBLISHED')
          .order('viewCount', { ascending: false })
          .limit(50);

        if (events) {
          events.forEach((event) => {
            cache.set(`event:${event.id}`, {
              data: event,
              expiresAt: Date.now() + 3600000, // 1 hour
            });
          });
        }

        return successResponse({ warmed: true, count: events?.length || 0 });
      }

      case 'stats': {
        // Clean up expired entries
        const now = Date.now();
        for (const [key, value] of cache.entries()) {
          if (value.expiresAt < now) {
            cache.delete(key);
          }
        }

        return successResponse({
          size: cache.size,
          keys: Array.from(cache.keys()),
        });
      }

      default:
        return errorResponse('INVALID_ACTION', 'Invalid action parameter', 400);
    }
  } catch (error) {
    return handleError(error);
  }
});
