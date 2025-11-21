/**
 * Order Detail Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Hero, H1, H2, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
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

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<Order>(`/api/orders/${params.id}`);
        if (response.data) {
          setOrder(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

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

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <H2 className="mb-4">Order Not Found</H2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Badge className="mb-4">{order.status}</Badge>
          <Hero className="mb-2">Order #{order.orderNumber}</Hero>
          <Caption className="text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </Caption>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <H3>{item.name}</H3>
                    <Caption className="text-gray-500">Quantity: {item.quantity}</Caption>
                  </div>
                  <Body>{formatPrice(item.price * item.quantity, order.currency)}</Body>
                </div>
                <Separator className="mt-4" />
              </div>
            ))}

            <div className="pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <Caption>Subtotal</Caption>
                <Caption>{formatPrice(order.subtotal, order.currency)}</Caption>
              </div>
              <div className="flex items-center justify-between">
                <Caption>Tax</Caption>
                <Caption>{formatPrice(order.tax, order.currency)}</Caption>
              </div>
              <div className="flex items-center justify-between">
                <Caption>Fees</Caption>
                <Caption>{formatPrice(order.fees, order.currency)}</Caption>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <H2>Total</H2>
                <H2>
                  {formatPrice(order.total, order.currency)}
                </H2>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="secondary">Download Receipt</Button>
          {order.status === 'PENDING' && (
            <Button variant="ghost">Cancel Order</Button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
