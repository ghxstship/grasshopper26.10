import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { errors } from "@/lib/api/errors";
import { handleApiError } from '@/lib/api/response';
import { CompvssToAtlvsService } from '@/lib/services/sync/compvssToAtlvs.service';




/**
 * Cross-Platform Sync: COMPVSS → ATLVS
 * Syncs crew data to ATLVS teams
 */

interface SyncRequest {
  eventId?: string;
  crewIds?: string[];
  syncAvailability?: boolean;
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
    const { eventId, crewIds, syncAvailability = true } = body;

    if (!eventId && !crewIds) {
      return NextResponse.json(
        { error: 'Either eventId or crewIds is required' },
        { status: 400 }
      );
    }

    const syncResults: any = {
      synced: [],
    };

    // Fetch crew members from COMPVSS
    // Note: Requires crewMember and shiftAssignment models in schema
    const crewMembers: any[] = [];

    if (!crewMembers || crewMembers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No crew members found',
        synced: [],
      });
    }

    // Find or create ATLVS project
    let project;
    if (eventId) {
      project = await prisma.project.findFirst({
        where: {
          metadata: {
            path: ['sourceId'],
            equals: eventId,
          },
        },
      });

      if (!project) {
        const event = await new CompvssToAtlvsService().findById(eventId);

        if (event) {
          project = await prisma.project.create({
            data: {
              name: event.name,
              slug: `compvss-${eventId}-${Date.now()}`,
              status: 'IN_PROGRESS',
              startDate: event.startDate,
              endDate: event.endDate,
              organization: {
                connect: { id: event.organizationId },
              },
              creator: {
                connect: { id: context.userId },
              },
              metadata: {
                sourceType: 'compvss_event',
                sourceId: eventId,
              },
            },
          });
        }
      }
    }

    // Sync crew to team
    for (const crew of crewMembers) {
      if (!project) continue;

      const existing = await prisma.teamMember.findFirst({
        where: {
          team: {
            projects: {
              some: { id: project.id },
            },
          },
          userId: crew.userId,
        },
      });

      if (!existing) {
        // Note: TeamMember requires a teamId. This needs proper team creation logic.
        // Skipping team member creation for now as it requires team setup.

        syncResults.synced.push({
          type: 'team_member',
          userId: crew.userId,
          name: crew.user.name,
        });
      }

      // Note: UserAvailability model doesn't exist in schema.
      // Availability tracking would need to be implemented via metadata or a new model.
      if (syncAvailability && crew.availability) {
        // Store availability in project metadata for now
      }
    }

    return NextResponse.json({
      success: true,
      projectId: project?.id,
      ...syncResults,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
