/**
 * Session management utilities
 */

import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'development-secret-change-in-production'
);

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  platform?: 'GVTEWAY' | 'COMPVSS' | 'ATLVS';
}

export interface SessionData {
  user: SessionUser;
  expires: string;
}

/**
 * Create a JWT session token
 */
export async function createSession(user: SessionUser, expiresIn: string = '7d'): Promise<string> {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify and decode a JWT session token
 */
export async function verifySession(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    return {
      user: payload.user as SessionUser,
      expires: new Date((payload.exp || 0) * 1000).toISOString(),
    };
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}

/**
 * Get current session from cookies
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return null;
  }

  return verifySession(token);
}

/**
 * Set session cookie
 */
export async function setSessionCookie(token: string, maxAge: number = 7 * 24 * 60 * 60) {
  const cookieStore = await cookies();
  
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  });
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  return session.user;
}

/**
 * Require specific role - throws if not authorized
 */
export async function requireRole(allowedRoles: string[]): Promise<SessionUser> {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden');
  }

  return user;
}

/**
 * Check if user has permission
 */
export async function checkUserPermission(permission: string): Promise<boolean> {
  try {
    const user = await requireAuth();
    
    // Import PermissionService to check permissions
    const { PermissionService } = await import('../services/shared/PermissionService');
    const permissionService = new PermissionService();
    
    // Parse permission string (format: "resource:action")
    const [resource, action] = permission.split(':');
    
    if (!resource || !action) {
      console.error('Invalid permission format. Expected "resource:action"');
      return false;
    }
    
    const result = await permissionService.hasResourcePermission(user.id, resource, action);
    return result.success ? result.data || false : false;
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
}
