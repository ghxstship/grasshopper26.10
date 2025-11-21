/**
 * Event Detail Page - UI Rebuild
 * Single event view with ticket purchasing
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Hero, H1, H2, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Separator } from '@/components/ui-rebuild/atoms/Separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui-rebuild/molecules/Tabs';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  venue: string;
  location: string;
  category: string;
  status: string;
  imageUrl?: string;
  bannerUrl?: string;
  ticketsAvailable: number;
  capacity?: number;
  organizer?: {
    id: string;
    name: string;
  };
}

interface TicketType {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  sold: number;
  maxPerOrder: number;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = React.useState<Event | null>(null);
  const [ticketTypes, setTicketTypes] = React.useState<TicketType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedTickets, setSelectedTickets] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const [eventResponse, ticketsResponse] = await Promise.all([
          apiClient.get<Event>(`/api/events/${eventId}`),
          apiClient.get<{ ticketTypes: TicketType[] }>(`/api/events/${eventId}/tickets`),
        ]);

        if (eventResponse.data) {
          setEvent(eventResponse.data);
        }

        if (ticketsResponse.data?.ticketTypes) {
          setTicketTypes(ticketsResponse.data.ticketTypes);
        }
      } catch (error) {
        console.error('Failed to fetch event details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleTicketQuantityChange = (ticketTypeId: string, quantity: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketTypeId]: Math.max(0, quantity),
    }));
  };

  const getTotalPrice = () => {
    return ticketTypes.reduce((total, ticketType) => {
      const quantity = selectedTickets[ticketType.id] || 0;
      return total + ticketType.price * quantity;
    }, 0);
  };

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  };

  const handlePurchase = async () => {
    const tickets = Object.entries(selectedTickets)
      .filter(([, quantity]) => quantity > 0)
      .map(([ticketTypeId, quantity]) => ({ ticketTypeId, quantity }));

    if (tickets.length === 0) {
      return;
    }

    try {
      await apiClient.post('/api/tickets/purchase', {
        eventId,
        tickets,
      });

      router.push('/orders');
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

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

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
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

  if (!event) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <H2 className="mb-4">Event Not Found</H2>
          <Body className="mb-8 text-gray-600">
            The event you are looking for does not exist.
          </Body>
          <Link href="/events">
            <Button>Browse Events</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Banner */}
      {event.bannerUrl && (
        <div className="w-full h-96 bg-gray-200 border-b-4 border-black">
          <img
            src={event.bannerUrl}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Event Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline">{event.category}</Badge>
                <Badge variant={event.status === 'LIVE' ? 'default' : 'ghost'}>
                  {event.status}
                </Badge>
              </div>
              <Hero className="mb-4">{event.name}</Hero>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <svg className="h-6 w-6 flex-shrink-0 mt-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <Caption className="text-gray-500 mb-1">Date & Time</Caption>
                <Body>{formatDate(event.startDate)}</Body>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="h-6 w-6 flex-shrink-0 mt-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <Caption className="text-gray-500 mb-1">Location</Caption>
                <Body>{event.venue}</Body>
                <Caption>{event.location}</Caption>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="h-6 w-6 flex-shrink-0 mt-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <div>
                <Caption className="text-gray-500 mb-1">Availability</Caption>
                <Body>{event.ticketsAvailable} tickets available</Body>
                {event.capacity && (
                  <Caption>Capacity: {event.capacity}</Caption>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-12" />

        {/* Content Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Tabs defaultValue="about">
              <TabsList>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="organizer">Organizer</TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <H3 className="mb-4">About This Event</H3>
                <Body className="text-gray-700 whitespace-pre-line">
                  {event.description}
                </Body>
              </TabsContent>

              <TabsContent value="details">
                <H3 className="mb-4">Event Details</H3>
                <div className="space-y-4">
                  <div>
                    <Caption className="text-gray-500 mb-1">Start Date</Caption>
                    <Body>{formatDate(event.startDate)}</Body>
                  </div>
                  {event.endDate && (
                    <div>
                      <Caption className="text-gray-500 mb-1">End Date</Caption>
                      <Body>{formatDate(event.endDate)}</Body>
                    </div>
                  )}
                  <div>
                    <Caption className="text-gray-500 mb-1">Venue</Caption>
                    <Body>{event.venue}</Body>
                  </div>
                  <div>
                    <Caption className="text-gray-500 mb-1">Location</Caption>
                    <Body>{event.location}</Body>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="organizer">
                <H3 className="mb-4">Event Organizer</H3>
                {event.organizer && (
                  <Body>{event.organizer.name}</Body>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Ticket Selection */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Select Tickets</CardTitle>
                <CardDescription>Choose your ticket type and quantity</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {ticketTypes.map((ticketType) => {
                  const available = ticketType.quantity - ticketType.sold;
                  const selectedQty = selectedTickets[ticketType.id] || 0;

                  return (
                    <div key={ticketType.id} className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <H3>
                            {ticketType.name}
                          </H3>
                          {ticketType.description && (
                            <Caption className="text-gray-600">
                              {ticketType.description}
                            </Caption>
                          )}
                          <Caption className="text-gray-500">
                            {available} available
                          </Caption>
                        </div>
                        <H3>
                          {formatPrice(ticketType.price, ticketType.currency)}
                        </H3>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            handleTicketQuantityChange(ticketType.id, selectedQty - 1)
                          }
                          disabled={selectedQty === 0}
                        >
                          −
                        </Button>
                        <span className="font-share-tech text-lg w-12 text-center">
                          {selectedQty}
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            handleTicketQuantityChange(ticketType.id, selectedQty + 1)
                          }
                          disabled={
                            selectedQty >= available ||
                            selectedQty >= ticketType.maxPerOrder
                          }
                        >
                          +
                        </Button>
                      </div>

                      <Separator />
                    </div>
                  );
                })}

                {ticketTypes.length === 0 && (
                  <Body className="text-center text-gray-600">
                    No tickets available
                  </Body>
                )}
              </CardContent>

              {ticketTypes.length > 0 && (
                <CardFooter className="flex-col space-y-4">
                  <div className="w-full flex items-center justify-between">
                    <H2>Total</H2>
                    <H2>
                      {formatPrice(getTotalPrice(), 'USD')}
                    </H2>
                  </div>

                  <Button
                    fullWidth
                    size="lg"
                    onClick={handlePurchase}
                    disabled={getTotalTickets() === 0}
                  >
                    Purchase {getTotalTickets() > 0 && `(${getTotalTickets()})`}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
