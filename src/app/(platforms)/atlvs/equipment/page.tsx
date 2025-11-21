'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function EquipmentPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Equipment</SectionHeader>
      <Card variant="atlvs" className="mt-6">
        <CardHeader>
          <CardTitle>Equipment Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage and book equipment</p>
        </CardContent>
      </Card>
    </div>
  );
}