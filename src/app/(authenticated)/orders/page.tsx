/**
 * Orders Page - UI Rebuild
 * User's order history
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H2, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Separator } from '@/components/ui-rebuild/atoms/Separator';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  fees: number;
  total: number;
  currency: string;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
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

        const response = await apiClient.get<{ orders: Order[] }>('/api/orders');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
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
            View and track all your orders.
          </Body>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-24 text-center">
              <H3 className="mb-4">No orders yet</H3>
              <Body className="mb-8 text-gray-600">
                You haven&apos;t placed any orders yet.
              </Body>
              <Link href="/(rebuild)/events">
                <Button>Browse Events</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <CardTitle>Order #{order.orderNumber}</CardTitle>
                      <CardDescription>
                        Placed on {formatDate(order.createdAt)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={
                          order.status === 'COMPLETED'
                            ? 'default'
                            : order.status === 'PENDING'
                            ? 'outline'
                            : 'ghost'
                        }
                      >
                        {order.status}
                      </Badge>
                      <div className="text-right">
                        <Caption className="text-gray-500">Total</Caption>
                        <H2>
                          {formatPrice(order.total, order.currency)}
                        </H2>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <H3>
                              {item.name}
                            </H3>
                            <Caption className="text-gray-500">
                              Quantity: {item.quantity}
                            </Caption>
                          </div>
                          <Body className="text-sm">
                            {formatPrice(item.price * item.quantity, order.currency)}
                          </Body>
                        </div>
                        <Separator className="mt-3" />
                      </div>
                    ))}

                    <div className="pt-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <Caption>Subtotal</Caption>
                        <Caption>{formatPrice(order.subtotal, order.currency)}</Caption>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <Caption>Tax</Caption>
                        <Caption>{formatPrice(order.tax, order.currency)}</Caption>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <Caption>Fees</Caption>
                        <Caption>{formatPrice(order.fees, order.currency)}</Caption>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <H3>Total</H3>
                        <H3>
                          {formatPrice(order.total, order.currency)}
                        </H3>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Link href={`/(rebuild)/orders/${order.id}`} className="w-full">
                    <Button variant="secondary" fullWidth>
                      View Details
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
