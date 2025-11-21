/**
 * Events Page - UI Rebuild
 * Discover and browse events
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui-rebuild/molecules/Tabs';
import { apiClient } from '@/lib/api/client';
import { Calendar, MapPin, Search, Filter } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  venue: { name: string; city: string; state: string };
  category: string;
  price: { min: number; max: number };
  imageUrl?: string;
  status: 'on_sale' | 'sold_out' | 'coming_soon';
}

export default function EventsPage() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ success: boolean; data: { events: Event[] } }>('/api/events');
        if (response.data?.data?.events) {
          setEvents(response.data.data.events);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categories = [
    { id: 'all', label: 'All Events' },
    { id: 'music', label: 'Music' },
    { id: 'sports', label: 'Sports' },
    { id: 'arts', label: 'Arts & Theater' },
    { id: 'comedy', label: 'Comedy' },
    { id: 'family', label: 'Family' },
  ];

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <Hero>DISCOVER EVENTS</Hero>
            <Body className="max-w-2xl mx-auto text-gray-700 text-xl">
              Find and book tickets to the best events happening near you.
            </Body>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search events, artists, or venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/events/calendar">
                <Button variant="secondary">
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendar View
                </Button>
              </Link>
              <Link href="/events/map">
                <Button variant="secondary">
                  <MapPin className="w-4 h-4 mr-2" />
                  Map View
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="border-b-4 border-black bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} defaultValue="all">
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <H2>{filteredEvents.length} Events Found</H2>
            <Button variant="secondary" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="py-24 text-center">
                <H3 className="mb-4">No Events Found</H3>
                <Body className="text-gray-600">Try adjusting your search or filters</Body>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="h-full hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer">
                    {event.imageUrl && (
                      <div className="aspect-video bg-gray-100 border-b-4 border-black overflow-hidden">
                        <img 
                          src={event.imageUrl} 
                          alt={event.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant={event.status === 'on_sale' ? 'default' : 'outline'}>
                          {event.status === 'on_sale' ? 'On Sale' :
                           event.status === 'sold_out' ? 'Sold Out' : 'Coming Soon'}
                        </Badge>
                        <Badge variant="outline">{event.category}</Badge>
                      </div>
                      <CardTitle>{event.name}</CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4" />
                        <Caption>{new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}</Caption>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4" />
                        <Caption>{event.venue.name} • {event.venue.city}, {event.venue.state}</Caption>
                      </div>
                      <div className="pt-3 border-t-2 border-black">
                        <H3 className="text-base">
                          ${event.price.min} - ${event.price.max}
                        </H3>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button fullWidth disabled={event.status === 'sold_out'}>
                        {event.status === 'sold_out' ? 'Sold Out' : 'Get Tickets'}
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}