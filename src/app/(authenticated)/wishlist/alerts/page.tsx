/**
 * Price Alerts Page - UI Rebuild
 * Manage price drop alerts for events
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { Bell, BellOff } from 'lucide-react';

interface PriceAlert {
  id: string;
  event: {
    id: string;
    name: string;
    startDate: string;
    venue: string;
  };
  targetPrice: number;
  currentPrice: number;
  currency: string;
  active: boolean;
  createdAt: string;
}

export default function PriceAlertsPage() {
  const [loading, setLoading] = React.useState(true);
  const [alerts, setAlerts] = React.useState<PriceAlert[]>([]);
  const [toggling, setToggling] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ alerts: PriceAlert[] }>('/api/wishlist/alerts');
        if (response.data?.alerts) {
          setAlerts(response.data.alerts);
        }
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleToggleAlert = async (alertId: string) => {
    try {
      setToggling(alertId);
      await apiClient.put(`/api/wishlist/alerts/${alertId}/toggle`);
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, active: !alert.active } : alert
      ));
    } catch (error) {
      console.error('Failed to toggle alert:', error);
    } finally {
      setToggling(null);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      await apiClient.delete(`/api/wishlist/alerts/${alertId}`);
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Failed to delete alert:', error);
    }
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
          <H1 className="mb-4">Price Alerts</H1>
          <Body className="text-gray-600">
            Get notified when ticket prices drop for your favorite events
          </Body>
        </div>

        {alerts.length === 0 ? (
          <Card>
            <CardContent className="py-24 text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <H3 className="mb-4">No price alerts set</H3>
              <Body className="text-gray-600 mb-6">
                Set up alerts to get notified when prices drop
              </Body>
              <Link href="/events">
                <Button>Browse Events</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {alert.active ? (
                          <Bell className="w-4 h-4 text-green-600" />
                        ) : (
                          <BellOff className="w-4 h-4 text-gray-400" />
                        )}
                        <Badge variant={alert.active ? 'default' : 'outline'}>
                          {alert.active ? 'Active' : 'Paused'}
                        </Badge>
                        {alert.currentPrice <= alert.targetPrice && (
                          <Badge className="bg-green-600 text-white">
                            Price Met!
                          </Badge>
                        )}
                      </div>
                      <CardTitle>{alert.event.name}</CardTitle>
                      <CardDescription>
                        {new Date(alert.event.startDate).toLocaleDateString()} • {alert.event.venue}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Caption className="text-gray-500 mb-1">Target Price</Caption>
                      <Body className="font-semibold">
                        {formatPrice(alert.targetPrice, alert.currency)}
                      </Body>
                    </div>
                    <div>
                      <Caption className="text-gray-500 mb-1">Current Price</Caption>
                      <Body className={`font-semibold ${
                        alert.currentPrice <= alert.targetPrice ? 'text-green-600' : ''
                      }`}>
                        {formatPrice(alert.currentPrice, alert.currency)}
                      </Body>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleToggleAlert(alert.id)}
                    disabled={toggling === alert.id}
                    className="flex-1"
                  >
                    {alert.active ? 'Pause' : 'Resume'}
                  </Button>
                  <Link href={`/events/${alert.event.id}`} className="flex-1">
                    <Button variant="ghost" size="sm" fullWidth>
                      View Event
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAlert(alert.id)}
                  >
                    Delete
                  </Button>
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
