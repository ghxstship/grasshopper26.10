/**
 * Recommendations Page - UI Rebuild
 * Personalized event recommendations
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Hero, H2, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { Sparkles, Calendar, MapPin, TrendingUp, Heart } from 'lucide-react';

interface Recommendation {
  id: string;
  name: string;
  description: string;
  venue: { name: string; city: string; state: string };
  date: string;
  matchScore: number;
  matchReasons: string[];
  category: string;
  price: { min: number; max: number };
  imageUrl?: string;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = React.useState<Recommendation[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ data: { recommendations: Recommendation[] } }>('/api/analytics/recommendations');
        if (response.data?.data?.recommendations) {
          setRecommendations(response.data.data.recommendations);
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

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
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-12 h-12" />
              <Hero>RECOMMENDED FOR YOU</Hero>
            </div>
            <Body className="max-w-2xl mx-auto text-gray-700 text-xl">
              Discover events tailored to your interests and past activity.
            </Body>
          </div>
        </div>
      </section>

      {/* Recommendations Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {recommendations.length === 0 ? (
            <Card>
              <CardContent className="py-24 text-center">
                <Heart className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                <H3 className="mb-4">No Recommendations Yet</H3>
                <Body className="text-gray-600 mb-8">
                  Attend more events to get personalized recommendations based on your preferences.
                </Body>
                <Link href="/events">
                  <Button>Browse Events</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-8">
                <H2>{recommendations.length} Events Recommended</H2>
                <Body className="text-gray-600 mt-2">
                  Based on your activity and preferences
                </Body>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.map((event) => (
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
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {event.matchScore}% Match
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
                            day: 'numeric'
                          })}</Caption>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4" />
                          <Caption>{event.venue.name} • {event.venue.city}</Caption>
                        </div>
                        
                        {event.matchReasons && event.matchReasons.length > 0 && (
                          <div className="pt-3 border-t-2 border-gray-100">
                            <Caption className="text-gray-600 font-medium mb-2">Why we recommend this:</Caption>
                            <ul className="space-y-1">
                              {event.matchReasons.slice(0, 2).map((reason, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-green-600 mt-0.5">•</span>
                                  <Caption className="text-gray-600">{reason}</Caption>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

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
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="border-t-4 border-black bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <H2 className="mb-4">How Recommendations Work</H2>
            <Body className="max-w-2xl mx-auto text-gray-600">
              We analyze your event history, preferences, and engagement to suggest events you&apos;ll love.
            </Body>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">🎭</div>
                <H3 className="mb-3">Your Interests</H3>
                <Body className="text-gray-600">
                  Based on the types of events you&apos;ve attended and enjoyed.
                </Body>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">📈</div>
                <H3 className="mb-3">Trending Events</H3>
                <Body className="text-gray-600">
                  Popular events among users with similar tastes.
                </Body>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <H3 className="mb-3">Perfect Timing</H3>
                <Body className="text-gray-600">
                  Events happening at times and locations convenient for you.
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
