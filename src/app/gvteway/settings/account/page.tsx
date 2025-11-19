'use client';

import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { PageTitle, SectionHeader } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';

const metadata = { title: 'Account Settings | GVTEWAY' };

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/settings/account

export default function AccountSettingsPage() {
  return (
    <GvtewayLayout>
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
    </GvtewayLayout>
  );
}
