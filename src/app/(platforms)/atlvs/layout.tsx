/**
 * ATLVS Platform Layout
 * Project management and advancing platform
 */

import type { Metadata } from 'next';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';

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
  return <AtlvsLayout>{children}</AtlvsLayout>;
}
