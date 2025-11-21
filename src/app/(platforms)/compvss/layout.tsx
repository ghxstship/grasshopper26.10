/**
 * COMPVSS Platform Layout
 * Compensation and vendor settlement system
 * REQUIRES: Authentication, RBAC (EXTERNAL_TEAM, ADMIN, SUPER_ADMIN)
 */

import type { Metadata } from 'next';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { PlatformGuard } from '@/components/auth/PlatformGuard';

export const metadata: Metadata = {
  title: {
    template: '%s | COMPVSS',
    default: 'COMPVSS - Compensation Management',
  },
  description: 'Comprehensive compensation and vendor settlement system',
};

export default function COMPVSSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlatformGuard platform="COMPVSS">
      <CompvssLayout>{children}</CompvssLayout>
    </PlatformGuard>
  );
}
