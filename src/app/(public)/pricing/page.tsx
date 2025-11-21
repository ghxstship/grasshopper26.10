/**
 * Pricing Page - UI Rebuild
 * Pricing plans
 */

import * as React from 'react';
import Link from 'next/link';
import { Hero, H2, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <Hero className="mb-6">PRICING</Hero>
          <Body className="text-gray-600 text-lg">
            Choose the plan that fits your needs
          </Body>
        </div>

        <div className="text-center">
          <Body className="mb-8 text-gray-600">
            For detailed pricing information, please contact our sales team.
          </Body>
          <Link href="/contact">
            <Button size="lg">Contact Sales</Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
