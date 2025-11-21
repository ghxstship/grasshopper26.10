/**
 * Premium Experiences Page - UI Rebuild
 * Exclusive premium experiences and packages
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H2, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { SearchBar } from '@/components/ui-rebuild/molecules/SearchBar';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface PremiumExperience {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  tier: 'GOLD' | 'PLATINUM' | 'DIAMOND';
  includes: string[];
  imageUrl?: string;
  available: boolean;
}


export default function PremiumExperiencesPage() {
  const [experiences, setExperiences] = React.useState<PremiumExperience[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const params: Record<string, string> = { type: 'PREMIUM' };
        if (searchQuery) params.search = searchQuery;
        
        const response = await apiClient.get<{ adventures: PremiumExperience[] }>('/api/adventures', {
          params,
        });

        if (response.data?.adventures) {
          setExperiences(response.data.adventures);
        }
      } catch (error) {
        console.error('Failed to fetch premium experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [searchQuery]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'DIAMOND': return 'bg-blue-100 text-blue-900';
      case 'PLATINUM': return 'bg-gray-100 text-gray-900';
      case 'GOLD': return 'bg-yellow-100 text-yellow-900';
      default: return 'bg-gray-100 text-gray-900';
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Premium Experiences</H1>
          <Body className="text-gray-600">
            Exclusive premium experiences with unparalleled access and luxury.
          </Body>
        </div>

        <div className="mb-8">
          <SearchBar
            placeholder="Search premium experiences..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            loading={loading}
          />
        </div>

        {experiences.length === 0 ? (
          <Card>
            <CardContent className="py-24 text-center">
              <H3 className="mb-4">No premium experiences available</H3>
              <Body className="text-gray-600">
                Check back soon for exclusive premium packages.
              </Body>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((experience) => (
              <Card key={experience.id} className="border-4">
                {experience.imageUrl && (
                  <div className="aspect-video bg-gray-200 border-b-4 border-black">
                    <img
                      src={experience.imageUrl}
                      alt={experience.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getTierColor(experience.tier)}>
                      {experience.tier}
                    </Badge>
                    <Badge variant={experience.available ? 'default' : 'ghost'}>
                      {experience.available ? 'Available' : 'Sold Out'}
                    </Badge>
                  </div>
                  <CardTitle>{experience.name}</CardTitle>
                  <CardDescription>{experience.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <H2>{formatPrice(experience.price, experience.currency)}</H2>
                  </div>
                  {experience.includes.length > 0 && (
                    <div>
                      <Caption className="text-gray-500 mb-2 font-semibold">Includes:</Caption>
                      <ul className="space-y-2">
                        {experience.includes.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-sm mt-0.5">✓</span>
                            <Caption className="text-sm">{item}</Caption>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href={`/adventures/${experience.id}`} className="w-full">
                    <Button fullWidth disabled={!experience.available}>
                      {experience.available ? 'Book Premium Experience' : 'Sold Out'}
                    </Button>
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
