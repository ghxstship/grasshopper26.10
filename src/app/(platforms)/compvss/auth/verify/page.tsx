/**
 * Verify Account Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';


interface VerifyStatus {
  verified: boolean;
  email: string;
  verificationSent: boolean;
  expiresAt?: string;
}

export default function VerifyAccountPage() {
  const [loading, setLoading] = React.useState(true);
  const [status, setStatus] = React.useState<VerifyStatus | null>(null);
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<VerifyStatus>('/api/auth/verify-status');
        if (response.data) {
          setStatus(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleResendVerification = async () => {
    setSending(true);
    try {
      await apiClient.post('/api/auth/resend-verification');
      alert('Verification email sent!');
    } catch (error) {
      console.error('Failed to resend:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar variant="compvss" />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="compvss" />
      
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <H1 className="mb-2">Verify Account</H1>
          <Body className="text-gray-600">Verify your email address</Body>
        </div>

        <Card variant="compvss">
          <CardHeader>
            <CardTitle>{status?.verified ? 'Account Verified' : 'Verification Required'}</CardTitle>
            <CardDescription>{status?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            {status?.verified ? (
              <Body className="text-green-600">✓ Your account is verified</Body>
            ) : (
              <div className="space-y-4">
                <Body>Please check your email for the verification link.</Body>
                {status?.expiresAt && (
                  <Body className="text-sm text-gray-500">
                    Link expires: {new Date(status.expiresAt).toLocaleString()}
                  </Body>
                )}
                <Button variant="compvss" onClick={handleResendVerification} disabled={sending} className="w-full">
                  {sending ? 'Sending...' : 'Resend Verification Email'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
