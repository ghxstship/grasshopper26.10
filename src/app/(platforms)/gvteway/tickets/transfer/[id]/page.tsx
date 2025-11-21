/**
 * Transfer Ticket Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Hero, H1, H3, Body, Label } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Alert } from '@/components/ui-rebuild/molecules/Alert';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

export default function TransferTicketPage() {
  const params = useParams();
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.post(`/api/tickets/${params.id}/transfer`, { email });
      router.push('/(rebuild)/tickets?transferred=success');
    } catch {
      setError('Failed to transfer ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Hero className="mb-8 text-center">TRANSFER TICKET</Hero>
        <Card>
          <CardHeader>
            <CardTitle>Transfer to another user</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && <Alert variant="error">{error}</Alert>}
              <div>
                <Label htmlFor="email">
                  Recipient Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="recipient@example.com"
                />
              </div>
              <Body className="text-sm text-gray-600">
                The ticket will be transferred to this email address. They will receive a confirmation email.
              </Body>
            </CardContent>
            <CardContent className="flex gap-3">
              <Button type="submit" fullWidth loading={loading} disabled={loading}>
                {loading ? 'Transferring...' : 'Transfer Ticket'}
              </Button>
              <Button variant="ghost" fullWidth onClick={() => router.back()}>
                Cancel
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
