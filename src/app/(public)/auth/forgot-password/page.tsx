'use client';

import { useState } from 'react';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Card, CardHeader, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Body, H2 } from '@/components/ui-rebuild/atoms/Typography';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to send reset email');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
        <Card variant="default" className="w-full max-w-md">
          <CardHeader>
            <H2>Check Your Email</H2>
            <CardDescription>
              We&apos;ve sent a password reset link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Body className="text-gray-600">
              Please check your email and click the link to reset your password. 
              The link will expire in 1 hour.
            </Body>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/auth/login">
              <Button variant="secondary">Back to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <Card variant="default" className="w-full max-w-md">
        <CardHeader>
          <H2>Reset Password</H2>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500 rounded-md">
                <Body className="text-red-500 text-sm">{error}</Body>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Body className="text-sm text-gray-400">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-green-500 hover:text-green-400">
              Sign in
            </Link>
          </Body>
        </CardFooter>
      </Card>
    </div>
  );
}
