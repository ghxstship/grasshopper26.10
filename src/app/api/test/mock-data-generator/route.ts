import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { errors } from "@/lib/api/errors";
import { z } from 'zod';
import { handleApiError } from '@/lib/api/response';
import { TestService } from '@/lib/services/test/mockDataGenerator.service';




/**
 * Mock Data Generator for Testing Workflows
 * Generates realistic test data for N8N workflows
 */

interface GenerateRequest {
  type: 'event' | 'user' | 'order' | 'project' | 'task';
  count?: number;
  options?: Record<string, any>;
}

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

    const body: GenerateRequest = await request.json();
    const { type, count = 1, options = {} } = body;

    if (!type) {
      return NextResponse.json({ error: 'type is required' }, { status: 400 });
    }

    const generated = [];

    for (let i = 0; i < count; i++) {
      let item;

      switch (type) {
        case 'event':
          item = await generateMockEvent(options);
          break;
        case 'user':
          item = await generateMockUser(options);
          break;
        case 'order':
          item = await generateMockOrder(options);
          break;
        case 'project':
          item = await generateMockProject(options);
          break;
        case 'task':
          item = await generateMockTask(options);
          break;
        default:
          throw new Error(`Unknown type: ${type}`);
      }

      generated.push(item);
    }

    return NextResponse.json({
      success: true,
      type,
      count: generated.length,
      data: generated,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

async function generateMockEvent(options: any) {
  const event = await new TestService().create({
    data: {
      name: options.name || `Test Event ${Date.now()}`,
      description: options.description || 'Mock event for testing',
      date: options.date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: options.status || 'DRAFT',
      organizationId: options.organizationId || 'test_org',
      metadata: { mock: true, ...options.metadata },
    },
  });

  return event;
}

async function generateMockUser(options: any) {
  const user = await new TestService().create({
    data: {
      email: options.email || `test${Date.now()}@example.com`,
      name: options.name || `Test User ${Date.now()}`,
      role: options.role || 'USER',
      metadata: { mock: true, ...options.metadata },
    },
  });

  return user;
}

async function generateMockOrder(options: any) {
  const order = await new TestService().create({
    data: {
      userId: options.userId || 'test_user',
      eventId: options.eventId || 'test_event',
      status: options.status || 'PENDING',
      total: options.total || 10000,
      metadata: { mock: true, ...options.metadata },
    },
  });

  return order;
}

async function generateMockProject(options: any) {
  const project = await new TestService().create({
    data: {
      name: options.name || `Test Project ${Date.now()}`,
      description: options.description || 'Mock project for testing',
      status: options.status || 'PLANNING',
      startDate: options.startDate || new Date(),
      organizationId: options.organizationId || 'test_org',
      metadata: { mock: true, ...options.metadata },
    },
  });

  return project;
}

async function generateMockTask(options: any) {
  const task = await new TestService().create({
    data: {
      title: options.title || `Test Task ${Date.now()}`,
      description: options.description || 'Mock task for testing',
      status: options.status || 'TODO',
      priority: options.priority || 'MEDIUM',
      projectId: options.projectId || 'test_project',
      metadata: { mock: true, ...options.metadata },
    },
  });

  return task;
}
