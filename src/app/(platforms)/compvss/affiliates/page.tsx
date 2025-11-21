'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function AffiliatesPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Affiliate Program</SectionHeader>
      <Card variant="compvss" className="mt-6">
        <CardHeader>
          <CardTitle>Your Affiliate Links</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Track referrals and earnings</p>
        </CardContent>
      </Card>
    </div>
  );
}