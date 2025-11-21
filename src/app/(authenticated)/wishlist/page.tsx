/**
 * Wishlist Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H3, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface WishlistItem {
  id: string;
  event: {
    id: string;
    name: string;
    startDate: string;
    venue: string;
  };
}

export default function WishlistPage() {
  const [items, setItems] = React.useState<WishlistItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ items: WishlistItem[] }>('/api/wishlist');
        if (response.data?.items) {
          setItems(response.data.items);
        }
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Wishlist</H1>
          <Body className="text-gray-600">{items.length} saved events</Body>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="py-24 text-center">
              <H3 className="mb-4">Your wishlist is empty</H3>
              <Body className="mb-8 text-gray-600">Save events to keep track of them</Body>
              <Link href="/(rebuild)/events">
                <Button>Browse Events</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.event.name}</CardTitle>
                  <CardDescription>
                    {new Date(item.event.startDate).toLocaleDateString()} • {item.event.venue}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex gap-3">
                  <Link href={`/(rebuild)/events/${item.event.id}`} className="flex-1">
                    <Button fullWidth>View Event</Button>
                  </Link>
                  <Button variant="ghost">Remove</Button>
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
