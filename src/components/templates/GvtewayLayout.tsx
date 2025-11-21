/**
 * GVTEWAY Platform Layout Template
 * Provides consistent layout for GVTEWAY platform pages
 */

import * as React from 'react';

interface GvtewayLayoutProps {
  children: React.ReactNode;
}

export function GvtewayLayout({ children }: GvtewayLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50">
      {/* TODO: Add GVTEWAY-specific navigation */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
