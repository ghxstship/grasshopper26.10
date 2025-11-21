/**
 * Recommendations Page - UI Rebuild
 * Personalized event and experience recommendations
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Recommendation {
  id: string;
  type: 'EVENT' | 'ADVENTURE' | 'PRODUCT';
  title: string;
  description: string;
  reason: string;
  imageUrl?: string;
  price?: number;
  currency?: string;
  link: string;
}


export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = React.useState<Recommendation[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ recommendations: Recommendation[] }>('/api/analytics/recommendations');
        if (response.data?.recommendations) {
          setRecommendations(response.data.recommendations);
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EVENT': return 'bg-blue-100 text-blue-900';
      case 'ADVENTURE': return 'bg-green-100 text-green-900';
      case 'PRODUCT': return 'bg-purple-100 text-purple-900';
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
          <H1 className="mb-4">Recommended for You</H1>
          <Body className="text-gray-600">
            Personalized recommendations based on your interests and activity
          </Body>
        </div>

        {recommendations.length === 0 ? (
          <Card>
            <CardContent className="py-24 text-center">
              <H3 className="mb-4">No recommendations yet</H3>
              <Body className="text-gray-600">
                Explore events and experiences to get personalized recommendations.
              </Body>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations.map((rec) => (
              <Card key={rec.id}>
                {rec.imageUrl && (
                  <div className="aspect-video bg-gray-200 border-b-2 border-black">
                    <img
                      src={rec.imageUrl}
                      alt={rec.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getTypeColor(rec.type)}>
                      {rec.type}
                    </Badge>
                    {rec.price && rec.currency && (
                      <H3>{formatPrice(rec.price, rec.currency)}</H3>
                    )}
                  </div>
                  <CardTitle>{rec.title}</CardTitle>
                  <CardDescription>{rec.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 border-2 border-black p-3 mb-4">
                    <Caption className="text-sm">
                      <span className="font-semibold">Why we recommend:</span> {rec.reason}
                    </Caption>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={rec.link} className="w-full">
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
