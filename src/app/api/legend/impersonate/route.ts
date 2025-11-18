/**
 * Legend Impersonation API
 * Handles user impersonation for Legend roles
 */

import { NextResponse } from 'next/server';
import { requireLegendRole } from '@/lib/rbac/legend-middleware';
import { ImpersonationService } from '@/lib/services/shared/impersonation.service';

/**
 * POST /api/legend/impersonate
 * Start impersonating a user
 */
export const POST = requireLegendRole(async (req) => {
  try {
    const body = await req.json();
    const { targetUserId, reason, duration } = body;

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Target user ID is required' },
        { status: 400 }
      );
    }

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;

    const session = await ImpersonationService.startImpersonation(
      req.user!.id,
      { targetUserId, reason, duration },
      ipAddress
    );

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Impersonation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start impersonation' },
      { status: 500 }
    );
  }
});

/**
 * GET /api/legend/impersonate
 * Get active impersonation session
 */
export const GET = requireLegendRole(async (req) => {
  try {
    const session = await ImpersonationService.getActiveSession(req.user!.id);

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json(
      { error: 'Failed to get impersonation session' },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/legend/impersonate
 * End active impersonation session
 */
export const DELETE = requireLegendRole(async (req) => {
  try {
    const session = await ImpersonationService.getActiveSession(req.user!.id);

    if (!session) {
      return NextResponse.json(
        { error: 'No active impersonation session' },
        { status: 404 }
      );
    }

    await ImpersonationService.endImpersonation(session.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('End impersonation error:', error);
    return NextResponse.json(
      { error: 'Failed to end impersonation' },
      { status: 500 }
    );
  }
});
