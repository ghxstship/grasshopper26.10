'use client';

import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { Users } from 'lucide-react';
import { CardTitle, BodyText } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/adventures/meet-greet

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
              <span className="text-ghxst-primary">${event.price}</span>
              <Button variant="primary" size="sm">Book Now</Button>
            </div>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
