'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { FormField } from '@/components/molecules/FormField';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';

export default function AtlvsForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AtlvsLayout>
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,165,0,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-atlvs-orange-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <Link href="/atlvs">
                <h1 className="text-h1 font-bebas atlvs-text-gradient mb-2 cursor-pointerr">
                  ATLVS
                </h1>
              </Link>
              <p className="text-gray-400 font-roboto-condensed">Reset your password</p>
            </div>

            <Card variant="atlvs" className="bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-h4">Forgot Password?</CardTitle>
                <CardDescription className="text-gray-400">
                  {submitted 
                    ? 'Check your email for reset instructions'
                    : 'Enter your email and we will send you reset instructions'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!submitted ? (
                  <>
                    {error && (
                      <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg flex items-start gap-2" role="alert" aria-live="polite">
                        <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <p className="text-body-sm text-error">{error}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6" aria-label="Password reset form">
                      <FormField label="Email Address" required>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" aria-hidden="true" />
                          <Input
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="atlvs"
                            className="pl-10"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </FormField>

                      <Button 
                        type="submit" 
                        variant="atlvs" 
                        size="lg" 
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-atlvs-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                      <Mail className="w-8 h-8 text-atlvs-orange-500" aria-hidden="true" />
                    </div>
                    <p className="text-gray-300 mb-6">
                      We have sent password reset instructions to <strong>{email}</strong>
                    </p>
                    <Button 
                      variant="atlvs-outline" 
                      size="lg" 
                      className="w-full"
                      onClick={() => setSubmitted(false)}
                    >
                      Try Another Email
                    </Button>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <Link href="/atlvs/auth/login" className="inline-flex items-center text-body-sm text-gray-400 hover:text-gray-300">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AtlvsLayout>
  );
}
