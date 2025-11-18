'use client';

import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { PageTitle, BodyText } from '@/components/atoms/Typography';

const metadata = { title: 'Event Map | GVTEWAY' };

export default function MapPage() {
  return (
    <GvtewayLayout>
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
    </GvtewayLayout>
  );
}
