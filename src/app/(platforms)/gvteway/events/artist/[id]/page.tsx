/**
 * Artist Profile Page - UI Rebuild
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

interface Artist {
  id: string;
  name: string;
  genre?: string;
  bio?: string;
}

interface Event {
  id: string;
  name: string;
  startDate: string;
  venue: string;
}

export default function ArtistProfilePage() {
  const params = useParams();
  const [artist, setArtist] = React.useState<Artist | null>(null);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchArtist = async () => {
      try {
        setLoading(true);
        const [artistRes, eventsRes] = await Promise.all([
          apiClient.get<Artist>(`/api/artists/${params.id}`),
          apiClient.get<{ events: Event[] }>(`/api/artists/${params.id}/events`),
        ]);
        
        if (artistRes.data) setArtist(artistRes.data);
        if (eventsRes.data?.events) setEvents(eventsRes.data.events);
      } catch (error) {
        console.error('Failed to fetch artist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
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

  if (!artist) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <H2 className="mb-4">Artist Not Found</H2>
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
          <Hero className="mb-4">{artist.name}</Hero>
          {artist.genre && (
            <Body className="text-gray-600 text-lg">{artist.genre}</Body>
          )}
        </div>

        {artist.bio && (
          <>
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardHeader>
                <Body className="text-gray-700">{artist.bio}</Body>
              </CardHeader>
            </Card>
          </>
        )}

        <Separator className="my-12" />

        <div>
          <H2 className="mb-8">Upcoming Shows</H2>
          {events.length === 0 ? (
            <Card>
              <CardHeader>
                <Body className="text-gray-600 text-center py-12">
                  No upcoming shows
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
                      {new Date(event.startDate).toLocaleDateString()} • {event.venue}
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
