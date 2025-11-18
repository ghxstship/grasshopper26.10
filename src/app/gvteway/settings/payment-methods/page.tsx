'use client';

import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { PageTitle, CardTitle } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { CreditCard, Plus } from 'lucide-react';

const metadata = { title: 'Payment Methods | GVTEWAY' };

export default function PaymentMethodsPage() {
  return (
    <GvtewayLayout>
      <section className="section-padding">
        <div className="max-w-2xl mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <PageTitle className="uppercase text-ghxst-primary">Payment Methods</PageTitle>
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4 mr-2" />Add Card
            </Button>
          </div>
          <div className="space-y-4">
            <div className="card p-6 flex items-center gap-4">
              <CreditCard className="w-8 h-8 text-ghxst-primary" />
              <div className="flex-1">
                <CardTitle className="text-ghxst-primary">•••• 4242</CardTitle>
                <p className="text-body-sm text-ghxst-text-secondary">Expires 12/25</p>
              </div>
              <Button variant="secondary" size="sm">Remove</Button>
            </div>
          </div>
        </div>
      </section>
    </GvtewayLayout>
  );
}
