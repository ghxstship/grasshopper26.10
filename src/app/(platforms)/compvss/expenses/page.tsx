'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function ExpensesPage() {
  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Expense Reports</SectionHeader>
      <Card variant="compvss" className="mt-6">
        <CardHeader>
          <CardTitle>Submit Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage expense submissions</p>
        </CardContent>
      </Card>
    </div>
  );
}