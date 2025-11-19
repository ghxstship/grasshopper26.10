/* eslint-disable */
'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useAuth } from '@/lib/hooks/auth/useAuth';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { BodyText, HeroTitle } from "@/components/atoms/Typography";

export default function AtlvsVerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const verifyEmail = useCallback(async (verificationToken: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Your email has been successfully verified!');
      } else {
        setStatus('error');
        setMessage(data.error || 'Verification failed. The link may be invalid or expired.');
      }
    } catch {
      setStatus('error');
      setMessage('An error occurred during verification. Please try again.');
    }
  }, []);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else if (email) {
      setStatus('loading');
      setMessage('Please check your email for the verification link.');
    } else {
      setStatus('error');
      setMessage('No verification token or email provided.');
    }
  }, [token, email, verifyEmail]);

  const resendVerification = async () => {
    if (!email) return;
    
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Verification email sent! Please check your inbox.');
      }
    } catch {
      setMessage('Failed to resend verification email.');
    }
  };

  return (
    <AtlvsLayout>
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,165,0,0.1),transparent_50%)]" />
      
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <Link href="/atlvs">
              <HeroTitle className="atlvs-text-gradient mb-2 cursor-pointerr">
                ATLVS
              </HeroTitle>
            </Link>
          </div>

          <Card variant="atlvs" className="bg-grey-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-center">Email Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                {status === 'loading' && !email && (
                  <>
                    <Loader2 className="w-16 h-16 text-atlvs-orange-500 animate-spin mx-auto mb-4" />
                    <BodyText className="text-grey-300 mb-2">Verifying your email...</BodyText>
                    <BodyText className="text-body-sm text-grey-500">Please wait a moment</BodyText>
                  </>
                )}

                {status === 'loading' && email && (
                  <>
                    <Mail className="w-16 h-16 text-atlvs-orange-500 mx-auto mb-4" />
                    <BodyText className="text-grey-300 mb-2">Check Your Email</BodyText>
                    <p className="text-body-sm text-grey-500 mb-6">
                      We sent a verification link to <strong>{email}</strong>
                    </p>
                    <Button 
                      variant="atlvs-outline" 
                      size="lg" 
                      className="w-full"
                      onClick={resendVerification}
                    >
                      Resend Verification Email
                    </Button>
                  </>
                )}

                {status === 'success' && (
                  <>
                    <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-success" />
                    </div>
                    <BodyText className="text-grey-300 mb-2">Email Verified!</BodyText>
                    <p className="text-body-sm text-grey-500 mb-6">{message}</p>
                    <Link href="/atlvs/auth/login">
                      <Button variant="atlvs" size="lg" className="w-full">
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
                    <BodyText className="text-grey-300 mb-2">Verification Failed</BodyText>
                    <p className="text-body-sm text-grey-500 mb-6">{message}</p>
                    {email && (
                      <Button 
                        variant="atlvs-outline" 
                        size="lg" 
                        className="w-full mb-3"
                        onClick={resendVerification}
                      >
                        Resend Verification Email
                      </Button>
                    )}
                    <Link href="/atlvs/auth/login">
                      <Button variant="atlvs" size="lg" className="w-full">
                        Back to Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
    </AtlvsLayout>
  );
}
