'use client';

import { useCheckout } from '@/hooks/useCheckout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function CheckoutPage() {
  const { initiateCheckout, isProcessing } = useCheckout();

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Checkout</SectionHeader>
      <Card variant="gvteway" className="mt-6">
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="primary" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Complete Purchase'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}