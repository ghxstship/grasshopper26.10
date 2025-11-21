/**
 * Event History Page - UI Rebuild
 * View attended events and analytics
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H3, Body, Caption, Display } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui-rebuild/molecules/Tabs';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface EventHistory {
  id: string;
  eventName: string;
  eventDate: string;
  venue: string;
  category: string;
  ticketsPurchased: number;
  amountSpent: number;
  currency: string;
}


export default function EventHistoryPage() {
  const [events, setEvents] = React.useState<EventHistory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({ total: 0, totalSpent: 0, categories: {} });

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ events: EventHistory[]; stats: any }>('/api/analytics/events');
        if (response.data?.events) {
          setEvents(response.data.events);
          setStats(response.data.stats || { total: 0, totalSpent: 0, categories: {} });
        }
      } catch (error) {
        console.error('Failed to fetch event history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatPrice = (price: number, currency: string = 'USD') => {
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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Event History</H1>
          <Body className="text-gray-600">
            Your complete event attendance history and insights
          </Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Events Attended</Caption>
              <Display as="div">{stats.total}</Display>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Total Spent</Caption>
              <Display as="div">{formatPrice(stats.totalSpent)}</Display>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Avg per Event</Caption>
              <Display as="div">
                {stats.total > 0 ? formatPrice(stats.totalSpent / stats.total) : '$0'}
              </Display>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            {events.length === 0 ? (
              <Card>
                <CardContent className="py-24 text-center">
                  <H3 className="mb-4">No events in history</H3>
                  <Body className="mb-8 text-gray-600">
                    Start attending events to build your history.
                  </Body>
                  <Link href="/events">
                    <Button>Browse Events</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge>{event.category}</Badge>
                          </div>
                          <CardTitle>{event.eventName}</CardTitle>
                          <CardDescription>
                            {new Date(event.eventDate).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })} • {event.venue}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <H3>{formatPrice(event.amountSpent, event.currency)}</H3>
                          <Caption className="text-gray-500">
                            {event.ticketsPurchased} {event.ticketsPurchased === 1 ? 'ticket' : 'tickets'}
                          </Caption>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            <Body className="text-center py-12 text-gray-600">Filter upcoming events</Body>
          </TabsContent>

          <TabsContent value="past">
            <Body className="text-center py-12 text-gray-600">Filter past events</Body>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
