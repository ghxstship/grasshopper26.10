/**
 * Events Calendar View - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';

export default function EventsCalendarPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <H1 className="mb-8">Events Calendar</H1>
        <Card>
          <CardContent className="py-24 text-center">
            <Body className="text-gray-600">Calendar view coming soon</Body>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
