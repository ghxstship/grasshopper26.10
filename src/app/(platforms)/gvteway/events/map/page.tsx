/**
 * Events Map View - UI Rebuild
 * Interactive map showing event locations
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { SearchBar } from '@/components/ui-rebuild/molecules/SearchBar';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Event {
  id: string;
  name: string;
  startDate: string;
  venue: string;
  location: string;
  category: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export default function EventsMapPage() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const params: Record<string, string> = {};
        if (searchQuery) params.search = searchQuery;
        
        const response = await apiClient.get<{ events: Event[] }>('/api/events', {
          params,
        });
        
        if (response.data?.events) {
          setEvents(response.data.events);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchQuery]);

  const groupedByLocation = events.reduce((acc, event) => {
    const key = event.location || 'Unknown Location';
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

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
        <div className="mb-8">
          <H1 className="mb-4">Events Map</H1>
          <Body className="text-gray-600 mb-6">
            Browse events by location
          </Body>
          <SearchBar
            placeholder="Search events by location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video bg-gray-100 border-2 border-black flex items-center justify-center mb-4">
                  <div className="text-center">
                    <svg className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <Body className="text-gray-600">Interactive map visualization</Body>
                    <Caption className="text-gray-500">Showing {events.length} events across {Object.keys(groupedByLocation).length} locations</Caption>
                  </div>
                </div>

                <div className="space-y-4">
                  <H3>Events by Location</H3>
                  {Object.entries(groupedByLocation).map(([location, locationEvents]) => (
                    <div key={location} className="border-2 border-black p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <H3>{location}</H3>
                          <Caption className="text-gray-600">{locationEvents.length} events</Caption>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {locationEvents.slice(0, 3).map(event => (
                          <div
                            key={event.id}
                            className="flex items-center justify-between p-2 bg-gray-50 border border-black cursor-pointer hover:bg-gray-100"
                            onClick={() => setSelectedEvent(event)}
                          >
                            <div className="flex-1">
                              <Body className="text-sm font-bold">{event.name}</Body>
                              <Caption className="text-xs">{event.venue}</Caption>
                            </div>
                            <Badge variant="outline">{event.category}</Badge>
                          </div>
                        ))}
                        {locationEvents.length > 3 && (
                          <Caption className="text-gray-600 text-center">+{locationEvents.length - 3} more events</Caption>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {selectedEvent ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{selectedEvent.category}</Badge>
                  </div>
                  <CardTitle>{selectedEvent.name}</CardTitle>
                  <CardDescription>
                    {new Date(selectedEvent.startDate).toLocaleDateString()} • {selectedEvent.venue}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Caption className="text-gray-500">Location</Caption>
                      <Body>{selectedEvent.location}</Body>
                    </div>
                    <div>
                      <Caption className="text-gray-500">Venue</Caption>
                      <Body>{selectedEvent.venue}</Body>
                    </div>
                  </div>
                </CardContent>
                <CardContent>
                  <Link href={`/events/${selectedEvent.id}`}>
                    <Button fullWidth>View Event Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Body className="text-gray-600">Select an event to view details</Body>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
