/**
 * Events Map Page - UI Rebuild
 * Interactive map view of events by location
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Hero, H2, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { MapPin, Navigation, Search, Calendar } from 'lucide-react';

interface EventLocation {
  id: string;
  name: string;
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    coordinates: { lat: number; lng: number };
  };
  date: string;
  category: string;
  price: { min: number; max: number };
}

interface MapData {
  features: EventLocation[];
  center: { lat: number; lng: number };
}

export default function EventsMapPage() {
  const [events, setEvents] = React.useState<MapData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedEvent, setSelectedEvent] = React.useState<EventLocation | null>(null);
  const [locationSearch, setLocationSearch] = React.useState('');

  React.useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ data: MapData }>('/api/events/map');
        if (response.data?.data) {
          setEvents(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch map data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  const handleLocationSearch = async () => {
    if (!locationSearch) return;
    try {
      setLoading(true);
      const response = await apiClient.get<{ data: MapData }>(`/api/events/map?location=${encodeURIComponent(locationSearch)}`);
      if (response.data?.data) {
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error('Failed to search location:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b-4 border-black bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <MapPin className="w-12 h-12" />
              <Hero>EVENTS MAP</Hero>
            </div>
            <Body className="max-w-2xl mx-auto text-gray-700 text-xl">
              Discover events near you with our interactive map view.
            </Body>
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter city, state, or zip code..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                    className="pl-12"
                  />
                </div>
                <Button onClick={handleLocationSearch}>
                  <Navigation className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map and Events Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map View */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Event Locations</CardTitle>
                  <CardDescription>
                    {events?.features?.length || 0} events found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Map Placeholder - In production, integrate with Google Maps, Mapbox, or Leaflet */}
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-4 border-black flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-10">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className="border border-gray-400" />
                      ))}
                    </div>
                    <div className="relative z-10 text-center">
                      <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                      <H3 className="mb-2">Interactive Map</H3>
                      <Body className="text-gray-600">
                        Map integration with {events?.features?.length || 0} event markers
                      </Body>
                      <Caption className="text-gray-500 mt-2">
                        Click on markers to view event details
                      </Caption>
                    </div>
                    {/* Simulated map pins */}
                    {events?.features?.slice(0, 5).map((event, index) => (
                      <button
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="absolute w-8 h-8 bg-red-600 rounded-full border-4 border-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
                        style={{
                          left: `${20 + index * 15}%`,
                          top: `${30 + (index % 3) * 20}%`,
                        }}
                        title={event.name}
                      >
                        <MapPin className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Event List */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>
                    {selectedEvent ? 'Selected Event' : 'Nearby Events'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedEvent ? (
                    <div className="space-y-4">
                      <div>
                        <H3 className="mb-2">{selectedEvent.name}</H3>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-1 text-gray-600" />
                            <div>
                              <Caption className="text-gray-700">{selectedEvent.venue.name}</Caption>
                              <Caption className="text-gray-600">
                                {selectedEvent.venue.address}, {selectedEvent.venue.city}, {selectedEvent.venue.state}
                              </Caption>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <Caption className="text-gray-600">
                              {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </Caption>
                          </div>
                          <Badge variant="outline">{selectedEvent.category}</Badge>
                        </div>
                      </div>
                      <div className="pt-4 border-t-2 border-black">
                        <H3 className="text-base mb-4">
                          ${selectedEvent.price.min} - ${selectedEvent.price.max}
                        </H3>
                        <div className="space-y-2">
                          <Link href={`/events/${selectedEvent.id}`}>
                            <Button fullWidth>View Event</Button>
                          </Link>
                          <Button fullWidth variant="secondary" onClick={() => setSelectedEvent(null)}>
                            Back to List
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {events?.features && events.features.length > 0 ? (
                        events.features.map((event) => (
                          <button
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className="w-full p-3 border-2 border-black hover:bg-gray-50 transition-colors text-left"
                          >
                            <H3 className="text-sm mb-1">{event.name}</H3>
                            <Caption className="text-gray-600">{event.venue.city}, {event.venue.state}</Caption>
                          </button>
                        ))
                      ) : (
                        <Body className="text-gray-600 text-center py-12">
                          No events found in this area
                        </Body>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
