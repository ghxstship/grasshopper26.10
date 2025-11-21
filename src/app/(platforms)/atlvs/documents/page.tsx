'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function DocumentsPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Documents</SectionHeader>
      <Card variant="atlvs" className="mt-6">
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage contracts, permits, and documents</p>
        </CardContent>
      </Card>
    </div>
  );
}