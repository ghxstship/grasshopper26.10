/**
 * COMPVSS Platform Layout Template
 * Provides consistent layout for COMPVSS platform pages
 */

import * as React from 'react';

interface CompvssLayoutProps {
  children: React.ReactNode;
}

export function CompvssLayout({ children }: CompvssLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-indigo-50">
      {/* TODO: Add COMPVSS-specific sidebar/navigation */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
