import { ReactNode } from 'react';
import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';

export interface AtlvsLayoutProps {
  children: ReactNode;
}

/**
 * ATLVS Layout - GHXSTSHIP Standardized
 * 
 * Wraps content with Navigation and Footer using the atomic design system.
 * This ensures consistent styling across all ATLVS pages.
 */
export function AtlvsLayout({ children }: AtlvsLayoutProps) {
  return (
    <div className="min-h-screen bg-ghxst-white">
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
