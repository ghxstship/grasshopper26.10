/**
 * Scheduler Edge Function
 * Handles cron jobs and scheduled tasks
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface ScheduledJob {
  id: string;
  name: string;
  type: 'event_reminder' | 'ticket_expiry' | 'report_generation' | 'data_cleanup' | 'subscription_renewal';
  schedule: string; // cron expression
  enabled: boolean;
  last_run?: string;
  next_run?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Send event reminders to users
 */
async function sendEventReminders(supabase: ReturnType<typeof createClient>) {
  const now = new Date();
  const reminderWindow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

  // Get events starting in the next 24 hours
  const { data: events, error } = await supabase
    .from('events')
    .select('id, name, start_date, venue_id')
    .gte('start_date', now.toISOString())
    .lte('start_date', reminderWindow.toISOString())
    .eq('status', 'PUBLISHED');

  if (error || !events) {
    console.error('Error fetching events:', error);
    return { processed: 0, errors: 0 };
  }

  let processed = 0;
  let errors = 0;

  for (const event of events) {
    try {
      // Get ticket holders for this event
      const { data: tickets } = await supabase
        .from('tickets')
        .select('user_id, order_id')
        .eq('event_id', event.id)
        .eq('status', 'ACTIVE');

      if (tickets) {
        for (const ticket of tickets) {
          // Send notification
          await supabase.from('notifications').insert({
            user_id: ticket.user_id,
            type: 'EVENT_REMINDER',
            title: 'Event Reminder',
            message: `${event.name} starts tomorrow!`,
            data: { event_id: event.id, order_id: ticket.order_id },
          });
          processed++;
        }
      }
    } catch (err) {
      console.error(`Error processing event ${event.id}:`, err);
      errors++;
    }
  }

  return { processed, errors };
}

/**
 * Check for expired tickets and update status
 */
async function checkExpiredTickets(supabase: ReturnType<typeof createClient>) {
  const now = new Date();

  const { data, error } = await supabase
    .from('tickets')
    .update({ status: 'EXPIRED' })
    .eq('status', 'ACTIVE')
    .lt('expires_at', now.toISOString())
    .select('id');

  if (error) {
    console.error('Error updating expired tickets:', error);
    return { processed: 0, errors: 1 };
  }

  return { processed: data?.length || 0, errors: 0 };
}

/**
 * Generate scheduled reports
 */
async function generateReports(supabase: ReturnType<typeof createClient>) {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Generate daily sales report
  const { data: orders } = await supabase
    .from('orders')
    .select('id, total, status, created_at')
    .gte('created_at', yesterday.toISOString())
    .lt('created_at', now.toISOString());

  const totalSales = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
  const completedOrders = orders?.filter(o => o.status === 'COMPLETED').length || 0;

  // Store report
  await supabase.from('reports').insert({
    type: 'DAILY_SALES',
    date: yesterday.toISOString().split('T')[0],
    data: {
      total_sales: totalSales,
      order_count: orders?.length || 0,
      completed_orders: completedOrders,
    },
    generated_at: now.toISOString(),
  });

  return { processed: 1, errors: 0 };
}

/**
 * Clean up old data
 */
async function cleanupOldData(supabase: ReturnType<typeof createClient>) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 90); // 90 days ago

  let processed = 0;

  // Delete old audit logs
  const { data: auditLogs } = await supabase
    .from('audit_logs')
    .delete()
    .lt('created_at', cutoffDate.toISOString())
    .select('id');

  processed += auditLogs?.length || 0;

  // Delete old notification logs
  const { data: notifLogs } = await supabase
    .from('push_notification_logs')
    .delete()
    .lt('sent_at', cutoffDate.toISOString())
    .select('id');

  processed += notifLogs?.length || 0;

  return { processed, errors: 0 };
}

/**
 * Process subscription renewals
 */
async function processSubscriptionRenewals(supabase: ReturnType<typeof createClient>) {
  const now = new Date();
  const renewalWindow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

  const { data: subscriptions } = await supabase
    .from('memberships')
    .select('id, user_id, plan_id, expires_at')
    .eq('status', 'ACTIVE')
    .gte('expires_at', now.toISOString())
    .lte('expires_at', renewalWindow.toISOString())
    .eq('auto_renew', true);

  let processed = 0;
  let errors = 0;

  if (subscriptions) {
    for (const sub of subscriptions) {
      try {
        // Send renewal notification
        await supabase.from('notifications').insert({
          user_id: sub.user_id,
          type: 'SUBSCRIPTION_RENEWAL',
          title: 'Subscription Renewal',
          message: 'Your subscription will renew in 3 days',
          data: { membership_id: sub.id },
        });
        processed++;
      } catch (err) {
        console.error(`Error processing subscription ${sub.id}:`, err);
        errors++;
      }
    }
  }

  return { processed, errors };
}

/**
 * Execute a scheduled job
 */
async function executeJob(
  supabase: ReturnType<typeof createClient>,
  job: ScheduledJob
): Promise<{ success: boolean; processed: number; errors: number }> {
  console.log(`Executing job: ${job.name} (${job.type})`);

  let result = { processed: 0, errors: 0 };

  switch (job.type) {
    case 'event_reminder':
      result = await sendEventReminders(supabase);
      break;
    case 'ticket_expiry':
      result = await checkExpiredTickets(supabase);
      break;
    case 'report_generation':
      result = await generateReports(supabase);
      break;
    case 'data_cleanup':
      result = await cleanupOldData(supabase);
      break;
    case 'subscription_renewal':
      result = await processSubscriptionRenewals(supabase);
      break;
    default:
      console.error(`Unknown job type: ${job.type}`);
      return { success: false, processed: 0, errors: 1 };
  }

  // Update job last_run timestamp
  await supabase
    .from('scheduled_jobs')
    .update({
      last_run: new Date().toISOString(),
      last_result: result,
    })
    .eq('id', job.id);

  return { success: result.errors === 0, ...result };
}

serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET',
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

    // Get job to execute
    const url = new URL(req.url);
    const jobId = url.searchParams.get('job_id');
    const jobType = url.searchParams.get('job_type');

    let jobs: ScheduledJob[] = [];

    if (jobId) {
      // Execute specific job
      const { data, error } = await supabase
        .from('scheduled_jobs')
        .select('*')
        .eq('id', jobId)
        .eq('enabled', true)
        .single();

      if (error || !data) {
        return new Response(
          JSON.stringify({ error: 'Job not found or disabled' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      jobs = [data as ScheduledJob];
    } else if (jobType) {
      // Execute all jobs of a specific type
      const { data, error } = await supabase
        .from('scheduled_jobs')
        .select('*')
        .eq('type', jobType)
        .eq('enabled', true);

      if (error || !data) {
        return new Response(
          JSON.stringify({ error: 'No jobs found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      jobs = data as ScheduledJob[];
    } else {
      // Execute all enabled jobs that are due
      const { data, error } = await supabase
        .from('scheduled_jobs')
        .select('*')
        .eq('enabled', true);

      if (error || !data) {
        return new Response(
          JSON.stringify({ error: 'No jobs found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      jobs = data as ScheduledJob[];
    }

    // Execute all jobs
    const results = [];
    for (const job of jobs) {
      const result = await executeJob(supabase, job);
      results.push({
        job_id: job.id,
        job_name: job.name,
        job_type: job.type,
        ...result,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        executed: results.length,
        results,
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
    console.error('Scheduler error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Scheduler execution failed',
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
