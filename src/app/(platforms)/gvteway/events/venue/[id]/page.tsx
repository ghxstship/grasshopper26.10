/**
 * Venue Detail Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Hero, H2, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Separator } from '@/components/ui-rebuild/atoms/Separator';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  capacity?: number;
  description?: string;
}

interface Event {
  id: string;
  name: string;
  startDate: string;
}

export default function VenueDetailPage() {
  const params = useParams();
  const [venue, setVenue] = React.useState<Venue | null>(null);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const [venueRes, eventsRes] = await Promise.all([
          apiClient.get<Venue>(`/api/venues/${params.id}`),
          apiClient.get<{ events: Event[] }>(`/api/venues/${params.id}/events`),
        ]);
        
        if (venueRes.data) setVenue(venueRes.data);
        if (eventsRes.data?.events) setEvents(eventsRes.data.events);
      } catch (error) {
        console.error('Failed to fetch venue:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [params.id]);

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

  if (!venue) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <H2 className="mb-4">Venue Not Found</H2>
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
          <Hero className="mb-4">{venue.name}</Hero>
          <Body className="text-gray-600 text-lg">
            {venue.address}, {venue.city}
          </Body>
          {venue.capacity && (
            <Body className="text-gray-600 mt-2">
              Capacity: {venue.capacity.toLocaleString()}
            </Body>
          )}
        </div>

        {venue.description && (
          <>
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>About This Venue</CardTitle>
              </CardHeader>
              <CardHeader>
                <Body className="text-gray-700">{venue.description}</Body>
              </CardHeader>
            </Card>
          </>
        )}

        <Separator className="my-12" />

        <div>
          <H2 className="mb-8">Upcoming Events</H2>
          {events.length === 0 ? (
            <Card>
              <CardHeader>
                <Body className="text-gray-600 text-center py-12">
                  No upcoming events at this venue
                </Body>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>
                      {new Date(event.startDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link href={`/(rebuild)/events/${event.id}`} className="w-full">
                      <Button fullWidth>View Event</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
