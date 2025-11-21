/**
 * Payment Settings Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';

export default function PaymentSettingsPage() {
  const paymentMethods = [
    { id: '1', type: 'Visa', last4: '4242', expires: '12/25', isDefault: true },
    { id: '2', type: 'Mastercard', last4: '8888', expires: '03/26', isDefault: false },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <H1 className="mb-2">Payment Methods</H1>
            <Body className="text-gray-600">Manage your payment methods</Body>
          </div>
          <Button>Add Payment Method</Button>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <Card key={method.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{method.type} •••• {method.last4}</CardTitle>
                    <CardDescription>Expires {method.expires}</CardDescription>
                  </div>
                  {method.isDefault && <Badge>Default</Badge>}
                </div>
              </CardHeader>
              <CardFooter className="flex gap-3">
                {!method.isDefault && (
                  <Button variant="secondary">Set as Default</Button>
                )}
                <Button variant="ghost">Remove</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
