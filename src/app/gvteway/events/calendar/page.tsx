'use client';

import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { PageTitle, BodyText } from '@/components/atoms/Typography';

const metadata = { title: 'Event Calendar | GVTEWAY' };

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/events/calendar

export default function CalendarPage() {
  return (
    <GvtewayLayout>
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
    </GvtewayLayout>
  );
}
