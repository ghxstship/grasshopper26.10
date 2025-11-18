'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ATLVSPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to projects as the authenticated root page
    router.push('/atlvs/projects');
  }, [router]);
  
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-atlvs-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting to projects...</p>
      </div>
    </div>
  );
}

// Landing page content removed - create /atlvs/landing page if needed for marketing
