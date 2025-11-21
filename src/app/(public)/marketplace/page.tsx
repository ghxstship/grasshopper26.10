'use client';

import { useCart } from '@/hooks/useCart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function MarketplacePage() {
  const { cart } = useCart();

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Marketplace</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <Card variant="gvteway">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Shop event merchandise</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}