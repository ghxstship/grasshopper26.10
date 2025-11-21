/**
 * Regional Adventures Page - UI Rebuild
 * Browse and book regional tours and experiences
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { SearchBar } from '@/components/ui-rebuild/molecules/SearchBar';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface RegionalAdventure {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  currency: string;
  duration: number;
  capacity: number;
  imageUrl?: string;
  includes: string[];
}


export default function RegionalAdventuresPage() {
  const [adventures, setAdventures] = React.useState<RegionalAdventure[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    const fetchAdventures = async () => {
      try {
        setLoading(true);
        const params: Record<string, string> = { type: 'REGIONAL' };
        if (searchQuery) params.search = searchQuery;
        
        const response = await apiClient.get<{ adventures: RegionalAdventure[] }>('/api/adventures', {
          params,
        });

        if (response.data?.adventures) {
          setAdventures(response.data.adventures);
        }
      } catch (error) {
        console.error('Failed to fetch regional adventures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdventures();
  }, [searchQuery]);

  const formatPrice = (price: number, currency: string) => {
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
          <H1 className="mb-4">Regional Adventures</H1>
          <Body className="text-gray-600">
            Explore unique regional experiences and discover local culture and attractions.
          </Body>
        </div>

        <div className="mb-8">
          <SearchBar
            placeholder="Search regional adventures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            loading={loading}
          />
        </div>

        {adventures.length === 0 ? (
          <Card>
            <CardContent className="py-24 text-center">
              <H3 className="mb-4">No regional adventures available</H3>
              <Body className="text-gray-600">
                Check back soon for new regional experiences.
              </Body>
            </CardContent>
          </Card>
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
                    <Badge>Regional</Badge>
                    <H3>{formatPrice(adventure.price, adventure.currency)}</H3>
                  </div>
                  <CardTitle>{adventure.name}</CardTitle>
                  <CardDescription>in {adventure.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Body className="text-sm mb-4">{adventure.description}</Body>
                  <div className="space-y-2 mb-4">
                    <Caption className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {adventure.duration} minutes
                    </Caption>
                    <Caption className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Max {adventure.capacity} people
                    </Caption>
                  </div>
                  {adventure.includes.length > 0 && (
                    <div>
                      <Caption className="text-gray-500 mb-2">Includes:</Caption>
                      <ul className="space-y-1">
                        {adventure.includes.slice(0, 3).map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-xs">✓</span>
                            <Caption className="text-xs">{item}</Caption>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href={`/adventures/${adventure.id}`} className="w-full">
                    <Button fullWidth>Book Adventure</Button>
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
