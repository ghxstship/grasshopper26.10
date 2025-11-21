/**
 * Platform Guard Component
 * Ensures user has access to specific platform
 * Supports both platform roles and event roles
 */

'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { hasEventRolePlatformAccess } from '@/lib/rbac/event-roles';

interface PlatformGuardProps {
  children: React.ReactNode;
  platform: 'ATLVS' | 'COMPVSS' | 'GVTEWAY';
}

const PLATFORM_ROLES = {
  ATLVS: [
    'INTERNAL_TEAM',
    'ADMIN',
    'SUPER_ADMIN',
    'LEGEND_SUPER_ADMIN',
    'LEGEND_ADMIN',
    'LEGEND_DEVELOPER',
    'LEGEND_COLLABORATOR',
    'LEGEND_SUPPORT',
    'EXECUTIVE',
    'CORE_AAA',
    'AA',
    'PRODUCTION',
    'MANAGEMENT',
  ],
  COMPVSS: [
    'EXTERNAL_TEAM',
    'ADMIN',
    'SUPER_ADMIN',
    'LEGEND_SUPER_ADMIN',
    'LEGEND_ADMIN',
    'LEGEND_DEVELOPER',
    'LEGEND_COLLABORATOR',
    'LEGEND_SUPPORT',
    'EXECUTIVE',
    'CORE_AAA',
    'AA',
    'PRODUCTION',
    'MANAGEMENT',
    'CREW',
    'STAFF',
    'VENDOR',
    'ENTERTAINER',
    'ARTIST',
    'AGENT',
    'MEDIA',
    'SPONSOR',
    'PARTNER',
    'INDUSTRY',
    'INTERN',
    'VOLUNTEER',
  ],
  GVTEWAY: [
    'CONSUMER',
    'ADMIN',
    'SUPER_ADMIN',
    'ORGANIZER',
    'LEGEND_SUPER_ADMIN',
    'LEGEND_ADMIN',
    'LEGEND_DEVELOPER',
    'LEGEND_COLLABORATOR',
    'LEGEND_SUPPORT',
    'EXECUTIVE',
    'CORE_AAA',
    'AA',
    'PRODUCTION',
    'MANAGEMENT',
    'GUEST',
    'BACKSTAGE_L1',
    'BACKSTAGE_L2',
    'PLATINUM_VIP_L1',
    'PLATINUM_VIP_L2',
    'VIP_L1',
    'VIP_L2',
    'VIP_L3',
    'GA_L1',
    'GA_L2',
    'GA_L3',
    'GA_L4',
    'GA_L5',
    'INFLUENCER',
    'BRAND_AMBASSADOR',
    'AFFILIATE',
    'ENTERTAINER',
    'ARTIST',
    'MEDIA',
    'SPONSOR',
    'PARTNER',
  ],
};

export function PlatformGuard({ children, platform }: PlatformGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  React.useEffect(() => {
    if (status === 'loading') return;

    // Not authenticated
    if (!session?.user) {
      const currentPath = window.location.pathname;
      router.push(`/${platform.toLowerCase()}/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Check platform access using both static role list and event role system
    const userRole = session.user.role as string;
    const hasAccess = PLATFORM_ROLES[platform].includes(userRole) || 
                     hasEventRolePlatformAccess(userRole, platform);

    if (!hasAccess) {
      router.push('/unauthorized');
      return;
    }

    setIsAuthorized(true);
  }, [session, status, router, platform]);

  // Show loading state
  if (status === 'loading' || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return <>{children}</>;
}
