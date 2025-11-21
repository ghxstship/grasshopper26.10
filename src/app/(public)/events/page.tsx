'use client';

import { useEvents } from '@/hooks/atlvs/useEvents';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function EventsPage() {
  const { events, isLoading } = useEvents();

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Discover Events</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {isLoading ? (
          <p>Loading events...</p>
        ) : (
          events.map((event) => (
            <Card key={event.id} variant="gvteway">
              <CardHeader>
                <CardTitle>{event.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{event.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}