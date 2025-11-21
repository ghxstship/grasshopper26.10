'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function WorkflowsPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>N8N Workflows</SectionHeader>
      <Card variant="atlvs" className="mt-6">
        <CardHeader>
          <CardTitle>Automation Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Create and execute automated workflows</p>
        </CardContent>
      </Card>
    </div>
  );
}