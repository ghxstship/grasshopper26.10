/**
 * Terms of Service Page - UI Rebuild
 */

import * as React from 'react';
import { Hero, H2, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Hero className="mb-12 text-center">TERMS OF SERVICE</Hero>
        <Card>
          <CardContent className="p-12 space-y-8">
            <div>
              <H2 className="mb-4">1. Acceptance of Terms</H2>
              <Body className="text-gray-700 leading-relaxed">
                By accessing and using GHXSTSHIP platforms (GVTEWAY, COMPVSS, ATLVS), you accept and agree to be bound by these Terms of Service.
              </Body>
            </div>
            <div>
              <H2 className="mb-4">2. Use of Services</H2>
              <Body className="text-gray-700 leading-relaxed">
                You agree to use our services only for lawful purposes and in accordance with these Terms.
              </Body>
            </div>
            <div>
              <H2 className="mb-4">3. User Accounts</H2>
              <Body className="text-gray-700 leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
              </Body>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
