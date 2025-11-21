/**
 * Adventure Detail Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Hero, H2, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Separator } from '@/components/ui-rebuild/atoms/Separator';
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
  duration?: number;
  capacity?: number;
  requirements?: string[];
}

export default function AdventureDetailPage() {
  const params = useParams();
  const [adventure, setAdventure] = React.useState<Adventure | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAdventure = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<Adventure>(`/api/adventures/${params.id}`);
        if (response.data) {
          setAdventure(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch adventure:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdventure();
  }, [params.id]);

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

  if (!adventure) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <H2 className="mb-4">Adventure Not Found</H2>
          <Body className="text-gray-600">The adventure you are looking for does not exist.</Body>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Badge className="mb-4">{adventure.type}</Badge>
            <Hero className="mb-6">{adventure.name}</Hero>
            <Body className="text-gray-700 text-lg mb-8">{adventure.description}</Body>
            
            {adventure.requirements && adventure.requirements.length > 0 && (
              <>
                <Separator className="my-8" />
                <H2 className="mb-4">Requirements</H2>
                <ul className="space-y-2">
                  {adventure.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-xl">•</span>
                      <Body>{req}</Body>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Book This Adventure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Caption className="text-gray-500 mb-1">Price</Caption>
                  <H2>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: adventure.currency,
                    }).format(adventure.price)}
                  </H2>
                </div>
                {adventure.duration && (
                  <>
                    <Separator />
                    <div>
                      <Caption className="text-gray-500 mb-1">Duration</Caption>
                      <Body>{adventure.duration} minutes</Body>
                    </div>
                  </>
                )}
                {adventure.capacity && (
                  <>
                    <Separator />
                    <div>
                      <Caption className="text-gray-500 mb-1">Max Capacity</Caption>
                      <Body>{adventure.capacity} people</Body>
                    </div>
                  </>
                )}
              </CardContent>
              <CardContent>
                <Button fullWidth size="lg">Book Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
