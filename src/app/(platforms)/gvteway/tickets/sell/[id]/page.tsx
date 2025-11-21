/**
 * Sell Ticket Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, H2, H3, Body, Label } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Alert } from '@/components/ui-rebuild/molecules/Alert';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { useParams, useRouter } from 'next/navigation';

interface Ticket {
  id: string;
  eventName: string;
  eventDate: string;
  section: string;
  row: string;
  seat: string;
  originalPrice: number;
}

export default function SellTicketPage() {
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [ticket, setTicket] = React.useState<Ticket | null>(null);
  const [price, setPrice] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const params = useParams();
  const router = useRouter();

  React.useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ ticket: Ticket }>(`/api/tickets/${params.id}`);
        if (response.data?.ticket) {
          setTicket(response.data.ticket);
          setPrice(response.data.ticket.originalPrice.toString());
        }
      } catch (error) {
        console.error('Failed to fetch ticket:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTicket();
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await apiClient.post(`/api/tickets/${params.id}/sell`, {
        price: parseFloat(price)
      });
      router.push('/tickets');
    } catch (err) {
      setError('Failed to list ticket for sale');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <H1 className="mb-4">Ticket Not Found</H1>
          <Body className="text-gray-600">The ticket you are trying to sell does not exist.</Body>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Sell Ticket</H1>
          <Body className="text-gray-600">
            List your ticket for sale on the marketplace
          </Body>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Body className="text-gray-600 text-sm">Event</Body>
                <H3>{ticket.eventName}</H3>
              </div>
              <div>
                <Body className="text-gray-600 text-sm">Date</Body>
                <Body>{new Date(ticket.eventDate).toLocaleDateString()}</Body>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Body className="text-gray-600 text-sm">Section</Body>
                  <H3>{ticket.section}</H3>
                </div>
                <div>
                  <Body className="text-gray-600 text-sm">Row</Body>
                  <H3>{ticket.row}</H3>
                </div>
                <div>
                  <Body className="text-gray-600 text-sm">Seat</Body>
                  <H3>{ticket.seat}</H3>
                </div>
              </div>
              <div>
                <Body className="text-gray-600 text-sm">Original Price</Body>
                <H2>${ticket.originalPrice}</H2>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Set Your Price</CardTitle>
                <CardDescription>
                  Choose a competitive price for your ticket
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="price">
                    Listing Price ($)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    disabled={submitting}
                  />
                  <Body className="text-gray-600 text-sm mt-2">
                    Platform fee: 10% • You will receive ${(parseFloat(price || '0') * 0.9).toFixed(2)}
                  </Body>
                </div>

                <Alert variant="default">
                  Once listed, your ticket will be visible to all buyers. You can cancel the listing anytime before it sells.
                </Alert>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    loading={submitting}
                    disabled={submitting || !price}
                    className="flex-1"
                  >
                    List for Sale
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
