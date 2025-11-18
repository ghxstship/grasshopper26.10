#!/bin/bash

# Batch convert remaining pages to GHXSTSHIP templates
# This script creates standardized pages using our templates

echo "Starting batch conversion of remaining pages..."

# Social pages
cat > src/app/gvteway/social/followers/page.tsx << 'EOF'
'use client';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { UserPlus } from 'lucide-react';
import { CardTitle, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';

export default function FollowersPage() {
  const followers = [{ id: '1', name: 'User 1', username: '@user1' }];
  return (
    <ListPageTemplate title="Followers" description="People following you">
      <div className="grid md:grid-cols-3 gap-6">
        {followers.map((user) => (
          <div key={user.id} className="card p-6 text-center">
            <Avatar size="lg" className="mx-auto mb-4" />
            <CardTitle className="mb-1 text-ghxst-primary">{user.name}</CardTitle>
            <Metadata className="text-ghxst-text-secondary mb-4">{user.username}</Metadata>
            <Button variant="primary" size="sm" className="w-full">Follow Back</Button>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
EOF

cat > src/app/gvteway/social/following/page.tsx << 'EOF'
'use client';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { UserMinus } from 'lucide-react';
import { CardTitle, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';

export default function FollowingPage() {
  const following = [{ id: '1', name: 'User 1', username: '@user1' }];
  return (
    <ListPageTemplate title="Following" description="People you follow">
      <div className="grid md:grid-cols-3 gap-6">
        {following.map((user) => (
          <div key={user.id} className="card p-6 text-center">
            <Avatar size="lg" className="mx-auto mb-4" />
            <CardTitle className="mb-1 text-ghxst-primary">{user.name}</CardTitle>
            <Metadata className="text-ghxst-text-secondary mb-4">{user.username}</Metadata>
            <Button variant="secondary" size="sm" className="w-full">Unfollow</Button>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
EOF

cat > src/app/gvteway/social/messages/page.tsx << 'EOF'
'use client';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { MessageCircle } from 'lucide-react';
import { CardTitle, Metadata } from '@/components/atoms/Typography';
import { Avatar } from '@/components/atoms/Avatar';

export default function MessagesPage() {
  const messages = [{ id: '1', name: 'User 1', lastMessage: 'Hey!', time: '2h ago' }];
  return (
    <ListPageTemplate title="Messages" description="Your conversations">
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="card p-4 flex items-center gap-4 hover:border-ghxst-primary cursor-pointer">
            <Avatar size="md" />
            <div className="flex-1">
              <CardTitle className="text-ghxst-primary">{msg.name}</CardTitle>
              <Metadata className="text-ghxst-text-secondary">{msg.lastMessage}</Metadata>
            </div>
            <Metadata className="text-ghxst-text-secondary">{msg.time}</Metadata>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
EOF

cat > src/app/gvteway/social/notifications/page.tsx << 'EOF'
'use client';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { Bell } from 'lucide-react';
import { BodyText, Metadata } from '@/components/atoms/Typography';

export default function NotificationsPage() {
  const notifications = [{ id: '1', text: 'User 1 followed you', time: '2h ago' }];
  return (
    <ListPageTemplate title="Notifications" description="Stay updated with your activity">
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className="card p-4">
            <BodyText className="text-ghxst-text-primary mb-1">{notif.text}</BodyText>
            <Metadata className="text-ghxst-text-secondary">{notif.time}</Metadata>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
EOF

# Marketplace pages
cat > src/app/gvteway/marketplace/checkout/page.tsx << 'EOF'
import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { PageTitle, SectionHeader, BodyText } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';

export const metadata = { title: 'Checkout | GVTEWAY' };

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-ghxst-white">
      <Navigation />
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-8">
          <PageTitle className="mb-8 uppercase text-ghxst-primary">Checkout</PageTitle>
          <div className="card p-8">
            <SectionHeader className="mb-6 text-ghxst-primary">Complete Your Order</SectionHeader>
            <BodyText className="text-ghxst-text-secondary mb-8">
              Secure checkout powered by Stripe
            </BodyText>
            <Button variant="primary" size="lg" className="w-full">
              Complete Purchase
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
EOF

cat > src/app/gvteway/marketplace/orders/page.tsx << 'EOF'
'use client';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { Package } from 'lucide-react';
import { CardTitle, Metadata } from '@/components/atoms/Typography';
import { Badge } from '@/components/atoms/Badge';

export default function OrdersPage() {
  const orders = [{ id: '1', title: 'Order #1234', date: 'Nov 18, 2025', status: 'Delivered', total: 75 }];
  return (
    <ListPageTemplate title="My Orders" description="Track your marketplace orders">
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card p-6 flex items-center justify-between">
            <div>
              <CardTitle className="mb-2 text-ghxst-primary">{order.title}</CardTitle>
              <Metadata className="text-ghxst-text-secondary">{order.date}</Metadata>
            </div>
            <div className="text-right">
              <Badge variant="success" className="mb-2">{order.status}</Badge>
              <CardTitle className="text-ghxst-primary">${order.total}</CardTitle>
            </div>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
EOF

# Memberships pages
cat > src/app/gvteway/memberships/benefits/page.tsx << 'EOF'
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { Check } from 'lucide-react';
import { SectionHeader, BodyText } from '@/components/atoms/Typography';

export const metadata = { title: 'Membership Benefits | GVTEWAY' };

export default function BenefitsPage() {
  const benefits = ['Early access', 'Exclusive events', 'Priority support', 'Discounts'];
  return (
    <ListPageTemplate title="Membership Benefits" description="Unlock exclusive perks">
      <div className="grid md:grid-cols-2 gap-6">
        {benefits.map((benefit, i) => (
          <div key={i} className="card p-6 flex items-start gap-4">
            <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <SectionHeader className="mb-2 text-ghxst-primary">{benefit}</SectionHeader>
              <BodyText className="text-ghxst-text-secondary text-sm">
                Enjoy {benefit.toLowerCase()} with your membership
              </BodyText>
            </div>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
EOF

cat > src/app/gvteway/memberships/dashboard/page.tsx << 'EOF'
import { DashboardPageTemplate } from '@/components/templates/DashboardPageTemplate';
import { Crown, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { BodyText } from '@/components/atoms/Typography';

export const metadata = { title: 'Membership Dashboard | GVTEWAY' };

export default function MembershipDashboardPage() {
  return (
    <DashboardPageTemplate
      title="Membership Dashboard"
      description="Track your membership benefits and usage"
      stats={[
        { icon: <Crown className="w-8 h-8" />, title: 'Current Tier', value: 'Plus' },
        { icon: <Calendar className="w-8 h-8" />, title: 'Member Since', value: 'Jan 2025' },
        { icon: <DollarSign className="w-8 h-8" />, title: 'Savings', value: '$150' },
        { icon: <TrendingUp className="w-8 h-8" />, title: 'Events', value: '24' },
      ]}
      sections={[
        {
          title: 'Your Benefits',
          content: <BodyText className="text-ghxst-text-secondary">Access all Plus tier benefits</BodyText>,
        },
      ]}
    />
  );
}
EOF

echo "Batch conversion complete!"
