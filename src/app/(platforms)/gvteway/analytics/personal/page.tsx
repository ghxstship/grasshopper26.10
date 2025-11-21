/**
 * Personal Analytics Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, H2, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';

export default function PersonalAnalyticsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <H1 className="mb-12">Personal Analytics</H1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Events Attended</Caption>
              <div className="font-anton text-5xl">24</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Total Spent</Caption>
              <div className="font-anton text-5xl">$2,840</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Tickets Owned</Caption>
              <div className="font-anton text-5xl">8</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Wishlist Items</Caption>
              <div className="font-anton text-5xl">12</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Event Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {['Music', 'Sports', 'Arts', 'Comedy'].map((category) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <Body>{category}</Body>
                    <Caption className="text-gray-500">35%</Caption>
                  </div>
                  <div className="h-2 bg-gray-200 border border-black">
                    <div className="h-full bg-black" style={{ width: '35%' }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Body className="text-gray-600 text-center py-12">Activity chart coming soon</Body>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
