/**
 * Auth Guard Component
 * Client-side authentication protection for pages
 */

'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallbackUrl?: string;
  loadingComponent?: React.ReactNode;
}

export function AuthGuard({
  children,
  requiredRoles,
  fallbackUrl = '/auth/login',
  loadingComponent,
}: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  React.useEffect(() => {
    if (status === 'loading') return;

    // Not authenticated
    if (!session?.user) {
      const currentPath = window.location.pathname;
      router.push(`${fallbackUrl}?callbackUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Check role-based access
    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = session.user.role as string;
      if (!requiredRoles.includes(userRole)) {
        router.push('/unauthorized');
        return;
      }
    }

    setIsAuthorized(true);
  }, [session, status, router, requiredRoles, fallbackUrl]);

  // Show loading state
  if (status === 'loading' || !isAuthorized) {
    return (
      loadingComponent || (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="xl" />
        </div>
      )
    );
  }

  return <>{children}</>;
}
