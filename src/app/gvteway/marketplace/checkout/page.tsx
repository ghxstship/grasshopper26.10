'use client';

import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { PageTitle, SectionHeader, BodyText } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';

const metadata = { title: 'Checkout | GVTEWAY' };

export default function CheckoutPage() {
  return (
    <GvtewayLayout>
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-8">
          <PageTitle className="mb-8 uppercase text-ghxst-primary">Checkout</PageTitle>
          <div className="card p-8">
            <SectionHeader className="mb-6 text-ghxst-primary">Complete Your Order</SectionHeader>
            <BodyText className="text-ghxst-text-secondary mb-8">
              Secure checkout powered by Stripe
            </BodyText>
            <Button variant="primary" size="lg" className="w-full">
              Complete Purchase
            </Button>
          </div>
        </div>
      </section>
    </GvtewayLayout>
  );
}
