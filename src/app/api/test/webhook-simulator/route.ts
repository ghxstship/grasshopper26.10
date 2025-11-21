import { NextRequest, NextResponse } from 'next/server';
import { generateWebhookSignature } from '@/lib/webhook-utils';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { errors } from "@/lib/api/errors";
import { handleApiError } from '@/lib/api/response';



/**
 * Webhook Simulator for Testing
 * Simulates webhook events without real data
 */

interface SimulateRequest {
  endpoint: string;
  event: string;
  data?: Record<string, any>;
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

    const body: SimulateRequest = await request.json();
    const { endpoint, event, data = {} } = body;

    if (!endpoint || !event) {
      return NextResponse.json(
        { error: 'endpoint and event are required' },
        { status: 400 }
      );
    }

    // Generate mock data based on event type
    const mockData = generateMockData(event, data);

    // Create webhook payload
    const payload = {
      event,
      data: mockData,
      timestamp: new Date().toISOString(),
    };

    const payloadString = JSON.stringify(payload);
    const signature = generateWebhookSignature(payloadString);

    // Send to webhook endpoint
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const webhookUrl = `${baseUrl}${endpoint}`;

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-n8n-signature': signature,
      },
      body: payloadString,
    });

    const responseData = await response.json();

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      payload,
      signature,
      response: responseData,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

function generateMockData(event: string, overrides: Record<string, any>) {
  const mockDataTemplates: Record<string, any> = {
    'event.created': {
      eventId: 'evt_mock_' + Date.now(),
      organizationId: 'org_mock_123',
      name: 'Test Event',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      venue: 'Test Venue',
      ...overrides,
    },
    'ticket.purchased': {
      ticketId: 'tkt_mock_' + Date.now(),
      orderId: 'ord_mock_' + Date.now(),
      userId: 'usr_mock_123',
      eventId: 'evt_mock_123',
      quantity: 2,
      price: 5000,
      ...overrides,
    },
    'order.completed': {
      orderId: 'ord_mock_' + Date.now(),
      userId: 'usr_mock_123',
      items: [{ ticketId: 'tkt_mock_123', quantity: 2 }],
      total: 10000,
      status: 'completed',
      ...overrides,
    },
    'advancing.submitted': {
      requestId: 'adv_mock_' + Date.now(),
      category: 'Site Infrastructure',
      priority: 'HIGH',
      submitterId: 'usr_mock_123',
      description: 'Test advancing request',
      ...overrides,
    },
    'project.created': {
      projectId: 'prj_mock_' + Date.now(),
      projectName: 'Test Project',
      leadId: 'usr_mock_123',
      teamMembers: ['usr_mock_123', 'usr_mock_456'],
      ...overrides,
    },
    'task.assigned': {
      taskId: 'tsk_mock_' + Date.now(),
      assigneeId: 'usr_mock_123',
      assignedBy: 'usr_mock_456',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      ...overrides,
    },
  };

  return mockDataTemplates[event] || { ...overrides };
}
