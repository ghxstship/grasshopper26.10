'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function IssuesPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Issue Reports</SectionHeader>
      <Card variant="compvss" className="mt-6">
        <CardHeader>
          <CardTitle>Active Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Track and resolve issues</p>
        </CardContent>
      </Card>
    </div>
  );
}