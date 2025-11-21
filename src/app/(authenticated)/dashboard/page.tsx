/**
 * Dashboard Page - UI Rebuild
 * User dashboard with orders, tickets, and account overview
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H2, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Avatar } from '@/components/ui-rebuild/atoms/Avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui-rebuild/molecules/Tabs';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface Ticket {
  id: string;
  status: string;
  qrCode: string;
  event: {
    id: string;
    name: string;
    startDate: string;
    venue: string;
  };
  ticketType: {
    name: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function DashboardPage() {
  const [user, setUser] = React.useState<User | null>(null);
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get auth token
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const [userResponse, ticketsResponse, ordersResponse] = await Promise.all([
          apiClient.get<User>('/api/profile'),
          apiClient.get<{ tickets: Ticket[] }>('/api/tickets'),
          apiClient.get<{ orders: Order[] }>('/api/orders'),
        ]);

        if (userResponse.data) {
          setUser(userResponse.data);
        }

        if (ticketsResponse.data?.tickets) {
          setTickets(ticketsResponse.data.tickets);
        }

        if (ordersResponse.data?.orders) {
          setOrders(ordersResponse.data.orders);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const upcomingTickets = tickets.filter(
    (ticket) => new Date(ticket.event.startDate) > new Date() && ticket.status === 'VALID'
  );

  const pastTickets = tickets.filter(
    (ticket) => new Date(ticket.event.startDate) <= new Date() || ticket.status !== 'VALID'
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar user={user} />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Header */}
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-6">
            <Avatar
              src={user?.image}
              fallback={user ? getInitials(user.name) : '?'}
              size="xl"
            />
            <div>
              <H1 className="mb-2">Welcome back, {user?.name}</H1>
              <Body className="text-gray-600">{user?.email}</Body>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <Caption className="text-gray-500 mb-2">Upcoming Events</Caption>
                <div className="font-anton text-4xl">{upcomingTickets.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Caption className="text-gray-500 mb-2">Total Orders</Caption>
                <div className="font-anton text-4xl">{orders.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Caption className="text-gray-500 mb-2">Total Tickets</Caption>
                <div className="font-anton text-4xl">{tickets.length}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="tickets">
          <TabsList>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Tickets Tab */}
          <TabsContent value="tickets">
            <div className="space-y-8">
              {/* Upcoming Tickets */}
              <div>
                <H3 className="mb-6">Upcoming Events</H3>
                {upcomingTickets.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Body className="text-gray-600 mb-6">
                        You don&apos;t have any upcoming events
                      </Body>
                      <Link href="/events">
                        <Button>Browse Events</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcomingTickets.map((ticket) => (
                      <Card key={ticket.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <CardTitle>{ticket.event.name}</CardTitle>
                            <Badge>{ticket.ticketType.name}</Badge>
                          </div>
                          <CardDescription>
                            {formatDate(ticket.event.startDate)} • {ticket.event.venue}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <Link href={`/tickets/${ticket.id}`} className="w-full">
                            <Button variant="secondary" fullWidth>
                              View Ticket
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Past Tickets */}
              {pastTickets.length > 0 && (
                <div>
                  <H3 className="mb-6">Past Events</H3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pastTickets.map((ticket) => (
                      <Card key={ticket.id} className="opacity-60">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <CardTitle>{ticket.event.name}</CardTitle>
                            <Badge variant="ghost">{ticket.status}</Badge>
                          </div>
                          <CardDescription>
                            {formatDate(ticket.event.startDate)} • {ticket.event.venue}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <H3 className="mb-6">Order History</H3>
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Body className="text-gray-600 mb-6">
                    You haven&apos;t placed any orders yet
                  </Body>
                  <Link href="/events">
                    <Button>Start Shopping</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>Order #{order.orderNumber}</CardTitle>
                          <CardDescription>
                            {formatDate(order.createdAt)}
                          </CardDescription>
                        </div>
                        <div className="text-right">
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
                          <H3 className="text-gray-400">
                            {formatPrice(order.total, order.currency)}
                          </H3>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                          >
                            <Body className="text-sm">
                              {item.quantity}x {item.name}
                            </Body>
                            <Caption>
                              {formatPrice(item.price * item.quantity, order.currency)}
                            </Caption>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/orders/${order.id}`} className="w-full">
                        <Button variant="secondary" fullWidth>
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <H3 className="mb-6">Account Settings</H3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Caption className="text-gray-500 mb-1">Name</Caption>
                    <Body>{user?.name}</Body>
                  </div>
                  <div>
                    <Caption className="text-gray-500 mb-1">Email</Caption>
                    <Body>{user?.email}</Body>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/profile/edit" className="w-full">
                    <Button variant="secondary" fullWidth>
                      Edit Profile
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your password and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Caption className="text-gray-500 mb-1">Password</Caption>
                    <Body>••••••••</Body>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/profile/security" className="w-full">
                    <Button variant="secondary" fullWidth>
                      Change Password
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
