'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function AdventuresPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>VIP Adventures</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card variant="gvteway">
          <CardHeader>
            <CardTitle>VIP Experiences</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Exclusive VIP event experiences</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}