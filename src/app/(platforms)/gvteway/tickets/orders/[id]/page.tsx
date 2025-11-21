/**
 * Order Details Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, H2, H3, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { apiClient } from '@/lib/api/client';
import { useParams } from 'next/navigation';
import { Download, Mail } from 'lucide-react';

interface OrderDetails {
  id: string;
  orderNumber: string;
  eventName: string;
  eventDate: string;
  venue: string;
  tickets: Array<{
    id: string;
    type: string;
    section: string;
    row: string;
    seat: string;
    price: number;
  }>;
  subtotal: number;
  fees: number;
  total: number;
  status: string;
  createdAt: string;
  email: string;
}

export default function OrderDetailsPage() {
  const [loading, setLoading] = React.useState(true);
  const [order, setOrder] = React.useState<OrderDetails | null>(null);
  const params = useParams();

  React.useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ order: OrderDetails }>(`/api/tickets/orders/${params.id}`);
        if (response.data?.order) {
          setOrder(response.data.order);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <H1 className="mb-4">Order Not Found</H1>
          <Body className="text-gray-600">The order you are looking for does not exist.</Body>
        </div>
        
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <H1>Order Details</H1>
            <Badge>{order.status}</Badge>
          </div>
          <Body className="text-gray-600">
            Order #{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString()}
          </Body>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Body className="text-gray-600 text-sm">Event</Body>
                  <H3>{order.eventName}</H3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Body className="text-gray-600 text-sm">Date</Body>
                    <Body>{new Date(order.eventDate).toLocaleDateString()}</Body>
                  </div>
                  <div>
                    <Body className="text-gray-600 text-sm">Venue</Body>
                    <Body>{order.venue}</Body>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tickets ({order.tickets.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.tickets.map((ticket) => (
                    <div key={ticket.id} className="pb-4 border-b border-gray-200 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <H3>{ticket.type}</H3>
                        <H3>${ticket.price.toFixed(2)}</H3>
                      </div>
                      <Body className="text-gray-600 text-sm">
                        Section {ticket.section} • Row {ticket.row} • Seat {ticket.seat}
                      </Body>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <Body className="text-gray-600">Subtotal</Body>
                  <Body>${order.subtotal.toFixed(2)}</Body>
                </div>
                <div className="flex justify-between">
                  <Body className="text-gray-600">Service Fee</Body>
                  <Body>${order.fees.toFixed(2)}</Body>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <H2>Total</H2>
                  <H2>${order.total.toFixed(2)}</H2>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="ghost">
                  <Download className="w-4 h-4 mr-2" />
                  Download Tickets
                </Button>
                <Button className="w-full" variant="ghost">
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Confirmation
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <Body className="text-gray-600 text-sm mb-2">Confirmation sent to:</Body>
                <Body>{order.email}</Body>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      
    </div>
  );
}
