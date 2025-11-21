import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { errors } from "@/lib/api/errors";
import { handleApiError } from '@/lib/api/response';



/**
 * Discord Integration Middleware
 * Sends notifications to Discord channels
 */

interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  footer?: { text: string };
  timestamp?: string;
}

interface DiscordMessage {
  content?: string;
  embeds?: DiscordEmbed[];
  username?: string;
  avatar_url?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Database: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
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

    const body: DiscordMessage = await request.json();
    const { content, embeds, username = 'GVTEWAY', avatar_url } = body;

    if (!content && (!embeds || embeds.length === 0)) {
      return NextResponse.json(
        { error: 'Content or embeds are required' },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Discord webhook URL not configured' },
        { status: 500 }
      );
    }

    const payload = {
      username,
      avatar_url,
      content,
      embeds,
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.statusText}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent to Discord',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
