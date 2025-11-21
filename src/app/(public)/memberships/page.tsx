'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';

export default function MembershipsPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Membership Tiers</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card variant="gvteway">
          <CardHeader>
            <CardTitle>Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Access exclusive benefits</p>
            <Button variant="primary" className="mt-4">Subscribe</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}