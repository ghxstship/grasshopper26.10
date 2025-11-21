/**
 * Checkout Success Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Hero, H2, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <div className="text-8xl mb-6">✓</div>
          <Hero className="mb-4">Order Confirmed!</Hero>
          {orderNumber && (
            <Body className="text-gray-600 text-lg">
              Order #{orderNumber}
            </Body>
          )}
        </div>

        <Card>
          <CardContent className="p-12 text-center space-y-6">
            <H2 className="mb-4">Thank You for Your Purchase</H2>
            <Body className="text-gray-700 mb-8">
              Your order has been confirmed and you will receive an email confirmation shortly.
            </Body>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/(rebuild)/orders">
                <Button size="lg">View Orders</Button>
              </Link>
              <Link href="/(rebuild)/events">
                <Button variant="secondary" size="lg">Continue Shopping</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
