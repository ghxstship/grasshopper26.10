'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Wallet as WalletIcon, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { FormField } from '@/components/molecules/FormField';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Checkbox } from '@/components/atoms/Checkbox';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/gvteway/dashboard';
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GvtewayLayout showNav={false}>
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Gradient Orbs */}
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
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/gvteway">
              <h1 className="text-5xl font-anton gvteway-text-gradient mb-2 cursor-pointer">
                GVTEWAY
              </h1>
            </Link>
            <p className="text-gray-400 font-oswald">Sign in to your account</p>
          </div>

          <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Welcome Back</CardTitle>
              <CardDescription className="text-gray-400">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-error">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <FormField label="Email Address" required>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </FormField>

                {/* Password Input */}
                <FormField label="Password" required>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      variant="gvteway"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoading}
                    />
                    <span className="ml-2 text-sm text-gray-400">Remember me</span>
                  </div>
                  <Link href="/gvteway/auth/forgot-password" className="text-sm text-gvteway-red-500 hover:text-gvteway-red-400">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  variant="gvteway" 
                  size="lg" 
                  className="w-full" 
                  rounded="full"
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

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4">
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
                  <Button type="button" variant="outline" size="lg" className="w-full">
                    <WalletIcon className="w-5 h-5 mr-2" />
                    Wallet
                  </Button>
                </div>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Don&apos;t have an account?{' '}
                  <Link href="/gvteway/auth/register" className="text-gvteway-red-500 hover:text-gvteway-red-400 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link href="/gvteway" className="text-sm text-gray-500 hover:text-gray-400">
              ← Back to GVTEWAY
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
    </GvtewayLayout>
  );
}
