/**
 * Session Management Hook
 * Handles session state, expiry, and auto-refresh
 */

import { useSession as useNextAuthSession } from 'next-auth/react';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useSession() {
  const { data: session, status, update } = useNextAuthSession();
  const router = useRouter();

  // Auto-refresh session before expiry
  useEffect(() => {
    if (!session?.expires) return;

    const expiryTime = new Date(session.expires).getTime();
    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;

    // Refresh 5 minutes before expiry
    const refreshTime = timeUntilExpiry - 5 * 60 * 1000;

    if (refreshTime > 0) {
      const timer = setTimeout(() => {
        update();
      }, refreshTime);

      return () => clearTimeout(timer);
    }
  }, [session, update]);

  const refreshSession = useCallback(async () => {
    try {
      await update();
    } catch (error) {
      console.error('Failed to refresh session:', error);
      router.push('/auth/login');
    }
  }, [update, router]);

  const isExpired = useCallback(() => {
    if (!session?.expires) return false;
    return new Date(session.expires).getTime() < Date.now();
  }, [session]);

  return {
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isExpired: isExpired(),
    refreshSession,
  };
}
