'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function BudgetsPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Budgets</SectionHeader>
      <Card variant="atlvs" className="mt-6">
        <CardHeader>
          <CardTitle>Budget Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Track project budgets and expenses</p>
        </CardContent>
      </Card>
    </div>
  );
}