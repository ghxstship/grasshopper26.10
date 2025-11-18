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
