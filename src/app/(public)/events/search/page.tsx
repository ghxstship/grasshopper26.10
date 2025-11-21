/**
 * Events Search Page - UI Rebuild
 * Advanced event search with filters and sorting
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
import { Search, Filter, Calendar, MapPin, SlidersHorizontal } from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  description: string;
  venue: { name: string; city: string; state: string };
  date: string;
  category: string;
  price: { min: number; max: number };
  imageUrl?: string;
}

export default function EventsSearchPage() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({
    category: '',
    priceRange: '',
    dateRange: '',
    location: '',
  });
  const [sortBy, setSortBy] = React.useState('relevance');

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      const params = new URLSearchParams({
        q: query,
        ...(filters.category && { category: filters.category }),
        ...(filters.priceRange && { priceRange: filters.priceRange }),
        ...(filters.dateRange && { dateRange: filters.dateRange }),
        ...(filters.location && { location: filters.location }),
        sort: sortBy,
      });
      
      const response = await apiClient.get<{ data: { events: SearchResult[] } }>(`/api/events/search?${params}`);
      if (response.data?.data?.events) {
        setResults(response.data.data.events);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b-4 border-black bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Search className="w-12 h-12" />
              <Hero>SEARCH EVENTS</Hero>
            </div>
            <Body className="max-w-2xl mx-auto text-gray-700 text-xl">
              Find your perfect event with advanced search and filters.
            </Body>
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by event name, artist, venue, or keyword..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-12"
                  />
                </div>
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      {showFilters && (
        <section className="border-b-4 border-black bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Caption className="mb-2 font-medium">Category</Caption>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-black bg-white font-share-tech"
                >
                  <option value="">All Categories</option>
                  <option value="music">Music</option>
                  <option value="sports">Sports</option>
                  <option value="arts">Arts & Theater</option>
                  <option value="comedy">Comedy</option>
                  <option value="family">Family</option>
                </select>
              </div>
              <div>
                <Caption className="mb-2 font-medium">Price Range</Caption>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-black bg-white font-share-tech"
                >
                  <option value="">Any Price</option>
                  <option value="0-50">Under $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100-200">$100 - $200</option>
                  <option value="200+">$200+</option>
                </select>
              </div>
              <div>
                <Caption className="mb-2 font-medium">Date Range</Caption>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-black bg-white font-share-tech"
                >
                  <option value="">Any Date</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              <div>
                <Caption className="mb-2 font-medium">Location</Caption>
                <Input
                  type="text"
                  placeholder="City or ZIP"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button onClick={handleSearch}>
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
              <Button
                variant="secondary"
                onClick={() => setFilters({ category: '', priceRange: '', dateRange: '', location: '' })}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Spinner size="xl" />
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <H2>{results.length} Results Found</H2>
                <div className="flex items-center gap-3">
                  <Caption className="text-gray-600">Sort by:</Caption>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border-2 border-black bg-white font-share-tech"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="date">Date</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((event) => (
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
                            day: 'numeric'
                          })}</Caption>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4" />
                          <Caption>{event.venue.name} • {event.venue.city}</Caption>
                        </div>
                        <div className="pt-3 border-t-2 border-black">
                          <H3 className="text-base">
                            ${event.price.min} - ${event.price.max}
                          </H3>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button fullWidth>View Event</Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          ) : query ? (
            <Card>
              <CardContent className="py-24 text-center">
                <Search className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                <H3 className="mb-4">No Results Found</H3>
                <Body className="text-gray-600 mb-8">
                  Try adjusting your search terms or filters to find what you&apos;re looking for.
                </Body>
                <Button onClick={() => { setQuery(''); setResults([]); }}>
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-24 text-center">
                <Search className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                <H3 className="mb-4">Start Your Search</H3>
                <Body className="text-gray-600">
                  Enter keywords above to find events that match your interests.
                </Body>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
