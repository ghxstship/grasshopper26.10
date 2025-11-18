'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error('Verification failed');
        }

        setStatus('success');
      } catch {
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <GvtewayLayout showNav={false}>
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_50%)]" />
      
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <Link href="/gvteway">
              <h1 className="text-5xl font-anton gvteway-text-gradient mb-2 cursor-pointer">
                GVTEWAY
              </h1>
            </Link>
          </div>

          <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl text-center">Email Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                {status === 'loading' && (
                  <>
                    <Loader2 className="w-16 h-16 text-gvteway-red-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">Verifying your email...</p>
                    <p className="text-sm text-gray-500">Please wait a moment</p>
                  </>
                )}

                {status === 'success' && (
                  <>
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-success" />
                    </div>
                    <p className="text-gray-300 mb-2 text-lg font-semibold">Email Verified!</p>
                    <p className="text-sm text-gray-500 mb-6">Your account has been successfully verified</p>
                    <Link href="/gvteway/auth/login">
                      <Button variant="gvteway" size="lg" className="w-full" rounded="full">
                        Continue to Sign In
                      </Button>
                    </Link>
                  </>
                )}

                {status === 'error' && (
                  <>
                    <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <XCircle className="w-10 h-10 text-error" />
                    </div>
                    <p className="text-gray-300 mb-2 text-lg font-semibold">Verification Failed</p>
                    <p className="text-sm text-gray-500 mb-6">The verification link is invalid or has expired</p>
                    <Button variant="gvteway-outline" size="lg" className="w-full" rounded="full">
                      Resend Verification Email
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
    </GvtewayLayout>
  );
}
