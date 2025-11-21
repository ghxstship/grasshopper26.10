/**
 * Orders Page - UI Rebuild
 * View and track marketplace orders
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui-rebuild/molecules/Tabs';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: number;
  total: number;
  currency: string;
}


export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ orders: Order[] }>('/api/marketplace/orders');
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

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'default';
      case 'SHIPPED': return 'default';
      case 'PROCESSING': return 'ghost';
      case 'PENDING': return 'ghost';
      case 'CANCELLED': return 'ghost';
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
          <H1 className="mb-4">My Orders</H1>
          <Body className="text-gray-600">
            Track and manage your marketplace orders
          </Body>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-24 text-center">
                  <H3 className="mb-4">No orders yet</H3>
                  <Body className="mb-8 text-gray-600">
                    Start shopping to see your orders here.
                  </Body>
                  <Link href="/marketplace">
                    <Button>Browse Marketplace</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle>Order #{order.orderNumber}</CardTitle>
                            <Badge variant={getStatusVariant(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                          <CardDescription>
                            {new Date(order.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })} • {order.items} {order.items === 1 ? 'item' : 'items'}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <H3>{formatPrice(order.total, order.currency)}</H3>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm">View Details</Button>
                        {order.status === 'SHIPPED' && (
                          <Button variant="ghost" size="sm">Track Package</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active">
            <Body className="text-center py-12 text-gray-600">Filter active orders</Body>
          </TabsContent>

          <TabsContent value="delivered">
            <Body className="text-center py-12 text-gray-600">Filter delivered orders</Body>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
