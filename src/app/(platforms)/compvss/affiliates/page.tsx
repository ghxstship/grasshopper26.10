/**
 * COMPVSS Affiliates Dashboard - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, H2, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';

export default function CompvssAffiliatesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Affiliate Dashboard</H1>
          <Body className="text-gray-600">Track your referrals and commissions</Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Total Clicks</Caption>
              <div className="font-anton text-4xl">1,234</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Conversions</Caption>
              <div className="font-anton text-4xl">56</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Commission</Caption>
              <div className="font-anton text-4xl">$2,840</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Pending</Caption>
              <div className="font-anton text-4xl">$420</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Links</CardTitle>
            </CardHeader>
            <CardContent>
              <Button fullWidth>Generate New Link</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Marketing Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <Button fullWidth>Download Assets</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
