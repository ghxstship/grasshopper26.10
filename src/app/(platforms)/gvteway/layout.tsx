/**
 * GVTEWAY Platform Layout
 * Main consumer-facing platform for events and tickets
 * REQUIRES: Authentication, RBAC (CONSUMER, ORGANIZER, ADMIN, SUPER_ADMIN)
 */

import type { Metadata } from 'next';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { PlatformGuard } from '@/components/auth/PlatformGuard';

export const metadata: Metadata = {
  title: {
    template: '%s | GVTEWAY',
    default: 'GVTEWAY - Events & Experiences',
  },
  description: 'Discover and book unforgettable events and experiences',
};

export default function GVTEWAYLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlatformGuard platform="GVTEWAY">
      <GvtewayLayout>{children}</GvtewayLayout>
    </PlatformGuard>
  );
}
