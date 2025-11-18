#!/bin/bash

# Adventures sub-pages
cat > src/app/gvteway/adventures/bookings/page.tsx << 'EOF'
'use client';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { Calendar, MapPin } from 'lucide-react';
import { CardTitle, Metadata } from '@/components/atoms/Typography';
import { Badge } from '@/components/atoms/Badge';

export default function BookingsPage() {
  const bookings = [{ id: '1', title: 'VIP Tour', date: 'Dec 15, 2025', location: 'Tampa', status: 'Confirmed' }];
  return (
    <ListPageTemplate title="My Bookings" description="Your adventure bookings">
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <CardTitle className="text-ghxst-primary">{booking.title}</CardTitle>
              <Badge variant="success">{booking.status}</Badge>
            </div>
            <div className="space-y-2">
              <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                <Calendar className="w-4 h-4" />{booking.date}
              </Metadata>
              <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                <MapPin className="w-4 h-4" />{booking.location}
              </Metadata>
            </div>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
EOF

cat > src/app/gvteway/adventures/vip/page.tsx << 'EOF'
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { Crown } from 'lucide-react';
import { CardTitle, BodyText } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';

export const metadata = { title: 'VIP Experiences | GVTEWAY' };

export default function VIPPage() {
  const experiences = [{ id: '1', title: 'VIP Backstage Pass', description: 'Exclusive access', price: 299 }];
  return (
    <ListPageTemplate title="VIP Experiences" description="Exclusive VIP access and packages">
      <div className="grid md:grid-cols-2 gap-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="card p-6">
            <Crown className="w-8 h-8 text-ghxst-primary mb-4" />
            <CardTitle className="mb-2 text-ghxst-primary">{exp.title}</CardTitle>
            <BodyText className="text-ghxst-text-secondary mb-4">{exp.description}</BodyText>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-anton text-ghxst-primary">${exp.price}</span>
              <Button variant="primary" size="sm">Book Now</Button>
            </div>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
EOF

cat > src/app/gvteway/adventures/meet-greet/page.tsx << 'EOF'
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { Users } from 'lucide-react';
import { CardTitle, BodyText } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';

export const metadata = { title: 'Meet & Greets | GVTEWAY' };

export default function MeetGreetPage() {
  const events = [{ id: '1', title: 'Artist Meet & Greet', description: 'Meet your favorite artist', price: 149 }];
  return (
    <ListPageTemplate title="Meet & Greets" description="Meet your favorite artists">
      <div className="grid md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className="card p-6">
            <Users className="w-8 h-8 text-ghxst-primary mb-4" />
            <CardTitle className="mb-2 text-ghxst-primary">{event.title}</CardTitle>
            <BodyText className="text-ghxst-text-secondary mb-4">{event.description}</BodyText>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-anton text-ghxst-primary">${event.price}</span>
              <Button variant="primary" size="sm">Book Now</Button>
            </div>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
EOF

cat > src/app/gvteway/adventures/tours/page.tsx << 'EOF'
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { Compass } from 'lucide-react';
import { CardTitle, BodyText } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';

export const metadata = { title: 'Tours | GVTEWAY' };

export default function ToursPage() {
  const tours = [{ id: '1', title: 'City Tour', description: 'Explore the city', price: 79 }];
  return (
    <ListPageTemplate title="Tours" description="Guided tours and experiences">
      <div className="grid md:grid-cols-2 gap-6">
        {tours.map((tour) => (
          <div key={tour.id} className="card p-6">
            <Compass className="w-8 h-8 text-ghxst-primary mb-4" />
            <CardTitle className="mb-2 text-ghxst-primary">{tour.title}</CardTitle>
            <BodyText className="text-ghxst-text-secondary mb-4">{tour.description}</BodyText>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-anton text-ghxst-primary">${tour.price}</span>
              <Button variant="primary" size="sm">Book Now</Button>
            </div>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
EOF

# Events sub-pages
cat > src/app/gvteway/events/calendar/page.tsx << 'EOF'
import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { PageTitle, BodyText } from '@/components/atoms/Typography';

export const metadata = { title: 'Event Calendar | GVTEWAY' };

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-ghxst-white">
      <Navigation />
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <PageTitle className="mb-4 uppercase text-ghxst-primary">Event Calendar</PageTitle>
          <BodyText className="text-ghxst-text-secondary mb-8">
            View events in calendar format
          </BodyText>
          <div className="card p-8 text-center">
            <BodyText className="text-ghxst-text-secondary">
              Calendar view coming soon
            </BodyText>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
EOF

cat > src/app/gvteway/events/map/page.tsx << 'EOF'
import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { PageTitle, BodyText } from '@/components/atoms/Typography';

export const metadata = { title: 'Event Map | GVTEWAY' };

export default function MapPage() {
  return (
    <div className="min-h-screen bg-ghxst-white">
      <Navigation />
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <PageTitle className="mb-4 uppercase text-ghxst-primary">Event Map</PageTitle>
          <BodyText className="text-ghxst-text-secondary mb-8">
            Discover events near you
          </BodyText>
          <div className="card p-8 text-center">
            <BodyText className="text-ghxst-text-secondary">
              Map view coming soon
            </BodyText>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
EOF

cat > src/app/gvteway/events/search/page.tsx << 'EOF'
'use client';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { Search } from 'lucide-react';
import { Input } from '@/components/atoms/Input';
import { useState } from 'react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  return (
    <ListPageTemplate title="Search Events" description="Find your next experience">
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ghxst-text-secondary" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, artists, venues..."
            className="pl-12"
          />
        </div>
      </div>
      <div className="card p-8 text-center">
        <p className="text-ghxst-text-secondary">
          {query ? `Searching for "${query}"...` : 'Enter a search term to find events'}
        </p>
      </div>
    </ListPageTemplate>
  );
}
EOF

# Settings sub-pages
cat > src/app/gvteway/settings/account/page.tsx << 'EOF'
import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { PageTitle, SectionHeader } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';

export const metadata = { title: 'Account Settings | GVTEWAY' };

export default function AccountSettingsPage() {
  return (
    <div className="min-h-screen bg-ghxst-white">
      <Navigation />
      <section className="section-padding">
        <div className="max-w-2xl mx-auto px-8">
          <PageTitle className="mb-8 uppercase text-ghxst-primary">Account Settings</PageTitle>
          <div className="space-y-6">
            <div className="card p-6">
              <SectionHeader className="mb-4 text-ghxst-primary">Email</SectionHeader>
              <Input type="email" defaultValue="user@example.com" className="mb-4" />
              <Button variant="primary" size="md">Update Email</Button>
            </div>
            <div className="card p-6">
              <SectionHeader className="mb-4 text-ghxst-primary">Password</SectionHeader>
              <Button variant="secondary" size="md">Change Password</Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
EOF

cat > src/app/gvteway/settings/notifications/page.tsx << 'EOF'
import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { PageTitle, BodyText } from '@/components/atoms/Typography';

export const metadata = { title: 'Notification Settings | GVTEWAY' };

export default function NotificationSettingsPage() {
  return (
    <div className="min-h-screen bg-ghxst-white">
      <Navigation />
      <section className="section-padding">
        <div className="max-w-2xl mx-auto px-8">
          <PageTitle className="mb-4 uppercase text-ghxst-primary">Notifications</PageTitle>
          <BodyText className="text-ghxst-text-secondary mb-8">
            Manage your notification preferences
          </BodyText>
          <div className="space-y-4">
            {['Email notifications', 'Push notifications', 'SMS alerts'].map((item) => (
              <div key={item} className="card p-6 flex items-center justify-between">
                <BodyText className="text-ghxst-text-primary">{item}</BodyText>
                <input type="checkbox" className="w-5 h-5" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
EOF

cat > src/app/gvteway/settings/privacy/page.tsx << 'EOF'
import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { PageTitle, BodyText } from '@/components/atoms/Typography';

export const metadata = { title: 'Privacy Settings | GVTEWAY' };

export default function PrivacySettingsPage() {
  return (
    <div className="min-h-screen bg-ghxst-white">
      <Navigation />
      <section className="section-padding">
        <div className="max-w-2xl mx-auto px-8">
          <PageTitle className="mb-4 uppercase text-ghxst-primary">Privacy</PageTitle>
          <BodyText className="text-ghxst-text-secondary mb-8">
            Control your privacy settings
          </BodyText>
          <div className="space-y-4">
            {['Profile visibility', 'Activity status', 'Data sharing'].map((item) => (
              <div key={item} className="card p-6 flex items-center justify-between">
                <BodyText className="text-ghxst-text-primary">{item}</BodyText>
                <input type="checkbox" className="w-5 h-5" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
EOF

cat > src/app/gvteway/settings/payment-methods/page.tsx << 'EOF'
import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { PageTitle, CardTitle } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { CreditCard, Plus } from 'lucide-react';

export const metadata = { title: 'Payment Methods | GVTEWAY' };

export default function PaymentMethodsPage() {
  return (
    <div className="min-h-screen bg-ghxst-white">
      <Navigation />
      <section className="section-padding">
        <div className="max-w-2xl mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <PageTitle className="uppercase text-ghxst-primary">Payment Methods</PageTitle>
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4 mr-2" />Add Card
            </Button>
          </div>
          <div className="space-y-4">
            <div className="card p-6 flex items-center gap-4">
              <CreditCard className="w-8 h-8 text-ghxst-primary" />
              <div className="flex-1">
                <CardTitle className="text-ghxst-primary">•••• 4242</CardTitle>
                <p className="text-sm text-ghxst-text-secondary">Expires 12/25</p>
              </div>
              <Button variant="secondary" size="sm">Remove</Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
EOF

echo "All remaining pages converted!"
