/**
 * Geolocation Edge Function
 * Returns user's geolocation information and nearby events
 * Uses edge location for low-latency responses
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';
import { handleCorsPreFlight } from '../_shared/cors.ts';
import { successResponse, errorResponse, handleError } from '../_shared/response.ts';
import { checkRateLimit, getRateLimitIdentifier, addRateLimitHeaders } from '../_shared/rate-limit.ts';

interface GeolocationData {
  country: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  currency: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleCorsPreFlight();
  }

  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(req);
    const rateLimit = checkRateLimit(identifier, { maxRequests: 30, windowMs: 60000 });

    if (!rateLimit.allowed) {
      const response = errorResponse(
        'RATE_LIMIT_EXCEEDED',
        'Too many requests. Please try again later.',
        429
      );
      return addRateLimitHeaders(response, {
        ...rateLimit,
        maxRequests: 30,
      });
    }

    // Extract geolocation from headers (provided by edge runtime)
    const country = req.headers.get('x-vercel-ip-country') || 
                    req.headers.get('cf-ipcountry') || 'US';
    const region = req.headers.get('x-vercel-ip-country-region') || '';
    const city = req.headers.get('x-vercel-ip-city') || '';
    const latitude = parseFloat(req.headers.get('x-vercel-ip-latitude') || '0');
    const longitude = parseFloat(req.headers.get('x-vercel-ip-longitude') || '0');
    const timezone = req.headers.get('x-vercel-ip-timezone') || 'UTC';

    const geolocation: GeolocationData = {
      country,
      region,
      city,
      latitude,
      longitude,
      timezone,
      currency: getCurrencyForCountry(country),
    };

    // Get nearby events if coordinates are available
    let nearbyEvents = [];
    
    if (latitude !== 0 && longitude !== 0) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Query events within 50km radius
      const { data, error } = await supabase.rpc('nearby_events', {
        lat: latitude,
        lng: longitude,
        radius_km: 50,
      });

      if (!error && data) {
        nearbyEvents = data.slice(0, 10); // Limit to 10 events
      }
    }

    const response = successResponse({
      geolocation,
      nearbyEvents,
      edgeLocation: req.headers.get('x-vercel-edge-region') || 'unknown',
    });

    return addRateLimitHeaders(response, {
      ...rateLimit,
      maxRequests: 30,
    });
  } catch (error) {
    return handleError(error);
  }
});

/**
 * Get currency code for country
 */
function getCurrencyForCountry(countryCode: string): string {
  const currencyMap: Record<string, string> = {
    US: 'USD',
    GB: 'GBP',
    EU: 'EUR',
    CA: 'CAD',
    AU: 'AUD',
    JP: 'JPY',
    CN: 'CNY',
    IN: 'INR',
    BR: 'BRL',
    MX: 'MXN',
  };

  return currencyMap[countryCode] || 'USD';
}
