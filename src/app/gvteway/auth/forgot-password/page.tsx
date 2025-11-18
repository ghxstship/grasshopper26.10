'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { FormField } from '@/components/molecules/FormField';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';

export default function ForgotPasswordPage() {
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

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send reset email');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GvtewayLayout showNav={false}>
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 bg-gvteway-red-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

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
            <p className="text-gray-400 font-oswald">Reset your password</p>
          </div>

          <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Forgot Password?</CardTitle>
              <CardDescription className="text-gray-400">
                {submitted 
                  ? 'Check your email for reset instructions'
                  : 'Enter your email and we will send you reset instructions'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!submitted ? (
                <>
                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/30 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-error" />
                      <p className="text-sm text-error font-share-tech">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                  <FormField label="Email Address">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="pl-10"
                        required
                      />
                    </div>
                  </FormField>

                  <Button 
                    type="submit" 
                    variant="gvteway" 
                    size="lg" 
                    className="w-full" 
                    rounded="full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-gvteway-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-gvteway-red-500" />
                  </div>
                  <p className="text-gray-300 mb-6">
                    We have sent password reset instructions to <strong>{email}</strong>
                  </p>
                  <Button 
                    variant="gvteway-outline" 
                    size="lg" 
                    className="w-full" 
                    rounded="full"
                    onClick={() => setSubmitted(false)}
                  >
                    Try Another Email
                  </Button>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link href="/gvteway/auth/login" className="inline-flex items-center text-sm text-gray-400 hover:text-gray-300">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
    </GvtewayLayout>
  );
}
