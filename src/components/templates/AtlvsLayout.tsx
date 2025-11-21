/**
 * ATLVS Platform Layout Template
 * Provides consistent layout for ATLVS platform pages
 */

import * as React from 'react';

interface AtlvsLayoutProps {
  children: React.ReactNode;
}

export function AtlvsLayout({ children }: AtlvsLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-purple-50">
      {/* TODO: Add ATLVS-specific sidebar/navigation */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
