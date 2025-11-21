/**
 * Register Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body, Label } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';


export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post('/api/atlvs/auth/register', formData);
      router.push('/atlvs/auth/login');
    } catch {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="atlvs" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Create Account</H1>
          <Body className="text-gray-600">Register for ATLVS platform access</Body>
        </div>
        <Card variant="atlvs" className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              {error && <div className="p-3 bg-red-50 border-2 border-red-600 text-red-600"><Body>{error}</Body></div>}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="atlvs" type="submit" disabled={loading} loading={loading} className="w-full">Create Account</Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
