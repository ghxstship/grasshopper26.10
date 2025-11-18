import { ReactNode } from 'react';
import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';

export interface CompvssLayoutProps {
  children: ReactNode;
}

/**
 * COMPVSS Layout - GHXSTSHIP Standardized
 * 
 * Wraps content with Navigation and Footer using the atomic design system.
 * This ensures consistent styling across all COMPVSS pages.
 */
export function CompvssLayout({ children }: CompvssLayoutProps) {
  return (
    <div className="min-h-screen bg-ghxst-white">
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
