'use client';

import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { PageTitle, BodyText } from '@/components/atoms/Typography';

const _metadata = { title: 'Privacy Settings | GVTEWAY' };

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/settings/privacy

export default function PrivacySettingsPage() {
  return (
    <GvtewayLayout>
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
    </GvtewayLayout>
  );
}
