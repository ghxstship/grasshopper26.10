/**
 * GVTEWAY Platform Layout
 * Main consumer-facing platform for events and tickets
 */

import type { Metadata } from 'next';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';

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
  return <GvtewayLayout>{children}</GvtewayLayout>;
}
