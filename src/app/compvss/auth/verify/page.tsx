'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/atoms/Card';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { useResendVerification } from '@/lib/hooks/auth/useAuthMutations';
import { BodyText, HeroTitle } from "@/components/atoms/Typography";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your-email@example.com';
  
  const resendMutation = useResendVerification();
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    setError('');
    
    try {
      await resendMutation.mutateAsync({ email });
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch {
      setError('Failed to resend email. Please try again.');
    }
  };

  return (
    <CompvssLayout>
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 lg:px-8 -m-6">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 bg-compvss-cyan-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <Link href="/compvss">
              <HeroTitle className="compvss-text-gradient mb-2 cursor-pointer">
                COMPVSS
              </HeroTitle>
            </Link>
            <BodyText className="text-grey-400">Verify Your Email</BodyText>
          </div>

          {/* Verification Card */}
          <Card variant="compvss" className="bg-grey-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-compvss-cyan-500/10 flex items-center justify-center">
                  <Mail className="w-10 h-10 text-compvss-cyan-500" />
                </div>
              </div>
              <CardTitle className="text-white text-center">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-grey-400 text-center">
                We&apos;ve sent a verification link to your email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Email Display */}
                <div className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20 text-center">
                  <p className="text-white">{email}</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-error/10 border border-error/30 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-error" />
                    <p className="text-body-sm text-error -tech">{error}</p>
                  </div>
                )}

                {/* Instructions */}
                <div className="space-y-3 text-body-sm text-grey-400 -tech">
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-compvss-cyan-500 mt-0.5 flex-shrink-0" />
                    <span>Click the verification link in the email</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-compvss-cyan-500 mt-0.5 flex-shrink-0" />
                    <span>The link will expire in 24 hours</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-compvss-cyan-500 mt-0.5 flex-shrink-0" />
                    <span>Check your spam folder if you don&apos;t see it</span>
                  </p>
                </div>

                {/* Resend Button */}
                <div className="pt-4">
                  {resent ? (
                    <div className="p-4 rounded-lg bg-success-light0/10 border border-success/30 text-center">
                      <BodyText className="text-success">
                        ✓ Verification email resent!
                      </BodyText>
                    </div>
                  ) : (
                    <Button
                      variant="compvss-outline"
                      size="lg"
                      className="w-full"
                      onClick={handleResend}
                      disabled={resendMutation.isPending}
                    >
                      {resendMutation.isPending ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2" />
                          Resend Verification Email
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* Back to Login */}
                <div className="text-center">
                  <Link href="/compvss/auth/login">
                    <Button variant="compvss-ghost" size="sm">
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-body-sm text-grey-500 -tech">
              Need help? <Link href="/contact" className="text-compvss-cyan-500 hover:text-compvss-teal-500">Contact Support</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
    </CompvssLayout>
  );
}

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/auth/verify

export default function CompvssVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-grey-950 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-info" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
