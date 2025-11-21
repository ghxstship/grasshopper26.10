/**
 * Saved Events Page - UI Rebuild
 * User's saved events and wishlist
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui-rebuild/molecules/Tabs';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { Heart, Calendar, MapPin } from 'lucide-react';

interface SavedEvent {
  id: string;
  event: {
    id: string;
    name: string;
    startDate: string;
    endDate?: string;
    venue: string;
    location: string;
    imageUrl?: string;
    category: string;
  };
  savedAt: string;
  notifyOnSale: boolean;
}

export default function SavedEventsPage() {
  const [loading, setLoading] = React.useState(true);
  const [events, setEvents] = React.useState<SavedEvent[]>([]);
  const [filter, setFilter] = React.useState<'all' | 'upcoming' | 'past'>('all');

  React.useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ events: SavedEvent[] }>('/api/wishlist/saved');
        if (response.data?.events) {
          setEvents(response.data.events);
        }
      } catch (error) {
        console.error('Failed to fetch saved events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedEvents();
  }, []);

  const handleRemove = async (eventId: string) => {
    try {
      await apiClient.delete(`/api/wishlist/${eventId}`);
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (error) {
      console.error('Failed to remove event:', error);
    }
  };

  const handleToggleNotification = async (eventId: string) => {
    try {
      await apiClient.put(`/api/wishlist/${eventId}/notify`);
      setEvents(prev => prev.map(e => 
        e.id === eventId ? { ...e, notifyOnSale: !e.notifyOnSale } : e
      ));
    } catch (error) {
      console.error('Failed to toggle notification:', error);
    }
  };

  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.event.startDate) > now);
  const pastEvents = events.filter(e => new Date(e.event.startDate) <= now);

  const filteredEvents = 
    filter === 'upcoming' ? upcomingEvents :
    filter === 'past' ? pastEvents :
    events;

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
          <H1 className="mb-4">Saved Events</H1>
          <Body className="text-gray-600">
            {events.length} saved events • {upcomingEvents.length} upcoming
          </Body>
        </div>

        {events.length === 0 ? (
          <Card>
            <CardContent className="py-24 text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <H3 className="mb-4">No saved events yet</H3>
              <Body className="text-gray-600 mb-6">
                Save events you&apos;re interested in to keep track of them
              </Body>
              <Link href="/gvteway/events">
                <Button>Browse Events</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs defaultValue="all" value={filter} onValueChange={(value) => setFilter(value as typeof filter)} className="mb-8">
              <TabsList>
                <TabsTrigger value="all">All ({events.length})</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
                <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((saved) => (
                <Card key={saved.id}>
                  {saved.event.imageUrl && (
                    <div className="aspect-video bg-gray-200 border-b-2 border-black">
                      <img
                        src={saved.event.imageUrl}
                        alt={saved.event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline">{saved.event.category}</Badge>
                      {saved.notifyOnSale && (
                        <Badge className="bg-green-600 text-white">
                          Notifications On
                        </Badge>
                      )}
                    </div>
                    <CardTitle>{saved.event.name}</CardTitle>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(saved.event.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span>{saved.event.venue}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Caption className="text-gray-500">
                      Saved {new Date(saved.savedAt).toLocaleDateString()}
                    </Caption>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Link href={`/gvteway/events/${saved.event.id}`} className="flex-1">
                      <Button variant="secondary" size="sm" fullWidth>
                        View Event
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleNotification(saved.id)}
                    >
                      {saved.notifyOnSale ? 'Mute' : 'Notify'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(saved.id)}
                    >
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
