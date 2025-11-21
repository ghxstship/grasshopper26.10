/**
 * Verify Email Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Hero, H2, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');

  React.useEffect(() => {
    const verifyEmail = async () => {
      try {
        await apiClient.post('/api/auth/verify-email', { token });
        setStatus('success');
      } catch {
        setStatus('error');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Hero className="mb-8 text-center">EMAIL VERIFICATION</Hero>
        <Card>
          <CardContent className="p-12 text-center">
            {status === 'loading' && (
              <>
                <Spinner size="xl" className="mb-6" />
                <Body>Verifying your email...</Body>
              </>
            )}
            {status === 'success' && (
              <>
                <div className="text-6xl mb-6">✓</div>
                <H2 className="mb-4">Email Verified!</H2>
                <Body className="mb-8 text-gray-600">Your email has been successfully verified.</Body>
                <Link href="/(rebuild)/auth/login">
                  <Button fullWidth>Continue to Login</Button>
                </Link>
              </>
            )}
            {status === 'error' && (
              <>
                <div className="text-6xl mb-6">✗</div>
                <H2 className="mb-4">Verification Failed</H2>
                <Body className="mb-8 text-gray-600">Invalid or expired verification link.</Body>
                <Link href="/(rebuild)/auth/register">
                  <Button fullWidth>Back to Register</Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
