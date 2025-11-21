'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Card, CardHeader, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Body, H2 } from '@/components/ui-rebuild/atoms/Typography';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push('/dashboard');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <Card variant="default" className="w-full max-w-md">
        <CardHeader>
          <H2>Welcome Back</H2>
          <CardDescription>
            Sign in to your GVTEWAY account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <Body className="text-sm">Remember me</Body>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-green-500 hover:text-green-400">
                Forgot password?
              </Link>
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
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                onClick={() => handleOAuthSignIn('google')}
                disabled={isLoading}
              >
                Google
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleOAuthSignIn('bluesky')}
                disabled={isLoading}
              >
                Bluesky
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Body className="text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-green-500 hover:text-green-400">
              Sign up
            </Link>
          </Body>
        </CardFooter>
      </Card>
    </div>
  );
}
