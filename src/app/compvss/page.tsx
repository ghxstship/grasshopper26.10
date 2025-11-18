'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function COMPVSSPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to dashboard as the authenticated root page
    router.push('/compvss/dashboard');
  }, [router]);
  
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-compvss-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}

// Landing page content removed - create /compvss/landing page if needed for marketing
