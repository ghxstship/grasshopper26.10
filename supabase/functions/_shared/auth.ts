/**
 * Authentication Utilities for Edge Functions
 * JWT validation and session management
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  emailVerified: boolean;
}

/**
 * Verify JWT token and extract user information
 */
export async function verifyAuth(req: Request): Promise<AuthUser | null> {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || '',
      role: user.user_metadata?.role || 'USER',
      emailVerified: user.email_confirmed_at !== null,
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

/**
 * Require authentication middleware
 */
export async function requireAuth(req: Request): Promise<AuthUser> {
  const user = await verifyAuth(req);
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

/**
 * Check if user has required role
 */
export function hasRole(user: AuthUser, allowedRoles: string[]): boolean {
  return allowedRoles.includes(user.role) || user.role === 'ADMIN';
}

/**
 * Require specific role
 */
export function requireRole(user: AuthUser, allowedRoles: string[]): void {
  if (!hasRole(user, allowedRoles)) {
    throw new Error('Forbidden: Insufficient permissions');
  }
}
