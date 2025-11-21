'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function SocialPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Social Hub</SectionHeader>
      <Card variant="gvteway" className="mt-6">
        <CardHeader>
          <CardTitle>Community Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Connect with other event-goers</p>
        </CardContent>
      </Card>
    </div>
  );
}