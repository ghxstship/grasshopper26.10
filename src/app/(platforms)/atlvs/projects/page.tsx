'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function ProjectsPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Projects</SectionHeader>
      <Card variant="atlvs" className="mt-6">
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage production projects</p>
        </CardContent>
      </Card>
    </div>
  );
}