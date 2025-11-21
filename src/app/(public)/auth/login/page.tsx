/**
 * Login Page - UI Rebuild
 * Authentication with API integration
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post<{ token: string; user: { id: string; email: string; name: string } }>(
        '/api/auth/login',
        { email, password }
      );

      if (response.data) {
        // Store token
        if (rememberMe) {
          localStorage.setItem('auth_token', response.data.token);
        } else {
          sessionStorage.setItem('auth_token', response.data.token);
        }

        // Set token in API client
        apiClient.setAuthToken(response.data.token);

        // Redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError(err.message as string);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <H1 className="mb-4">GVTEWAY</H1>
          <Body className="text-gray-600">Sign in to your account</Body>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your credentials to continue</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <div className="bg-gray-100 border-2 border-black p-4">
                  <Body className="text-sm text-gray-900">{error}</Body>
                </div>
              )}

              <div className="space-y-4">
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
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Checkbox
                    id="remember"
                    label="Remember me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  <Link
                    href="/auth/forgot-password"
                    className="font-share-tech text-sm text-gray-600 hover:text-black underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col space-y-4">
              <Button type="submit" fullWidth loading={loading} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Body className="text-sm text-center text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="text-black font-bold hover:underline">
                  Sign up
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
