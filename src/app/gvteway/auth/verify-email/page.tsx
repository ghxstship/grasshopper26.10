'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { PageTitle, BodyText } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      queueMicrotask(() => {
        setStatus('error');
        setMessage('Invalid verification link');
      });
      return;
    }

    let isActive = true;
    let redirectTimer: NodeJS.Timeout | null = null;

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!isActive) return;

        if (response.ok) {
          setStatus('success');
          setMessage('Email verified successfully!');
          redirectTimer = setTimeout(() => {
            router.push('/gvteway/auth/login?verified=true');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      } catch {
        if (!isActive) return;
        setStatus('error');
        setMessage('An unexpected error occurred');
      }
    };

    void verifyEmail();

    return () => {
      isActive = false;
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [token, router]);

  return (
    <GvtewayLayout>
      <section className="section-padding">
        <div className="max-w-md mx-auto px-8 text-center">
          <PageTitle className="mb-8 uppercase text-ghxst-primary">Email Verification</PageTitle>

          {status === 'loading' && (
            <div className="space-y-6">
              <Loader2 className="w-16 h-16 mx-auto text-ghxst-primary animate-spin" />
              <BodyText className="text-ghxst-text-secondary">
                Verifying your email...
              </BodyText>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6">
              <CheckCircle className="w-16 h-16 mx-auto text-success" />
              <div>
                <BodyText className="text-success-foreground mb-2">
                  {message}
                </BodyText>
                <BodyText className="text-ghxst-text-secondary text-body-sm">
                  Redirecting to login...
                </BodyText>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-6">
              <XCircle className="w-16 h-16 mx-auto text-destructive" />
              <div>
                <BodyText className="text-destructive-foreground mb-2">
                  {message}
                </BodyText>
                <BodyText className="text-ghxst-text-secondary text-body-sm">
                  The verification link may have expired or is invalid.
                </BodyText>
              </div>
              <Link href="/gvteway/auth/login">
                <Button variant="primary" size="lg">
                  Go to Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </GvtewayLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
