/**
 * Authenticated Routes Layout
 * Wraps all routes requiring authentication
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check for authentication token
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    
    if (!token) {
      // No token found, redirect to login
      router.push('/auth/login');
    }
  }, [router]);

  return <>{children}</>;
}
