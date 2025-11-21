/**
 * COMPVSS Referrals Dashboard - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';

export default function CompvssReferralsPage() {
  const [referralLink] = React.useState('https://compvss.com/ref/ABC123');

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Referral Program</H1>
          <Body className="text-gray-600">Earn rewards by referring new team members</Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Total Referrals</Caption>
              <div className="font-anton text-5xl">12</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Active</Caption>
              <div className="font-anton text-5xl">8</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Rewards Earned</Caption>
              <div className="font-anton text-5xl">$240</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Rank</Caption>
              <div className="font-anton text-5xl">#15</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Input value={referralLink} readOnly className="flex-1" />
            <Button onClick={copyLink}>Copy</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Body className="text-gray-600 text-center py-12">Leaderboard coming soon</Body>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
