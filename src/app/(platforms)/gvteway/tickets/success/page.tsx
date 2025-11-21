/**
 * Purchase Success Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { H1, H3, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { CheckCircle, Download, Wallet } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

function TicketSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <CheckCircle className="w-24 h-24 mx-auto mb-6 text-green-600" />
          <H1 className="mb-4">Purchase Successful!</H1>
          <Body className="text-gray-600">
            Your tickets have been confirmed and sent to your email
          </Body>
          {orderId && (
            <Body className="text-gray-500 text-sm mt-2">
              Order #{orderId}
            </Body>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="text-center py-8">
              <Download className="w-12 h-12 mx-auto mb-4 text-gray-900" />
              <H3 className="mb-2">Download Tickets</H3>
              <Body className="text-gray-600 text-sm mb-4">
                Get your tickets as PDF
              </Body>
              <Button variant="ghost" size="sm">Download</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-8">
              <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-900" />
              <H3 className="mb-2">Add to Wallet</H3>
              <Body className="text-gray-600 text-sm mb-4">
                Save to Apple/Google Wallet
              </Body>
              <Button variant="ghost" size="sm">Add</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-900" />
              <H3 className="mb-2">View Tickets</H3>
              <Body className="text-gray-600 text-sm mb-4">
                See all your tickets
              </Body>
              <Button variant="ghost" size="sm" onClick={() => router.push('/tickets')}>
                View
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <Body>Confirmation email sent to your inbox</Body>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <Body>Tickets available in your account</Body>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <Body>QR codes ready for venue entry</Body>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <Body>Event reminders will be sent before the show</Body>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button onClick={() => router.push('/events')}>
            Browse More Events
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function TicketSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TicketSuccessContent />
    </Suspense>
  );
}
