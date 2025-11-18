'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Building2, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { useRegister } from '@/lib/hooks/auth/useAuthMutations';
import { FormField } from '@/components/molecules/FormField';
import { Checkbox } from '@/components/atoms/Checkbox';
import { CompvssLayout } from '@/components/templates/CompvssLayout';

export default function CompvssRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const registerMutation = useRegister();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    try {
      await registerMutation.mutateAsync({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        metadata: { organization: formData.organization }
      });
      router.push('/compvss/auth/verify?email=' + encodeURIComponent(formData.email));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <CompvssLayout>
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Gradient Orbs */}
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 bg-compvss-cyan-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <Link href="/compvss">
              <h1 className="compvss-text-gradient text-h1 font-anton mb-2 cursor-pointer">
                COMPVSS
              </h1>
            </Link>
            <p className="text-gray-400 font-oswald">Join the External Teams Portal</p>
          </div>

          {/* Register Card */}
          <Card variant="compvss" className="bg-gray-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-compvss-cyan-500" />
                Create Account
              </CardTitle>
              <CardDescription className="text-gray-400">
                Get started with COMPVSS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-error/10 border border-error/30 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-error" />
                    <p className="text-body-sm text-error font-share-tech">{error}</p>
                  </div>
                )}

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="First Name" required>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className="pl-10 bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                        disabled={registerMutation.isPending}
                        required
                      />
                    </div>
                  </FormField>

                  <FormField label="Last Name" required>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        className="pl-10 bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                        disabled={registerMutation.isPending}
                        required
                      />
                    </div>
                  </FormField>
                </div>

                {/* Email Field */}
                <FormField label="Email Address" required>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="pl-10 bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                      disabled={registerMutation.isPending}
                      required
                    />
                  </div>
                </FormField>

                {/* Organization Field */}
                <FormField label="Organization / Company" required>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="organization"
                      type="text"
                      placeholder="Your Company Name"
                      value={formData.organization}
                      onChange={(e) => handleChange('organization', e.target.value)}
                      className="pl-10 bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                      disabled={registerMutation.isPending}
                      required
                    />
                  </div>
                </FormField>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Password" required>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        className="pl-10 pr-10 bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                        disabled={registerMutation.isPending}
                        required
                      />
                      <Button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-0 h-auto text-gray-400 hover:text-compvss-cyan-500"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </Button>
                    </div>
                  </FormField>

                  <FormField label="Confirm Password" required>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        className="pl-10 pr-10 bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                        disabled={registerMutation.isPending}
                        required
                      />
                      <Button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-0 h-auto text-gray-400 hover:text-compvss-cyan-500"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </Button>
                    </div>
                  </FormField>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start gap-2">
                  <Checkbox 
                    variant="compvss" 
                    id="terms" 
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    disabled={registerMutation.isPending}
                    required 
                  />
                  <span className="text-body-sm text-gray-400 font-share-tech">
                    I agree to the{' '}
                    <Link href="/terms" className="text-compvss-cyan-500 hover:text-compvss-teal-500">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-compvss-cyan-500 hover:text-compvss-teal-500">
                      Privacy Policy
                    </Link>
                  </span>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="compvss"
                  size="lg"
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
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
                  <div className="relative flex justify-center text-body-sm">
                    <span className="px-2 bg-gray-900 text-gray-400 font-share-tech">
                      Already have an account?
                    </span>
                  </div>
                </div>

                {/* Login Link */}
                <Link href="/compvss/auth/login">
                  <Button
                    type="button"
                    variant="compvss-outline"
                    size="lg"
                    className="w-full"
                  >
                    Sign In
                  </Button>
                </Link>
              </form>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-body-sm text-gray-500 font-share-tech">
              Need help? <Link href="/contact" className="text-compvss-cyan-500 hover:text-compvss-teal-500">Contact Support</Link>
            </p>
            <Link href="/" className="text-body-sm text-gray-500 hover:text-gray-400 font-share-tech block">
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
    </CompvssLayout>
  );
}
