/**
 * Tickets Page - UI Rebuild
 * User's ticket collection
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui-rebuild/molecules/Tabs';
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
    venue: string;
    imageUrl?: string;
  };
  ticketType: {
    name: string;
  };
}

export default function TicketsPage() {
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ tickets: Ticket[] }>('/api/tickets');
        if (response.data?.tickets) {
          setTickets(response.data.tickets);
        }
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const upcomingTickets = tickets.filter(
    (ticket) => new Date(ticket.event.startDate) > new Date() && ticket.status === 'VALID'
  );

  const pastTickets = tickets.filter(
    (ticket) => new Date(ticket.event.startDate) <= new Date() || ticket.status !== 'VALID'
  );

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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">My Tickets</H1>
          <Body className="text-gray-600">
            View and manage all your event tickets.
          </Body>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingTickets.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastTickets.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingTickets.length === 0 ? (
              <Card>
                <CardContent className="py-24 text-center">
                  <H3 className="mb-4">No upcoming tickets</H3>
                  <Body className="mb-8 text-gray-600">
                    You don&apos;t have any upcoming events.
                  </Body>
                  <Link href="/(rebuild)/events">
                    <Button>Browse Events</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingTickets.map((ticket) => (
                  <Card key={ticket.id}>
                    {ticket.event.imageUrl && (
                      <div className="aspect-video bg-gray-200 border-b-2 border-black">
                        <img
                          src={ticket.event.imageUrl}
                          alt={ticket.event.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge>{ticket.ticketType.name}</Badge>
                        <Badge variant={ticket.status === 'VALID' ? 'default' : 'ghost'}>
                          {ticket.status}
                        </Badge>
                      </div>
                      <CardTitle>{ticket.event.name}</CardTitle>
                      <CardDescription>
                        {formatDate(ticket.event.startDate)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Caption className="flex items-center gap-2">
                          <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {ticket.event.venue}
                        </Caption>
                        {ticket.seatNumber && (
                          <Caption className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                            </svg>
                            Seat {ticket.seatNumber}
                          </Caption>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/(rebuild)/tickets/${ticket.id}`} className="w-full">
                        <Button fullWidth>View Ticket</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastTickets.length === 0 ? (
              <Card>
                <CardContent className="py-24 text-center">
                  <Body className="text-gray-600">
                    No past tickets to display.
                  </Body>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastTickets.map((ticket) => (
                  <Card key={ticket.id} className="opacity-60">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="ghost">{ticket.ticketType.name}</Badge>
                        <Badge variant="ghost">{ticket.status}</Badge>
                      </div>
                      <CardTitle>{ticket.event.name}</CardTitle>
                      <CardDescription>
                        {formatDate(ticket.event.startDate)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Caption className="text-gray-500">
                        {ticket.event.venue}
                      </Caption>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
