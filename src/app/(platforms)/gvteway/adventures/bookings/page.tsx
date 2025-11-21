/**
 * My Bookings Page - UI Rebuild
 * View and manage adventure bookings
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui-rebuild/molecules/Tabs';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Booking {
  id: string;
  adventureId: string;
  adventureName: string;
  adventureType: string;
  date: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
  participants: number;
  totalPrice: number;
  currency: string;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ bookings: Booking[] }>('/api/adventures/bookings');
        if (response.data?.bookings) {
          setBookings(response.data.bookings);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'default';
      case 'PENDING': return 'outline';
      case 'CANCELLED': return 'ghost';
      case 'COMPLETED': return 'outline';
      default: return 'ghost';
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
          <H1 className="mb-4">My Adventure Bookings</H1>
          <Body className="text-gray-600">
            View and manage your adventure bookings
          </Body>
        </div>

        <Tabs defaultValue="all" onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="CONFIRMED">Confirmed</TabsTrigger>
            <TabsTrigger value="PENDING">Pending</TabsTrigger>
            <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="mt-8">
            {filteredBookings.length === 0 ? (
              <Card>
                <CardContent className="py-24 text-center">
                  <H3 className="mb-4">No bookings found</H3>
                  <Body className="mb-8 text-gray-600">
                    You haven&apos;t booked any adventures yet.
                  </Body>
                  <Link href="/adventures">
                    <Button>Browse Adventures</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline">{booking.adventureType}</Badge>
                        <Badge variant={getStatusVariant(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <CardTitle>{booking.adventureName}</CardTitle>
                      <CardDescription>
                        Booking ID: {booking.id.slice(0, 8)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <Caption>{formatDate(booking.date)}</Caption>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <Caption>{booking.participants} participants</Caption>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <H3>{formatPrice(booking.totalPrice, booking.currency)}</H3>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Link href={`/adventures/${booking.adventureId}`} className="flex-1">
                        <Button variant="secondary" fullWidth>View Adventure</Button>
                      </Link>
                      {booking.status === 'CONFIRMED' && (
                        <Button variant="ghost" fullWidth>Cancel</Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
