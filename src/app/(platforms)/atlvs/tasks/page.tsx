'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function TasksPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Tasks</SectionHeader>
      <Card variant="atlvs" className="mt-6">
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Assign and track tasks</p>
        </CardContent>
      </Card>
    </div>
  );
}