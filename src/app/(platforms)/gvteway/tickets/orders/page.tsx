/**
 * Order History Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, H3, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  orderNumber: string;
  eventName: string;
  eventDate: string;
  quantity: number;
  total: number;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  createdAt: string;
}

export default function OrderHistoryPage() {
  const [loading, setLoading] = React.useState(true);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ orders: Order[] }>('/api/tickets/orders');
        if (response.data?.orders) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: Order['status']): 'default' | 'outline' | 'ghost' => {
    switch (status) {
      case 'COMPLETED':
        return 'default';
      case 'PENDING':
        return 'outline';
      case 'CANCELLED':
        return 'ghost';
      default:
        return 'default';
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
          <H1 className="mb-4">Order History</H1>
          <Body className="text-gray-600">
            View all your ticket purchases
          </Body>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-24 text-center">
              <Body className="text-gray-600 mb-6">
                You haven&apos;t made any purchases yet
              </Body>
              <Button onClick={() => router.push('/events')}>
                Browse Events
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle>{order.eventName}</CardTitle>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        Order #{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => router.push(`/tickets/orders/${order.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Body className="text-gray-600 text-sm">Event Date</Body>
                      <Body>{new Date(order.eventDate).toLocaleDateString()}</Body>
                    </div>
                    <div>
                      <Body className="text-gray-600 text-sm">Quantity</Body>
                      <Body>{order.quantity} tickets</Body>
                    </div>
                    <div>
                      <Body className="text-gray-600 text-sm">Total</Body>
                      <H3>${order.total.toFixed(2)}</H3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
