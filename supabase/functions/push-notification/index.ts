/**
 * Push Notification Edge Function
 * Handles push notifications via Firebase Cloud Messaging (FCM)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const FCM_SERVER_KEY = Deno.env.get('FCM_SERVER_KEY');

interface PushNotificationRequest {
  userId?: string;
  deviceTokens?: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
  badge?: number;
  sound?: string;
  clickAction?: string;
  priority?: 'high' | 'normal';
  ttl?: number;
}

interface FCMMessage {
  to?: string;
  registration_ids?: string[];
  notification: {
    title: string;
    body: string;
    image?: string;
    sound?: string;
    badge?: number;
    click_action?: string;
  };
  data?: Record<string, string>;
  priority?: string;
  time_to_live?: number;
}

/**
 * Get device tokens for a user
 */
async function getUserDeviceTokens(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_devices')
    .select('fcm_token')
    .eq('user_id', userId)
    .eq('is_active', true)
    .not('fcm_token', 'is', null);

  if (error) {
    console.error('Error fetching device tokens:', error);
    return [];
  }

  return data.map((d) => d.fcm_token).filter(Boolean);
}

/**
 * Send push notification via FCM
 */
async function sendFCMNotification(
  tokens: string[],
  notification: PushNotificationRequest
): Promise<{ success: number; failure: number; results: unknown[] }> {
  if (!FCM_SERVER_KEY) {
    throw new Error('FCM_SERVER_KEY not configured');
  }

  const message: FCMMessage = {
    registration_ids: tokens,
    notification: {
      title: notification.title,
      body: notification.body,
      image: notification.imageUrl,
      sound: notification.sound || 'default',
      badge: notification.badge,
      click_action: notification.clickAction,
    },
    data: notification.data,
    priority: notification.priority || 'high',
    time_to_live: notification.ttl || 86400, // 24 hours default
  };

  const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Authorization': `key=${FCM_SERVER_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`FCM API error: ${error}`);
  }

  const result = await response.json();
  return {
    success: result.success || 0,
    failure: result.failure || 0,
    results: result.results || [],
  };
}

/**
 * Log notification delivery
 */
async function logNotification(
  supabase: ReturnType<typeof createClient>,
  userId: string | undefined,
  tokens: string[],
  notification: PushNotificationRequest,
  result: { success: number; failure: number }
) {
  await supabase.from('push_notification_logs').insert({
    user_id: userId,
    device_count: tokens.length,
    title: notification.title,
    body: notification.body,
    data: notification.data,
    success_count: result.success,
    failure_count: result.failure,
    sent_at: new Date().toISOString(),
  });
}

/**
 * Update badge count for user
 */
async function updateBadgeCount(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  increment: boolean = true
) {
  if (increment) {
    await supabase.rpc('increment_badge_count', { p_user_id: userId });
  } else {
    await supabase
      .from('user_devices')
      .update({ badge_count: 0 })
      .eq('user_id', userId);
  }
}

serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    // Verify authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const body: PushNotificationRequest = await req.json();
    const { userId, deviceTokens, title, body: notificationBody, badge } = body;

    // Validate required fields
    if (!title || !notificationBody) {
      return new Response(
        JSON.stringify({ error: 'Title and body are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get device tokens
    let tokens: string[] = [];
    if (deviceTokens && deviceTokens.length > 0) {
      tokens = deviceTokens;
    } else if (userId) {
      tokens = await getUserDeviceTokens(supabase, userId);
    } else {
      return new Response(
        JSON.stringify({ error: 'Either userId or deviceTokens must be provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (tokens.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No device tokens found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send notification
    const result = await sendFCMNotification(tokens, body);

    // Update badge count if specified
    if (userId && badge !== undefined) {
      await updateBadgeCount(supabase, userId, badge > 0);
    }

    // Log notification
    await logNotification(supabase, userId, tokens, body, result);

    return new Response(
      JSON.stringify({
        success: true,
        sent: result.success,
        failed: result.failure,
        total: tokens.length,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Push notification error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to send push notification',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
