/**
 * ATLVS Platform Layout
 * Project management and advancing platform
 * REQUIRES: Authentication, RBAC (INTERNAL_TEAM, ADMIN, SUPER_ADMIN)
 */

import type { Metadata } from 'next';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { PlatformGuard } from '@/components/auth/PlatformGuard';

export const metadata: Metadata = {
  title: {
    template: '%s | ATLVS',
    default: 'ATLVS - Project Management',
  },
  description: 'Advanced project management and advancing platform for events',
};

export default function ATLVSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlatformGuard platform="ATLVS">
      <AtlvsLayout>{children}</AtlvsLayout>
    </PlatformGuard>
  );
}
