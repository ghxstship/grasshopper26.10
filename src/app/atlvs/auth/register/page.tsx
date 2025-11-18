'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Building2, AlertCircle, CheckCircle } from 'lucide-react';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { FormField } from '@/components/molecules/FormField';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Checkbox } from '@/components/atoms/Checkbox';

export default function AtlvsRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Valid email address is required');
      return false;
    }
    if (!formData.company.trim()) {
      setError('Company name is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms of Service');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'INTERNAL_TEAM',
          metadata: {
            company: formData.company,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/atlvs/auth/verify-email?email=' + encodeURIComponent(formData.email));
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AtlvsLayout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
          <Card variant="atlvs" className="bg-gray-900/50 backdrop-blur-sm max-w-md w-full">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <CheckCircle className="w-10 h-10 text-success" aria-hidden="true" />
                </div>
                <h2 className="text-h4 font-bebas text-white mb-2" role="status" aria-live="polite">Registration Successful!</h2>
                <p className="text-gray-400 mb-6">
                  Please check your email to verify your account.
                </p>
                <p className="text-body-sm text-gray-500">Redirecting to verification page...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AtlvsLayout>
    );
  }

  return (
    <AtlvsLayout>
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,165,0,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
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
            <div className="text-center mb-8">
              <Link href="/atlvs">
                <h1 className="text-h1 font-bebas atlvs-text-gradient mb-2 cursor-pointerr">
                  ATLVS
                </h1>
              </Link>
              <p className="text-gray-400 font-roboto-condensed">Request Team Access</p>
            </div>

            <Card variant="atlvs" className="bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-h4">Create Account</CardTitle>
                <CardDescription className="text-gray-400">
                  Join the internal team platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                    <p className="text-body-sm text-error">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <FormField label="Full Name" required>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        variant="atlvs"
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </FormField>

                  <FormField label="Email Address" required>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        variant="atlvs"
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </FormField>

                  <FormField label="Company" required>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        type="text"
                        placeholder="Your Company"
                        value={formData.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        variant="atlvs"
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </FormField>

                  <FormField label="Password" required>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
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

                  <FormField label="Confirm Password" required>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        variant="atlvs"
                        className="pl-10 pr-10"
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 h-auto p-2"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </Button>
                    </div>
                  </FormField>

                  <div className="flex items-start">
                    <Checkbox 
                      variant="atlvs"
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
                      required
                      disabled={isLoading}
                    />
                    <span className="ml-2 text-body-sm text-gray-400">
                      I agree to the{' '}
                      <Link href="/terms" className="text-atlvs-orange-500 hover:text-atlvs-orange-400">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-atlvs-orange-500 hover:text-atlvs-orange-400">
                        Privacy Policy
                      </Link>
                    </span>
                  </div>

                  <Button 
                    type="submit" 
                    variant="atlvs" 
                    size="lg" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-body-sm text-gray-400">
                    Already have an account?{' '}
                    <Link href="/atlvs/auth/login" className="text-atlvs-orange-500 hover:text-atlvs-orange-400">
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <Link href="/" className="text-body-sm text-gray-500 hover:text-gray-400">
                ← Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </AtlvsLayout>
  );
}
