/**
 * COMPVSS Platform Layout
 * Compensation and vendor settlement system
 */

import type { Metadata } from 'next';
import { CompvssLayout } from '@/components/templates/CompvssLayout';

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
  return <CompvssLayout>{children}</CompvssLayout>;
}
