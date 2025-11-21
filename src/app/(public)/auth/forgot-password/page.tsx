/**
 * Forgot Password Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Hero, H2, Body, Label } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Alert } from '@/components/ui-rebuild/molecules/Alert';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.post('/api/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Hero className="mb-8 text-center">RESET PASSWORD</Hero>

        {success ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">✓</div>
              <Body className="mb-6">Check your email for password reset instructions.</Body>
              <Link href="/(rebuild)/auth/login">
                <Button fullWidth>Back to Login</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Enter your email</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {error && <Alert variant="error">{error}</Alert>}
                <div>
                  <Label htmlFor="email">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </CardContent>
              <CardContent>
                <Button type="submit" fullWidth loading={loading} disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <div className="mt-4 text-center">
                  <Link href="/(rebuild)/auth/login">
                    <Button variant="ghost" fullWidth>Back to Login</Button>
                  </Link>
                </div>
              </CardContent>
            </form>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
}
