'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Wallet as WalletIcon, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { FormField } from '@/components/molecules/FormField';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Checkbox } from '@/components/atoms/Checkbox';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      router.push(`/gvteway/auth/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <GvtewayLayout showNav={false}>
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
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
            <p className="text-gray-400 font-oswald">Create your account</p>
          </div>

          <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Get Started</CardTitle>
              <CardDescription className="text-gray-400">
                Join thousands discovering unforgettable experiences
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/30 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-error" />
                  <p className="text-sm text-error font-share-tech">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Input */}
                <FormField label="Full Name">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      disabled={isLoading}
                      variant="gvteway"
                      className="pl-10"
                      required
                    />
                  </div>
                </FormField>

                {/* Email Input */}
                <FormField label="Email Address">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      disabled={isLoading}
                      variant="gvteway"
                      className="pl-10"
                      required
                    />
                  </div>
                </FormField>

                {/* Password Input */}
                <FormField label="Password">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      disabled={isLoading}
                      variant="gvteway"
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 h-auto p-2"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>
                  </div>
                </FormField>

                {/* Confirm Password Input */}
                <FormField label="Confirm Password">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      disabled={isLoading}
                      variant="gvteway"
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 h-auto p-2"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>
                  </div>
                </FormField>

                {/* Terms Checkbox */}
                <div className="flex items-start">
                  <Checkbox 
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    disabled={isLoading}
                    variant="gvteway"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-400">
                    I agree to the{' '}
                    <Link href="/terms" className="text-gvteway-red-500 hover:text-gvteway-red-400">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-gvteway-red-500 hover:text-gvteway-red-400">
                      Privacy Policy
                    </Link>
                  </span>
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
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">Or sign up with</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4">
                  <Button type="button" variant="outline" size="lg" className="w-full">
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

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Already have an account?{' '}
                  <Link href="/gvteway/auth/login" className="text-gvteway-red-500 hover:text-gvteway-red-400 font-medium">
                    Sign in
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
