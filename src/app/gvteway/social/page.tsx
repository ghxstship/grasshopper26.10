'use client';

import { DashboardPageTemplate } from '@/components/templates/DashboardPageTemplate';
import { Users, UserPlus, MessageCircle, Bell, TrendingUp, Heart } from 'lucide-react';
import Link from 'next/link';
import { CardTitle, BodyText, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';

const _metadata = {
  title: 'Social Hub | GVTEWAY',
  description: 'Connect with the community, share experiences, and discover new friends',
};

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/social

export default function SocialPage() {
  return (
    <DashboardPageTemplate
      title="Social Hub"
      description="Connect with the community and share your experiences"
      stats={[
        { icon: <Users className="w-8 h-8" />, title: 'Connections', value: '156', href: '/gvteway/social/following' },
        { icon: <UserPlus className="w-8 h-8" />, title: 'Followers', value: '89', href: '/gvteway/social/followers' },
        { icon: <MessageCircle className="w-8 h-8" />, title: 'Messages', value: '12', href: '/gvteway/social/messages' },
        { icon: <Bell className="w-8 h-8" />, title: 'Notifications', value: '5', href: '/gvteway/social/notifications' },
      ]}
      sections={[
        {
          title: 'Quick Actions',
          content: (
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/gvteway/social/profile" className="card p-6 text-center hover:border-ghxst-primary transition-colors">
                <Users className="w-8 h-8 mx-auto mb-3 text-ghxst-primary" />
                <CardTitle className="text-ghxst-primary">My Profile</CardTitle>
              </Link>
              <Link href="/gvteway/social/following" className="card p-6 text-center hover:border-ghxst-primary transition-colors">
                <UserPlus className="w-8 h-8 mx-auto mb-3 text-ghxst-primary" />
                <CardTitle className="text-ghxst-primary">Following</CardTitle>
              </Link>
              <Link href="/gvteway/social/messages" className="card p-6 text-center hover:border-ghxst-primary transition-colors">
                <MessageCircle className="w-8 h-8 mx-auto mb-3 text-ghxst-primary" />
                <CardTitle className="text-ghxst-primary">Messages</CardTitle>
              </Link>
              <Link href="/gvteway/feed" className="card p-6 text-center hover:border-ghxst-primary transition-colors">
                <TrendingUp className="w-8 h-8 mx-auto mb-3 text-ghxst-primary" />
                <CardTitle className="text-ghxst-primary">Feed</CardTitle>
              </Link>
            </div>
          ),
        },
        {
          title: 'Suggested Connections',
          action: { label: 'View All', href: '/gvteway/social/discover' },
          content: (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-6 text-center">
                  <Avatar size="lg" className="mx-auto mb-4" />
                  <CardTitle className="mb-1 text-ghxst-primary">User Name {i}</CardTitle>
                  <Metadata className="text-ghxst-text-secondary mb-4">@username{i}</Metadata>
                  <Button variant="primary" size="sm" className="w-full">Follow</Button>
                </div>
              ))}
            </div>
          ),
        },
      ]}
    />
  );
}
