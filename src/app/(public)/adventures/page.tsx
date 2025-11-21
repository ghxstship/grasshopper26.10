/**
 * Adventures Page - UI Rebuild
 * VIP Adventures and Exclusive Experiences
 */

'use client';

import * as React from 'react';
import { Hero, H2, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui-rebuild/molecules/Tabs';
import { apiClient } from '@/lib/api/client';
import { MapPin, Clock, Users, Star } from 'lucide-react';

interface Adventure {
  id: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  capacity: number;
  price: number;
  rating: number;
  reviewCount: number;
  category: string;
  imageUrl?: string;
  availability: 'available' | 'limited' | 'sold_out';
}

export default function AdventuresPage() {
  const [adventures, setAdventures] = React.useState<Adventure[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  React.useEffect(() => {
    const fetchAdventures = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ success: boolean; data: { adventures: Adventure[] } }>('/api/adventures');
        if (response.data?.data?.adventures) {
          setAdventures(response.data.data.adventures);
        }
      } catch (error) {
        console.error('Failed to fetch adventures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdventures();
  }, []);

  const categories = [
    { id: 'all', label: 'All Adventures' },
    { id: 'vip', label: 'VIP Experiences' },
    { id: 'backstage', label: 'Backstage Tours' },
    { id: 'meet-greet', label: 'Meet & Greet' },
    { id: 'exclusive', label: 'Exclusive Access' },
  ];

  const filteredAdventures = selectedCategory === 'all' 
    ? adventures 
    : adventures.filter(a => a.category === selectedCategory);

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
            <Hero>VIP ADVENTURES</Hero>
            <Body className="max-w-2xl mx-auto text-gray-700 text-xl">
              Unlock exclusive experiences, backstage access, and unforgettable moments with our curated VIP adventures.
            </Body>
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

      {/* Adventures Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredAdventures.length === 0 ? (
            <Card>
              <CardContent className="py-24 text-center">
                <H3 className="mb-4">No Adventures Available</H3>
                <Body className="text-gray-600">Check back soon for new VIP experiences</Body>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAdventures.map((adventure) => (
                <Card 
                  key={adventure.id}
                  className="hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                >
                  {adventure.imageUrl && (
                    <div className="aspect-video bg-gray-100 border-b-4 border-black overflow-hidden">
                      <img 
                        src={adventure.imageUrl} 
                        alt={adventure.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <Badge 
                        variant={
                          adventure.availability === 'available' ? 'default' :
                          adventure.availability === 'limited' ? 'outline' : 'outline'
                        }
                      >
                        {adventure.availability === 'available' ? 'Available' :
                         adventure.availability === 'limited' ? 'Limited' : 'Sold Out'}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-black" />
                        <Caption className="font-bold">{adventure.rating}</Caption>
                        <Caption className="text-gray-500">({adventure.reviewCount})</Caption>
                      </div>
                    </div>
                    <CardTitle>{adventure.title}</CardTitle>
                    <CardDescription>{adventure.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4" />
                      <Caption>{adventure.location}</Caption>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4" />
                      <Caption>{adventure.duration}</Caption>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-4 h-4" />
                      <Caption>Max {adventure.capacity} guests</Caption>
                    </div>
                    <div className="pt-3 border-t-2 border-black">
                      <H2>${adventure.price.toLocaleString()}</H2>
                      <Caption className="text-gray-600">per person</Caption>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      fullWidth
                      disabled={adventure.availability === 'sold_out'}
                    >
                      {adventure.availability === 'sold_out' ? 'Sold Out' : 'Book Now'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t-4 border-black bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <H2 className="mb-4">Why Book VIP Adventures?</H2>
            <Body className="max-w-2xl mx-auto text-gray-600">
              Experience events like never before with exclusive access and premium perks.
            </Body>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">🎭</div>
                <H3 className="mb-3">Exclusive Access</H3>
                <Body className="text-gray-600">
                  Get behind-the-scenes access to venues, artists, and experiences not available to general admission.
                </Body>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">⭐</div>
                <H3 className="mb-3">Premium Service</H3>
                <Body className="text-gray-600">
                  Enjoy dedicated concierge service, priority entry, and premium amenities throughout your experience.
                </Body>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">📸</div>
                <H3 className="mb-3">Memorable Moments</H3>
                <Body className="text-gray-600">
                  Create unforgettable memories with meet & greets, photo opportunities, and exclusive merchandise.
                </Body>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}