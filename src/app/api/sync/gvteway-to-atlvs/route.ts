import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { errors } from "@/lib/api/errors";
import { handleApiError } from '@/lib/api/response';
import { GvtewayToAtlvsService } from '@/lib/services/sync/gvtewayToAtlvs.service';




/**
 * Cross-Platform Sync: GVTEWAY → ATLVS
 * Syncs event data to create ATLVS projects
 */

interface SyncRequest {
  eventId: string;
  createProject?: boolean;
  syncBudget?: boolean;
  syncTeam?: boolean;
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

    const body: SyncRequest = await request.json();
    const { eventId, createProject = true, syncBudget = true, syncTeam = true } = body;

    if (!eventId) {
      return NextResponse.json({ error: 'eventId is required' }, { status: 400 });
    }

    // Get event data from GVTEWAY
    const event = await new GvtewayToAtlvsService().findById(eventId);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const syncResults: any = {
      eventId,
      synced: [],
    };

    // Create ATLVS project
    if (createProject) {
      const project = await prisma.project.create({
        data: {
          name: event.name,
          slug: `gvteway-${eventId}-${Date.now()}`,
          description: event.description || '',
          status: 'PLANNING',
          startDate: event.startDate,
          endDate: event.endDate,
          organization: {
            connect: { id: event.organizationId },
          },
          creator: {
            connect: { id: context.userId },
          },
          metadata: {
            sourceType: 'gvteway_event',
            sourceId: eventId,
            venue: event.venue?.name,
          },
        },
      });

      syncResults.synced.push({ type: 'project', id: project.id });
      syncResults.projectId = project.id;

      // Sync budget
      if (syncBudget) {
        // Note: Ticket doesn't have price/quantity, those are on TicketType
        const totalRevenue = 0; // Calculate from ticket types when available

        const budget = await prisma.budget.create({
          data: {
            projectId: project.id,
            name: 'Event Production Budget',
            amount: totalRevenue * 0.7, // 70% of revenue as budget
            totalAmount: totalRevenue * 0.7,
            spent: 0,
            startDate: new Date(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          },
        });

        syncResults.synced.push({ type: 'budget', id: budget.id });
      }

      // Sync team
      if (syncTeam) {
        // Note: Team member sync requires proper team setup.
        // Event organizers would need to be fetched from a proper model.
        // Skipping team sync for now.
        syncResults.synced.push({ type: 'team', count: 0 });
      }
    }

    return NextResponse.json({
      success: true,
      ...syncResults,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
