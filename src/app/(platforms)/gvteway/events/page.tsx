/**
 * Events Page - UI Rebuild
 * Event listing with API integration
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { SearchBar } from '@/components/ui-rebuild/molecules/SearchBar';
import { Select } from '@/components/ui-rebuild/atoms/Select';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  venue: string;
  category: string;
  status: string;
  imageUrl?: string;
  ticketsAvailable: number;
}

export default function EventsPage() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');

  // Fetch events from API
  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const params: Record<string, string | number> = { limit: 50 };
        if (searchQuery) params.search = searchQuery;
        if (categoryFilter !== 'all') params.category = categoryFilter;
        if (statusFilter !== 'all') params.status = statusFilter;
        
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
  }, [searchQuery, categoryFilter, statusFilter]);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'MUSIC', label: 'Music' },
    { value: 'SPORTS', label: 'Sports' },
    { value: 'ARTS', label: 'Arts' },
    { value: 'FOOD', label: 'Food & Drink' },
    { value: 'TECH', label: 'Technology' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'UPCOMING', label: 'Upcoming' },
    { value: 'LIVE', label: 'Live Now' },
    { value: 'PAST', label: 'Past' },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <H1 className="mb-4">Discover Events</H1>
          <Body className="text-gray-600">
            Find and book tickets to the best events happening near you.
          </Body>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <SearchBar
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            loading={loading}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              options={categoryOptions}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Spinner size="xl" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24">
            <H3 className="mb-4">No events found</H3>
            <Body className="text-gray-600">
              Try adjusting your search or filters.
            </Body>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event.id}>
                {event.imageUrl && (
                  <div className="aspect-video bg-gray-200 border-b-2 border-black">
                    <img
                      src={event.imageUrl}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline">{event.category}</Badge>
                    <Badge variant={event.status === 'LIVE' ? 'default' : 'ghost'}>
                      {event.status}
                    </Badge>
                  </div>
                  <CardTitle>{event.name}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Caption className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(event.startDate)}
                    </Caption>
                    <Caption className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.venue}
                    </Caption>
                    <Caption className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      {event.ticketsAvailable} tickets available
                    </Caption>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/events/${event.id}`} className="w-full">
                    <Button fullWidth>View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
