/**
 * Legend Role Middleware
 * Special middleware for Legend roles with god-mode capabilities
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { Role, hasLegendRole, isValidLegendEmail, LEGEND_ROLES } from './roles';
import { getUserRoles } from './utils';
import { AuthenticatedRequest } from './middleware';

/**
 * Require Legend role
 */
export function requireLegendRole(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id as string;
    const email = session.user.email!;

    // Validate email domain
    if (!isValidLegendEmail(email)) {
      return NextResponse.json(
        { error: 'Forbidden: Legend roles require @ghxstship.pro email domain' },
        { status: 403 }
      );
    }

    // Get user roles
    const roles = await getUserRoles(userId);

    // Check if user has any Legend role
    if (!hasLegendRole(roles)) {
      return NextResponse.json(
        { error: 'Forbidden: Legend role required' },
        { status: 403 }
      );
    }

    const authenticatedReq = req as AuthenticatedRequest;
    authenticatedReq.user = {
      id: userId,
      email,
      roles,
      permissions: [], // Legend roles bypass permission checks
    };

    return handler(authenticatedReq);
  };
}

/**
 * Require specific Legend role
 */
export function requireSpecificLegendRole(
  role: Role,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id as string;
    const email = session.user.email!;

    // Validate email domain
    if (!isValidLegendEmail(email)) {
      return NextResponse.json(
        { error: 'Forbidden: Legend roles require @ghxstship.pro email domain' },
        { status: 403 }
      );
    }

    // Get user roles
    const roles = await getUserRoles(userId);

    // Check if user has the specific Legend role
    if (!roles.includes(role)) {
      return NextResponse.json(
        { error: `Forbidden: ${role} role required` },
        { status: 403 }
      );
    }

    const authenticatedReq = req as AuthenticatedRequest;
    authenticatedReq.user = {
      id: userId,
      email,
      roles,
      permissions: [], // Legend roles bypass permission checks
    };

    return handler(authenticatedReq);
  };
}

/**
 * Check if request is from Legend role
 */
export async function isLegendRequest(_req: NextRequest): Promise<boolean> {
  const session = await auth();

  if (!session?.user) {
    return false;
  }

  const userId = session.user.id as string;
  const email = session.user.email!;

  // Check email domain
  if (!isValidLegendEmail(email)) {
    return false;
  }

  // Get user roles
  const roles = await getUserRoles(userId);

  return hasLegendRole(roles);
}

/**
 * Bypass permission checks for Legend roles
 */
export function bypassPermissionsForLegend(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: AuthenticatedRequest) => {
    // Check if user has Legend role
    if (req.user && hasLegendRole(req.user.roles)) {
      // Legend roles bypass all permission checks
      return handler(req);
    }

    // For non-Legend roles, continue with normal permission checks
    return handler(req);
  };
}

/**
 * Validate Legend email domain
 */
export function validateLegendEmail(email: string): boolean {
  return isValidLegendEmail(email);
}

/**
 * Get Legend role from user roles
 */
export function getLegendRole(roles: Role[]): Role | null {
  return roles.find((role) => LEGEND_ROLES.includes(role as any)) || null;
}
