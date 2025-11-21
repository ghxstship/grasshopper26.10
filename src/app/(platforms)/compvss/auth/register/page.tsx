/**
 * Register Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { H1, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { Alert } from '@/components/ui-rebuild/molecules/Alert';
import { apiClient } from '@/lib/api/client';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/api/auth/register', { name: formData.name, email: formData.email, password: formData.password });
      router.push('/compvss/auth/verify');
    } catch {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="compvss" />
      
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <H1 className="mb-2">Register</H1>
          <Body className="text-gray-600">Create your COMPVSS account</Body>
        </div>

        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        <Card variant="compvss">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Caption className="font-medium mb-2">Name</Caption>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div>
                <Caption className="font-medium mb-2">Email</Caption>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div>
                <Caption className="font-medium mb-2">Password</Caption>
                <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </div>
              <div>
                <Caption className="font-medium mb-2">Confirm Password</Caption>
                <Input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
              </div>
              <Button type="submit" variant="compvss" disabled={loading} className="w-full">
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
