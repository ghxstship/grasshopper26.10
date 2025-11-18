'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { PageTitle, BodyText, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';

export default function RegisterPage() {
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/gvteway/auth/login?registered=true');
      }, 2000);
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
            <PageTitle className="mb-4 uppercase text-ghxst-primary">Create Account</PageTitle>
            <BodyText className="text-ghxst-text-secondary">
              Join GVTEWAY and discover events
            </BodyText>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border-2 border-destructive rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <BodyText className="text-destructive-foreground text-body-sm">{error}</BodyText>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-success-light border-2 border-success-border rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <BodyText className="text-success-foreground text-body-sm">
                Account created successfully! Redirecting to login...
              </BodyText>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2">
                <Metadata className="text-ghxst-text-primary">Full Name</Metadata>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ghxst-text-secondary" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                  className="pl-12"
                />
              </div>
            </div>

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

            <div>
              <label htmlFor="password" className="block mb-2">
                <Metadata className="text-ghxst-text-primary">Password</Metadata>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ghxst-text-secondary" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
                  className="pl-12 pr-12"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ghxst-text-secondary hover:text-ghxst-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-2">
                <Metadata className="text-ghxst-text-primary">Confirm Password</Metadata>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ghxst-text-secondary" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                  className="pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ghxst-text-secondary hover:text-ghxst-text-primary transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading || success}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <BodyText className="text-ghxst-text-secondary">
              Already have an account?{' '}
              <Link
                href="/gvteway/auth/login"
                className="text-ghxst-primary hover:underline"
              >
                Sign in
              </Link>
            </BodyText>
          </div>
        </div>
      </section>
    </GvtewayLayout>
  );
}
