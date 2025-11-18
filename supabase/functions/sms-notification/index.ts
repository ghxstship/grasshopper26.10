/**
 * SMS Notification Edge Function
 * Handles SMS sending via Twilio with template support and delivery tracking
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

interface SMSRequest {
  to: string;
  message?: string;
  template?: string;
  variables?: Record<string, string>;
  userId?: string;
  metadata?: Record<string, unknown>;
}

interface SMSTemplate {
  id: string;
  name: string;
  content: string;
}

const templates: Record<string, SMSTemplate> = {
  'ticket-confirmation': {
    id: 'ticket-confirmation',
    name: 'Ticket Confirmation',
    content: 'Hi {{name}}! Your ticket for {{eventName}} on {{date}} is confirmed. Order #{{orderId}}',
  },
  'event-reminder': {
    id: 'event-reminder',
    name: 'Event Reminder',
    content: 'Reminder: {{eventName}} starts in {{hours}} hours at {{venue}}. See you there!',
  },
  'order-update': {
    id: 'order-update',
    name: 'Order Update',
    content: 'Order #{{orderId}} status: {{status}}. {{message}}',
  },
  'verification-code': {
    id: 'verification-code',
    name: 'Verification Code',
    content: 'Your verification code is: {{code}}. Valid for {{minutes}} minutes.',
  },
  'password-reset': {
    id: 'password-reset',
    name: 'Password Reset',
    content: 'Reset your password using this code: {{code}}. Expires in {{minutes}} minutes.',
  },
};

/**
 * Replace template variables with actual values
 */
function processTemplate(template: string, variables: Record<string, string>): string {
  let processed = template;
  for (const [key, value] of Object.entries(variables)) {
    processed = processed.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return processed;
}

/**
 * Send SMS via Twilio
 */
async function sendSMS(to: string, message: string): Promise<{ sid: string; status: string }> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    throw new Error('Twilio credentials not configured');
  }

  const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
  
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: TWILIO_PHONE_NUMBER,
        Body: message,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twilio API error: ${error}`);
  }

  const data = await response.json();
  return {
    sid: data.sid,
    status: data.status,
  };
}

/**
 * Log SMS delivery to database
 */
async function logDelivery(
  supabase: ReturnType<typeof createClient>,
  to: string,
  message: string,
  sid: string,
  status: string,
  userId?: string,
  metadata?: Record<string, unknown>
) {
  await supabase.from('sms_logs').insert({
    to_number: to,
    message,
    twilio_sid: sid,
    status,
    user_id: userId,
    metadata,
    sent_at: new Date().toISOString(),
  });
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
    const body: SMSRequest = await req.json();
    const { to, message, template, variables, userId, metadata } = body;

    // Validate phone number
    if (!to || !/^\+?[1-9]\d{1,14}$/.test(to)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Determine message content
    let finalMessage: string;
    if (template && templates[template]) {
      if (!variables) {
        return new Response(
          JSON.stringify({ error: 'Template variables required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      finalMessage = processTemplate(templates[template].content, variables);
    } else if (message) {
      finalMessage = message;
    } else {
      return new Response(
        JSON.stringify({ error: 'Either message or template must be provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send SMS
    const result = await sendSMS(to, finalMessage);

    // Log delivery
    await logDelivery(supabase, to, finalMessage, result.sid, result.status, userId, metadata);

    return new Response(
      JSON.stringify({
        success: true,
        sid: result.sid,
        status: result.status,
        to,
        message: finalMessage,
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
    console.error('SMS notification error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to send SMS',
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
