'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function EventsMapPage() {
  const [events, setEvents] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events/map')
      .then(res => res.json())
      .then(data => {
        setEvents(data.data);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Events Map</SectionHeader>
      <Card variant="gvteway" className="mt-6">
        <CardHeader>
          <CardTitle>Find Events Near You</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading map...</p>
          ) : (
            <div className="h-96 bg-gray-100 rounded flex items-center justify-center">
              <p>Map view with {events?.features?.length || 0} events</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
