'use client';

import { useState } from 'react';
import { useRegister } from '@/hooks/auth/useRegister';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Card, CardHeader, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Body, H2 } from '@/components/ui-rebuild/atoms/Typography';
import Link from 'next/link';

export default function RegisterPage() {
  const { register, isLoading, error } = useRegister();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'CONSUMER' as 'CONSUMER' | 'EXTERNAL_TEAM' | 'INTERNAL_TEAM',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
      });
    } catch {
      // Error is handled by the hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <Card variant="default" className="w-full max-w-md">
        <CardHeader>
          <H2>Create Account</H2>
          <CardDescription>
            Join GVTEWAY to discover amazing events and experiences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="John Doe"
              />
            </div>

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
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                placeholder="••••••••"
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-2">
                Account Type
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="CONSUMER">Consumer (Event Attendee)</option>
                <option value="EXTERNAL_TEAM">External Team (Vendor/Contractor)</option>
                <option value="INTERNAL_TEAM">Internal Team (Production Staff)</option>
              </select>
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Body className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-green-500 hover:text-green-400">
              Sign in
            </Link>
          </Body>
        </CardFooter>
      </Card>
    </div>
  );
}
