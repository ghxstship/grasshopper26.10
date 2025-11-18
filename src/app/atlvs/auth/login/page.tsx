'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { FormField } from '@/components/molecules/FormField';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Checkbox } from '@/components/atoms/Checkbox';

function AtlvsLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/atlvs/dashboard';
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [_error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error === 'CredentialsSignin' 
          ? 'Invalid email or password' 
          : result.error
        );
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch {
      setError('Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  return (
    <AtlvsLayout showNav={false}>
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,165,0,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Gradient Orbs */}
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
            {/* Logo */}
            <div className="text-center mb-8">
              <Link href="/atlvs">
                <h1 className="text-5xl font-bebas atlvs-text-gradient mb-2 cursor-pointer tracking-wider">
                  ATLVS
                </h1>
              </Link>
              <p className="text-gray-400 font-roboto-condensed">Internal Team Portal</p>
            </div>

            <Card variant="atlvs" className="bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Team Access</CardTitle>
                <CardDescription className="text-gray-400">
                  Sign in to your ATLVS account
                </CardDescription>
              </CardHeader>
              <CardContent>
                {_error && (
                  <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg flex items-start gap-2" role="alert" aria-live="polite">
                    <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-sm text-error">{_error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6" aria-label="Login form">
                  {/* Email Input */}
                  <FormField label="Email Address" required>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" aria-hidden="true" />
                      <Input
                        id="email"
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

                  {/* Password Input */}
                  <FormField label="Password" required>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" aria-hidden="true" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="atlvs"
                        className="pl-10 pr-10"
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 h-auto p-2"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </Button>
                    </div>
                  </FormField>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Checkbox 
                        variant="atlvs"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={isLoading}
                      />
                      <span className="ml-2 text-sm text-gray-400">Remember me</span>
                    </div>
                    <Link href="/atlvs/auth/forgot-password" className="text-sm text-atlvs-orange-500 hover:text-atlvs-orange-400">
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    variant="atlvs" 
                    size="lg" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                    </div>
                  </div>

                  {/* Google Sign In */}
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="lg" 
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                </form>

                {/* Register Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-400">
                    Need access?{' '}
                    <Link href="/atlvs/auth/register" className="text-atlvs-orange-500 hover:text-atlvs-orange-400 font-medium">
                      Request Account
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-400">
                ← Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </AtlvsLayout>
  );
}

export default function AtlvsLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    }>
      <AtlvsLoginContent />
    </Suspense>
  );
}
