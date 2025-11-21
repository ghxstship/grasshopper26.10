'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function EventsCalendarPage() {
  const [calendar, setCalendar] = useState<any>(null);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetch(`/api/events/calendar?month=${month}`)
      .then(res => res.json())
      .then(data => setCalendar(data.data));
  }, [month]);

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Events Calendar</SectionHeader>
      <Card variant="gvteway" className="mt-6">
        <CardHeader>
          <CardTitle>Browse Events by Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {calendar && Object.entries(calendar.calendar || {}).map(([date, events]: [string, any]) => (
              <div key={date} className="p-2 border rounded">
                <div className="font-bold">{new Date(date).getDate()}</div>
                <div className="text-sm">{events.length} events</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
