/**
 * Privacy Policy Page - UI Rebuild
 */

import * as React from 'react';
import { Hero, H2, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Hero className="mb-12 text-center">PRIVACY POLICY</Hero>
        <Card>
          <CardContent className="p-12 space-y-8">
            <div>
              <H2 className="mb-4">Information We Collect</H2>
              <Body className="text-gray-700 leading-relaxed">
                We collect information you provide directly, information collected automatically, and information from third parties.
              </Body>
            </div>
            <div>
              <H2 className="mb-4">How We Use Your Information</H2>
              <Body className="text-gray-700 leading-relaxed">
                We use collected information to provide, maintain, and improve our services, process transactions, and communicate with you.
              </Body>
            </div>
            <div>
              <H2 className="mb-4">Data Security</H2>
              <Body className="text-gray-700 leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized access and disclosure.
              </Body>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
