/**
 * About Page - UI Rebuild
 * About GHXSTSHIP
 */

import * as React from 'react';
import { Hero, H2, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Hero className="mb-12 text-center">ABOUT GHXSTSHIP</Hero>

        <div className="space-y-12">
          <Card>
            <CardContent className="p-12">
              <H2 className="mb-6">Our Mission</H2>
              <Body className="text-gray-700 leading-relaxed">
                GHXSTSHIP is revolutionizing the event and production management industry through three integrated platforms: GVTEWAY for consumers, COMPVSS for external teams, and ATLVS for internal production management.
              </Body>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-12">
              <H2 className="mb-6">Our Platforms</H2>
              <div className="space-y-6">
                <div>
                  <H2 className="mb-2">GVTEWAY</H2>
                  <Body className="text-gray-700">
                    Consumer platform for discovering events, purchasing tickets, and experiencing unforgettable moments.
                  </Body>
                </div>
                <div>
                  <H2 className="mb-2">COMPVSS</H2>
                  <Body className="text-gray-700">
                    External team platform for production advancing, operations management, and day-of-show coordination.
                  </Body>
                </div>
                <div>
                  <H2 className="mb-2">ATLVS</H2>
                  <Body className="text-gray-700">
                    Internal production platform for project management, budgeting, asset tracking, and workflow automation.
                  </Body>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
