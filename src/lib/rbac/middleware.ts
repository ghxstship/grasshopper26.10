/**
 * RBAC Middleware
 * Authorization middleware for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { Permission, hasPermission, hasAnyPermission, hasAllPermissions } from './permissions';
import { Role, hasRole, hasAnyRole } from './roles';
import { getUserPermissions, getUserRoles } from './utils';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    roles: Role[];
    permissions: Permission[];
  };
}

/**
 * Require authentication
 */
export function requireAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id as string;
    const roles = await getUserRoles(userId);
    const permissions = await getUserPermissions(userId);

    const authenticatedReq = req as AuthenticatedRequest;
    authenticatedReq.user = {
      id: userId,
      email: session.user.email!,
      roles,
      permissions,
    };

    return handler(authenticatedReq);
  };
}

/**
 * Require specific permission
 */
export function requirePermission(
  permission: Permission,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return requireAuth(async (req: AuthenticatedRequest) => {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(req.user.permissions, permission)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    return handler(req);
  });
}

/**
 * Require any of the specified permissions
 */
export function requireAnyPermission(
  permissions: Permission[],
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return requireAuth(async (req: AuthenticatedRequest) => {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasAnyPermission(req.user.permissions, permissions)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    return handler(req);
  });
}

/**
 * Require all of the specified permissions
 */
export function requireAllPermissions(
  permissions: Permission[],
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return requireAuth(async (req: AuthenticatedRequest) => {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasAllPermissions(req.user.permissions, permissions)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    return handler(req);
  });
}

/**
 * Require specific role
 */
export function requireRole(
  role: Role,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return requireAuth(async (req: AuthenticatedRequest) => {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasRole(req.user.roles, role)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient role' },
        { status: 403 }
      );
    }

    return handler(req);
  });
}

/**
 * Require any of the specified roles
 */
export function requireAnyRole(
  roles: Role[],
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return requireAuth(async (req: AuthenticatedRequest) => {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasAnyRole(req.user.roles, roles)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient role' },
        { status: 403 }
      );
    }

    return handler(req);
  });
}

/**
 * Check if user owns the resource
 */
export function requireOwnership(
  getResourceOwnerId: (req: AuthenticatedRequest) => Promise<string>,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return requireAuth(async (req: AuthenticatedRequest) => {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ownerId = await getResourceOwnerId(req);

    if (req.user.id !== ownerId) {
      // Check if user has admin permissions
      const isAdmin = hasAnyRole(req.user.roles, [
        Role.ATLVS_SUPER_ADMIN,
        Role.ATLVS_ADMIN,
      ]);

      if (!isAdmin) {
        return NextResponse.json(
          { error: 'Forbidden: You do not own this resource' },
          { status: 403 }
        );
      }
    }

    return handler(req);
  });
}

/**
 * Combine multiple authorization checks (OR logic)
 */
export function requireAny(
  checks: Array<(req: AuthenticatedRequest) => Promise<boolean>>,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return requireAuth(async (req: AuthenticatedRequest) => {
    if (!req.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = await Promise.all(checks.map((check) => check(req)));
    const hasAccess = results.some((result) => result);

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    return handler(req);
  });
}
