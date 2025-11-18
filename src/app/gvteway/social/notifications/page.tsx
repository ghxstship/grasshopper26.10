'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, UserPlus, Bell, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Card, CardContent } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { useNotifications, useMarkNotificationRead } from '@/lib/hooks/shared/useNotifications';

export default function NotificationsPage() {
  const { data: notifications = [], isLoading, error, refetch } = useNotifications();
  const { mutate: markAsRead } = useMarkNotificationRead();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return Heart;
      case 'comment': return MessageCircle;
      case 'follow': return UserPlus;
      default: return Bell;
    }
  };

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading notifications...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  if (error) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Notifications</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="gvteway" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-5xl font-bebas mb-8 gvteway-text-gradient">NOTIFICATIONS</h1>
              
              <div className="space-y-4">
                {notifications.map((notif: any) => {
                  const Icon = getNotificationIcon(notif.type);
                  return (
                    <Card key={notif.id} variant="gvteway" className="bg-gray-900/50 cursor-pointer hover:bg-gray-900/70 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gvteway-red-500/20 rounded-full flex items-center justify-center">
                            <Icon className="w-5 h-5 text-gvteway-red-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white">
                              <span className="font-medium">{notif.actor?.name || 'Someone'}</span> {notif.message || notif.action}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : notif.time}
                            </p>
                          </div>
                          {!notif.read && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => markAsRead(notif.id)}
                              className="text-gvteway-red-500 hover:text-gvteway-red-400"
                            >
                              Mark Read
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
