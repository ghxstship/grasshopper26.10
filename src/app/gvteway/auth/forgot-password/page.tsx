'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { PageTitle, BodyText, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GvtewayLayout>
      <section className="section-padding">
        <div className="max-w-md mx-auto px-8">
          <div className="text-center mb-8">
            <PageTitle className="mb-4 uppercase text-ghxst-primary">Reset Password</PageTitle>
            <BodyText className="text-ghxst-text-secondary">
              Enter your email and we&apos;ll send you a reset link
            </BodyText>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border-2 border-destructive rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <BodyText className="text-destructive-foreground text-body-sm">{error}</BodyText>
            </div>
          )}

          {success ? (
            <div className="space-y-6">
              <div className="p-6 bg-success-light border-2 border-success-border rounded-lg">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <BodyText className="text-success-foreground mb-2">
                      Check your email
                    </BodyText>
                    <BodyText className="text-success-foreground text-body-sm">
                      We&apos;ve sent a password reset link to <strong>{email}</strong>
                    </BodyText>
                  </div>
                </div>
                <BodyText className="text-success-foreground text-body-sm">
                  Didn&apos;t receive the email? Check your spam folder or try again.
                </BodyText>
              </div>

              <Link href="/gvteway/auth/login">
                <Button variant="secondary" size="lg" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block mb-2">
                  <Metadata className="text-ghxst-text-primary">Email</Metadata>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ghxst-text-secondary" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={isLoading}
                    className="pl-12"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <Link href="/gvteway/auth/login">
                <Button variant="secondary" size="lg" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
            </form>
          )}
        </div>
      </section>
    </GvtewayLayout>
  );
}
