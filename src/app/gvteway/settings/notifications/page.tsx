'use client';

import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { PageTitle, BodyText } from '@/components/atoms/Typography';

const metadata = { title: 'Notification Settings | GVTEWAY' };

export default function NotificationSettingsPage() {
  return (
    <GvtewayLayout>
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
    </GvtewayLayout>
  );
}
