/**
 * Adventures Page - UI Rebuild
 * Adventure experiences listing with booking
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

interface Adventure {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  currency: string;
  capacity?: number;
  duration?: number;
  imageUrl?: string;
}

export default function AdventuresPage() {
  const [adventures, setAdventures] = React.useState<Adventure[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');

  React.useEffect(() => {
    const fetchAdventures = async () => {
      try {
        setLoading(true);
        const params: Record<string, string> = {};
        if (searchQuery) params.search = searchQuery;
        if (typeFilter !== 'all') params.type = typeFilter;
        
        const response = await apiClient.get<{ adventures: Adventure[] }>('/api/adventures', {
          params,
        });

        if (response.data?.adventures) {
          setAdventures(response.data.adventures);
        }
      } catch (error) {
        console.error('Failed to fetch adventures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdventures();
  }, [searchQuery, typeFilter]);

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'VIP_EXPERIENCE', label: 'VIP Experience' },
    { value: 'MEET_GREET', label: 'Meet & Greet' },
    { value: 'TOUR', label: 'Tour' },
    { value: 'WORKSHOP', label: 'Workshop' },
    { value: 'BACKSTAGE', label: 'Backstage' },
  ];

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Adventures</H1>
          <Body className="text-gray-600">
            Book exclusive VIP experiences, backstage tours, and unforgettable adventures.
          </Body>
        </div>

        <div className="mb-8 space-y-4">
          <SearchBar
            placeholder="Search adventures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            loading={loading}
          />

          <Select
            options={typeOptions}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Spinner size="xl" />
          </div>
        ) : adventures.length === 0 ? (
          <div className="text-center py-24">
            <H3 className="mb-4">No adventures found</H3>
            <Body className="text-gray-600">
              Try adjusting your search or filters.
            </Body>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {adventures.map((adventure) => (
              <Card key={adventure.id}>
                {adventure.imageUrl && (
                  <div className="aspect-video bg-gray-200 border-b-2 border-black">
                    <img
                      src={adventure.imageUrl}
                      alt={adventure.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline">{adventure.type.replace('_', ' ')}</Badge>
                    <H3>
                      {formatPrice(adventure.price, adventure.currency)}
                    </H3>
                  </div>
                  <CardTitle>{adventure.name}</CardTitle>
                  <CardDescription>{adventure.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {adventure.duration && (
                      <Caption className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDuration(adventure.duration)}
                      </Caption>
                    )}
                    {adventure.capacity && (
                      <Caption className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Max {adventure.capacity} people
                      </Caption>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/adventures/${adventure.id}`} className="w-full">
                    <Button fullWidth>Book Now</Button>
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
