import { ReactNode } from 'react';
import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';

export interface GvtewayLayoutProps {
  children: ReactNode;
}

/**
 * GVTEWAY Layout - GHXSTSHIP Standardized
 * 
 * Wraps content with Navigation and Footer using the atomic design system.
 * This ensures consistent styling across all GVTEWAY pages.
 */
export function GvtewayLayout({ children }: GvtewayLayoutProps) {
  return (
    <div className="min-h-screen bg-ghxst-white">
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
