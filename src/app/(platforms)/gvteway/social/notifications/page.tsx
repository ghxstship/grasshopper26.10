/**
 * Social Notifications Page - UI Rebuild
 * Social activity notifications
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Avatar } from '@/components/ui-rebuild/atoms/Avatar';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  message: string;
  createdAt: string;
  read: boolean;
  actor: { name: string; image?: string };
}

export default function SocialNotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ notifications: Notification[] }>('/api/social/notifications');
        if (response.data?.notifications) {
          setNotifications(response.data.notifications);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'like': return '♥';
      case 'comment': return '💬';
      case 'follow': return '👤';
      case 'mention': return '@';
      default: return '🔔';
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <H1>Notifications</H1>
          <Link href="/settings/notifications">
            <Button variant="ghost" size="sm">Settings</Button>
          </Link>
        </div>

        {notifications.length === 0 ? (
          <Card>
            <CardContent className="py-24 text-center">
              <Body className="text-gray-600">No notifications yet</Body>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card key={notification.id} className={notification.read ? '' : 'border-2 border-black'}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar
                      src={notification.actor.image}
                      fallback={getInitials(notification.actor.name)}
                      size="sm"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Body className="text-sm">
                          <span className="font-bold">{notification.actor.name}</span> {notification.message}
                        </Body>
                        <span className="text-lg">{getTypeIcon(notification.type)}</span>
                      </div>
                      <Caption className="text-gray-500 text-xs">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </Caption>
                    </div>
                    {!notification.read && (
                      <Badge variant="default">New</Badge>
                    )}
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
