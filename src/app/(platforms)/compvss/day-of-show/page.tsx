'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function DayOfShowPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Day of Show</SectionHeader>
      <Card variant="compvss" className="mt-6">
        <CardHeader>
          <CardTitle>Tasks & Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage day-of-show operations</p>
        </CardContent>
      </Card>
    </div>
  );
}