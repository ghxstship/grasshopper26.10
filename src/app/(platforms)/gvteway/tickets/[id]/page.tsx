/**
 * Ticket Detail Page - UI Rebuild
 * Single ticket view with QR code
 */

'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Hero, H2, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Separator } from '@/components/ui-rebuild/atoms/Separator';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Ticket {
  id: string;
  status: string;
  qrCode: string;
  seatNumber?: string;
  event: {
    id: string;
    name: string;
    startDate: string;
    endDate?: string;
    venue: string;
    location: string;
    imageUrl?: string;
  };
  ticketType: {
    name: string;
    description?: string;
  };
  order: {
    id: string;
    orderNumber: string;
  };
}

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;

  const [ticket, setTicket] = React.useState<Ticket | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<Ticket>(`/api/tickets/${ticketId}`);
        if (response.data) {
          setTicket(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch ticket:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <H2 className="mb-4">Ticket Not Found</H2>
          <Body className="mb-8 text-gray-600">
            The ticket you are looking for does not exist.
          </Body>
          <Link href="/(rebuild)/tickets">
            <Button>View All Tickets</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/(rebuild)/tickets" className="font-share-tech text-sm text-gray-600 hover:text-black">
            ← Back to tickets
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Ticket Info */}
          <div>
            <div className="mb-8">
              <Badge className="mb-4">{ticket.status}</Badge>
              <Hero className="mb-4">{ticket.event.name}</Hero>
              <Body className="text-gray-600 text-lg">
                {ticket.ticketType.name}
              </Body>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Caption className="text-gray-500 mb-1">Date & Time</Caption>
                  <Body>{formatDate(ticket.event.startDate)}</Body>
                </div>
                <Separator />
                <div>
                  <Caption className="text-gray-500 mb-1">Venue</Caption>
                  <Body>{ticket.event.venue}</Body>
                  <Caption>{ticket.event.location}</Caption>
                </div>
                <Separator />
                {ticket.seatNumber && (
                  <>
                    <div>
                      <Caption className="text-gray-500 mb-1">Seat</Caption>
                      <Body>{ticket.seatNumber}</Body>
                    </div>
                    <Separator />
                  </>
                )}
                <div>
                  <Caption className="text-gray-500 mb-1">Order Number</Caption>
                  <Body>{ticket.order.orderNumber}</Body>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/(rebuild)/events/${ticket.event.id}`} className="w-full">
                  <Button variant="secondary" fullWidth>
                    View Event
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* QR Code */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Ticket</CardTitle>
                <CardDescription>
                  Show this QR code at the venue entrance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-white border-4 border-black p-8 flex items-center justify-center">
                  {ticket.qrCode ? (
                    <img
                      src={ticket.qrCode}
                      alt="Ticket QR Code"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <Body className="text-gray-600">QR Code will appear here</Body>
                    </div>
                  )}
                </div>
                <Caption className="text-center mt-4 block text-gray-500">
                  Ticket ID: {ticket.id}
                </Caption>
              </CardContent>
              <CardFooter className="flex-col space-y-3">
                <Button fullWidth>Download Ticket</Button>
                <Button variant="secondary" fullWidth>
                  Add to Wallet
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
