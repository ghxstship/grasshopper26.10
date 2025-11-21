/**
 * Search Events Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, H2, Body, Label } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { Search, Filter } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  price: number;
  category: string;
  image?: string;
}

export default function SearchEventsPage() {
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<Event[]>([]);
  const [filters, setFilters] = React.useState({
    category: '',
    dateFrom: '',
    dateTo: '',
    priceMin: '',
    priceMax: '',
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.get<{ events: Event[] }>('/api/events/search', {
        params: { q: query, ...filters }
      });
      if (response.data?.events) {
        setResults(response.data.events);
      }
    } catch (error) {
      console.error('Failed to search events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Search Events</H1>
          <Body className="text-gray-600">
            Find the perfect event for you
          </Body>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search events, artists, venues..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" loading={loading}>
              Search
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                <CardTitle>Filters</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>
                    Category
                  </Label>
                  <Input
                    type="text"
                    placeholder="All categories"
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  />
                </div>
                <div>
                  <Label>
                    Date From
                  </Label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  />
                </div>
                <div>
                  <Label>
                    Date To
                  </Label>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  />
                </div>
                <div>
                  <Label>
                    Price Range
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>

        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size="xl" />
          </div>
        ) : results.length > 0 ? (
          <div>
            <Body className="text-gray-600 mb-6">
              Found {results.length} events
            </Body>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((event) => (
                <Card key={event.id}>
                  {event.image && (
                    <div className="aspect-video bg-gray-100">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    <Badge>{event.category}</Badge>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>
                      {event.venue} • {new Date(event.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <H2>
                        ${event.price}
                      </H2>
                      <Button>View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : query ? (
          <Card>
            <CardContent className="py-24 text-center">
              <Body className="text-gray-600">
                No events found. Try adjusting your search or filters.
              </Body>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <Footer />
    </div>
  );
}
