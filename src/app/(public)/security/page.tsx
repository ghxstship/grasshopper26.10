/**
 * Security Page - UI Rebuild
 */

import * as React from 'react';
import { Hero, H2, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Hero className="mb-12 text-center">SECURITY</Hero>
        <Card>
          <CardContent className="p-12 space-y-8">
            <div>
              <H2 className="mb-4">Data Encryption</H2>
              <Body className="text-gray-700 leading-relaxed">
                All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.
              </Body>
            </div>
            <div>
              <H2 className="mb-4">Infrastructure Security</H2>
              <Body className="text-gray-700 leading-relaxed">
                Our infrastructure is hosted on enterprise-grade cloud providers with SOC 2 Type II compliance.
              </Body>
            </div>
            <div>
              <H2 className="mb-4">Access Control</H2>
              <Body className="text-gray-700 leading-relaxed">
                Role-based access control (RBAC) and multi-factor authentication (MFA) protect all accounts.
              </Body>
            </div>
            <div>
              <H2 className="mb-4">Vulnerability Management</H2>
              <Body className="text-gray-700 leading-relaxed">
                Regular security audits, penetration testing, and automated vulnerability scanning.
              </Body>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
