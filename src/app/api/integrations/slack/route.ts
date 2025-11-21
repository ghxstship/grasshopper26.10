import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { errors } from "@/lib/api/errors";
import { handleApiError } from '@/lib/api/response';
import { z } from 'zod';

/**
 * Slack Integration Middleware
 * Sends notifications to Slack channels
 */

const slackMessageSchema = z.object({
  channel: z.string().min(1),
  text: z.string().min(1),
  blocks: z.array(z.any()).optional(),
  username: z.string().optional(),
  icon_emoji: z.string().optional(),
});

/**
 * GET /api/integrations/slack
 * Check Slack integration status
 */
export async function GET(request: NextRequest) {
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

    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    const configured = !!webhookUrl;

    return NextResponse.json({
      configured,
      status: configured ? 'active' : 'not_configured',
      message: configured 
        ? 'Slack integration is configured and ready' 
        : 'Slack webhook URL not configured',
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/integrations/slack
 * Send a message to Slack
 */
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

    const body = await request.json();
    const validated = slackMessageSchema.parse(body);
    const { channel, text, blocks, username = 'GVTEWAY Bot', icon_emoji = ':rocket:' } = validated;

    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Slack webhook URL not configured' },
        { status: 500 }
      );
    }

    const payload = {
      channel,
      username,
      icon_emoji,
      text,
      blocks,
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.statusText}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent to Slack',
      channel,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
