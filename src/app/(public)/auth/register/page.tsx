/**
 * Register Page - UI Rebuild
 * User registration with API integration
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { H1, Body, Label } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Checkbox } from '@/components/ui-rebuild/atoms/Checkbox';
import { apiClient } from '@/lib/api/client';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post<{ token: string; user: { id: string; email: string; name: string } }>(
        '/api/auth/register',
        { name, email, password }
      );

      if (response.data) {
        // Store token
        localStorage.setItem('auth_token', response.data.token);

        // Set token in API client
        apiClient.setAuthToken(response.data.token);

        // Redirect to onboarding or dashboard
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError(err.message as string);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <H1 className="mb-4">GVTEWAY</H1>
          <Body className="text-gray-600">Create your account</Body>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Join thousands of members experiencing the best events</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <div className="bg-gray-100 border-2 border-black p-4">
                  <Body className="text-sm text-gray-900">{error}</Body>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="password">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    helperText="Minimum 8 characters"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <Checkbox
                  id="terms"
                  label={
                    <span className="font-share-tech text-sm">
                      I agree to the{' '}
                      <Link href="/terms" className="text-black font-bold hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-black font-bold hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  }
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  disabled={loading}
                />
              </div>
            </CardContent>

            <CardFooter className="flex-col space-y-4">
              <Button type="submit" fullWidth loading={loading} disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>

              <Body className="text-sm text-center text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-black font-bold hover:underline">
                  Sign in
                </Link>
              </Body>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/" className="font-share-tech text-sm text-gray-600 hover:text-black">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
